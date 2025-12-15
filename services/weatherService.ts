import { WeatherData, DailyForecast } from '../types';
import { BIHAR_DATA } from './biharData';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Step 1: Get Coordinates
 * Looks up the coordinates based on District and Block names.
 */
export async function getCoordinates(district: string, block: string): Promise<{ lat: number; lon: number; name: string } | null> {
  return new Promise((resolve) => {
    const districtData = BIHAR_DATA[district];
    if (districtData) {
      const blockCoords = districtData.blocks[block];
      if (blockCoords) {
        resolve({
          lat: blockCoords.lat,
          lon: blockCoords.lon,
          name: `${block}, ${district}, Bihar`
        });
        return;
      }
    }
    resolve(null);
  });
}

/**
 * Step 2: Get Weather Data for Lat/Lon
 * Updated to fetch Rain Probability, Wind Speed, and Weather Code for 7 days.
 */
export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,relative_humidity_2m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weather_code',
      timezone: 'auto'
    });

    const response = await fetch(`${WEATHER_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather fetch error:", error);
    throw new Error("Failed to fetch weather data. Please check connection.");
  }
}

/**
 * Step 3: Process Raw Data into UI-friendly Forecast Array
 */
export function processForecast(data: WeatherData): DailyForecast[] {
  const daily = data.daily;
  return daily.time.map((time, index) => ({
    date: time,
    maxTemp: daily.temperature_2m_max[index],
    minTemp: daily.temperature_2m_min[index],
    rainProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[index] : 0,
    windSpeed: daily.wind_speed_10m_max ? daily.wind_speed_10m_max[index] : 0,
    weatherCode: daily.weather_code ? daily.weather_code[index] : 0
  }));
}