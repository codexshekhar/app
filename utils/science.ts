import { CropType, CalculationInput, WaterResult } from '../types';

/**
 * SECTION 1: THE SCIENTIFIC ENGINE
 * 
 * This file implements the Hargreaves-Samani Equation.
 * While the Penman-Monteith equation is the FAO standard, it requires wind speed 
 * and solar radiation data which isn't always available to simple sensors or free APIs.
 * 
 * Hargreaves is excellent because it only requires Temperature and Latitude.
 */

// Crop Coefficients (Kc) - FAO 56 Standards & Indian Agricultural Data
// This factor adjusts the baseline water usage (ET0) for the specific plant type.
// Values represent mid-season (peak demand) averages.
const CROP_COEFFICIENTS: Record<CropType, number> = {
  [CropType.TOMATO]: 1.15,
  [CropType.CORN]: 1.2,
  [CropType.WHEAT]: 1.15,
  [CropType.LAWN]: 0.95,
  [CropType.RICE]: 1.20,
  [CropType.PULSES]: 1.0,
  [CropType.SUGARCANE]: 1.25, // Very high water need
  [CropType.POTATO]: 1.15,
  [CropType.MUSTARD]: 1.05,
  [CropType.ONION]: 1.05,
  [CropType.MANGO]: 0.95,     // Tree crops often have lower Kc than field crops per area due to canopy
  [CropType.LITCHI]: 0.95,
  [CropType.BANANA]: 1.10,    // High water need
  [CropType.JUTE]: 1.10,
  [CropType.CHILLI]: 1.05,
  [CropType.BRINJAL]: 1.05,
  [CropType.CAULIFLOWER]: 1.05
};

/**
 * Calculates Extraterrestrial Radiation (Ra)
 * Ra is the solar radiation hitting the top of the atmosphere at a specific latitude.
 * 
 * @param latitude - The location's latitude in degrees
 * @param date - The date of calculation
 * @returns Ra in MJ m-2 day-1
 */
function calculateExtraterrestrialRadiation(latitude: number, date: Date): number {
  // Convert latitude to radians
  const latRad = (Math.PI / 180) * latitude;

  // Calculate Day of Year (J)
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Solar Declination (delta)
  // The angle between the rays of the sun and the plane of the earth's equator
  const delta = 0.409 * Math.sin(((2 * Math.PI) / 365) * dayOfYear - 1.39);

  // Sunset Hour Angle (omega_s)
  const omega_s = Math.acos(-Math.tan(latRad) * Math.tan(delta));

  // Relative distance Earth-Sun (dr)
  const dr = 1 + 0.033 * Math.cos(((2 * Math.PI) / 365) * dayOfYear);

  // Solar Constant (Gsc) = 0.0820 MJ m-2 min-1
  const Gsc = 0.0820;

  // Final Ra Calculation
  const Ra = (24 * 60 / Math.PI) * Gsc * dr * (
    (omega_s * Math.sin(latRad) * Math.sin(delta)) +
    (Math.cos(latRad) * Math.cos(delta) * Math.sin(omega_s))
  );

  return Ra;
}

/**
 * THE CORE FUNCTION
 * Calculates Crop Water Need using Hargreaves Equation.
 */
export function calculateWaterNeed(input: CalculationInput): WaterResult {
  const { tMin, tMax, latitude, crop, date } = input;
  
  // 1. Calculate Mean Temperature
  const tMean = (tMax + tMin) / 2;

  // 2. Calculate Extraterrestrial Radiation (Ra) based on location and date
  const Ra = calculateExtraterrestrialRadiation(latitude, date);

  // 3. Hargreaves Equation for Reference Evapotranspiration (ET0)
  // ET0 = 0.0023 * Ra * (Tmean + 17.8) * sqrt(Tmax - Tmin)
  // 0.0023 is an empirical coefficient.
  // We add 17.8 to convert Celsius for the formula's scale.
  // The square root of the temp range represents cloudiness/radiation proxy.
  let et0 = 0.0023 * Ra * (tMean + 17.8) * Math.sqrt(tMax - tMin);

  // Safety check: ET0 cannot be negative
  if (et0 < 0) et0 = 0;

  // 4. Get Crop Coefficient (Kc)
  const Kc = CROP_COEFFICIENTS[crop];

  // 5. Calculate Crop Evapotranspiration (ETc)
  // ETc = ET0 * Kc
  const etc = et0 * Kc;

  // 6. Convert mm/day to Liters per Square Meter (1 mm = 1 L/m2)
  const litersPerSqMeter = parseFloat(etc.toFixed(2));

  return {
    et0: parseFloat(et0.toFixed(2)),
    etc: parseFloat(etc.toFixed(2)),
    litersPerSqMeter,
    advice: `Based on a Kc of ${Kc}, your ${crop} calculates a water loss of ${litersPerSqMeter} liters today.`
  };
}