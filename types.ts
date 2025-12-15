
// --- APP SETTINGS ---
export type Language = 'en' | 'hi';

// --- USER & AUTH ---
export type UserRole = 'farmer' | 'admin' | 'seller';

export interface User {
  id: string; // Added ID
  name: string;
  phone?: string; // Optional now
  email?: string; // Added Email
  district: string;
  role: UserRole; // Added Role
  isLoggedIn: boolean;
  profileImage?: string; // For Google Auth picture
}

// --- COMMERCE TYPES ---
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string; // Link to user
  userName: string;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  address: string;
}

// --- ADMIN & ANALYTICS TYPES ---
export interface AiUsageStats {
  agronomistAdvice: number;
  deepAnalysis: number;
  marketInsights: number;
  nearbyResources: number;
  plantDoctor: number; // New Feature
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: Date;
  read: boolean;
}

// --- DATABASE SCHEMA CONCEPTS ---
export interface SavedField {
  id: string;
  name: string;
  district: string;
  block: string;
  cropType: CropType;
}

// --- STORE TYPES ---
export type ProductCategory = 'seeds' | 'fertilizers' | 'chemicals' | 'tools';

export interface Product {
  id: string;
  sellerId?: string; // Link to seller (optional for initial seed data)
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  description: string;
  imageColor: string; // To generate placeholder UI
  popular?: boolean;
}

// --- SCIENTIFIC TYPES ---

// Soil Types common in Bihar
export enum SoilType {
  ALLUVIAL = 'Alluvial Soil (Doamt)', // Common in North Bihar
  CLAY = 'Clay Soil (Kewal)',         // Heavy soil, South Bihar/Tal area
  SANDY_LOAM = 'Sandy Loam (Balui)',  // Banka/Jamui area
  LOAM = 'Loam (Matiyar)',            // General agriculture
  RED_YELLOW = 'Red/Yellow Soil'      // Hilly areas
}

// Crop Types supported by the system
export enum CropType {
  TOMATO = 'Tomato',
  CORN = 'Corn (Maize)',
  WHEAT = 'Wheat',
  LAWN = 'Lawn (Turfgrass)',
  RICE = 'Rice (Paddy)',
  PULSES = 'Pulses (Dal)',
  SUGARCANE = 'Sugarcane',
  POTATO = 'Potato',
  MUSTARD = 'Mustard (Oilseeds)',
  ONION = 'Onion',
  MANGO = 'Mango',
  LITCHI = 'Litchi',
  BANANA = 'Banana',
  JUTE = 'Jute',
  CHILLI = 'Chilli',
  BRINJAL = 'Brinjal',
  CAULIFLOWER = 'Cauliflower'
}

// Input data for the calculator
export interface CalculationInput {
  latitude: number;
  date: Date;
  tMin: number; // Minimum Temperature (Celsius)
  tMax: number; // Maximum Temperature (Celsius)
  humidity: number; // Relative Humidity (%)
  crop: CropType;
}

// The result returned by the scientific engine
export interface WaterResult {
  et0: number; // Reference Evapotranspiration (mm/day)
  etc: number; // Crop Evapotranspiration (mm/day)
  litersPerSqMeter: number; // Final water need
  advice: string; // Basic advice
}

// Processed Forecast Data for UI
export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  rainProb: number;
  windSpeed: number;
  weatherCode: number; // WMO code for icons
}

// Weather API Response structure (Raw from Open-Meteo)
export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    time: string;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
    time: string[];
  };
  latitude: number;
  longitude: number;
}
