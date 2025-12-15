import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { CropType, WaterResult, Language, SoilType } from "../types";

// Initialize Gemini
// We allow the key to be empty to trigger the Fallback/Simulation mode gracefully.
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export interface GeminiResponse {
  text: string;
  groundingMetadata?: any; // Contains chunks for Search and Maps
}

// --- RATE LIMITER CONFIGURATION ---
const RATE_LIMIT_KEY = 'ecoflow_user_usage';
export const USAGE_LIMITS = {
  RPM: 15,       // Requests per minute (Google Free Tier limit)
  DAILY: 50      // Generous daily limit per farmer
};

// Helper: Check and Increment Usage
const checkAndIncrementLimit = (): { allowed: boolean; reason?: 'daily' | 'rate' } => {
  try {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    
    let data = stored ? JSON.parse(stored) : { date: today, count: 0, timestamps: [] };

    // Reset if it's a new day
    if (data.date !== today) {
      data = { date: today, count: 0, timestamps: [] };
    }

    // 1. Check Daily Limit
    if (data.count >= USAGE_LIMITS.DAILY) {
      return { allowed: false, reason: 'daily' };
    }

    // 2. Check RPM (Requests Per Minute)
    // Filter out timestamps older than 60 seconds
    data.timestamps = data.timestamps.filter((t: number) => now - t < 60000);
    
    if (data.timestamps.length >= USAGE_LIMITS.RPM) {
      return { allowed: false, reason: 'rate' };
    }

    // 3. Increment Usage (Optimistic)
    data.count++;
    data.timestamps.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    
    return { allowed: true };
  } catch (e) {
    // If localStorage fails (rare), allow the request to prevent app breakage
    return { allowed: true }; 
  }
};

// Export rate limit check for UI components
export const checkRateLimit = () => {
  const result = checkAndIncrementLimit();
  return result.allowed;
};

// Export helper to read usage for UI
export const getUserUsage = () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) return { count: 0, limit: USAGE_LIMITS.DAILY };
    
    const data = JSON.parse(stored);
    if (data.date !== today) return { count: 0, limit: USAGE_LIMITS.DAILY };
    
    return { count: data.count, limit: USAGE_LIMITS.DAILY };
  } catch {
    return { count: 0, limit: USAGE_LIMITS.DAILY };
  }
};

// --- MOCK DATA GENERATORS (FOR FREE/UNLIMITED DEMO MODE) ---

const getMockAdvice = (crop: string, lang: Language) => {
  if (lang === 'hi') {
    return `1. ${crop} के लिए आज हल्की सिंचाई करें।\n2. नमी बनाए रखने के लिए खेत में मल्चिंग (Mulching) करें।\n3. कीटों की निगरानी के लिए शाम को खेत का निरीक्षण करें।`;
  }
  return `1. Apply light irrigation for ${crop} today.\n2. Use mulching to retain soil moisture.\n3. Scout the field in the evening for early pest signs.`;
};

const getMockAnalysis = (crop: string, lang: Language) => {
  if (lang === 'hi') {
    return `**${crop} के लिए 7-दिवसीय योजना (सिमुलेशन):**\n\n*   **दिन 1:** मिट्टी की नमी की जाँच करें और आवश्यकतानुसार पानी दें।\n*   **दिन 2:** खरपतवार निकालें।\n*   **दिन 3:** यूरिया का हल्का छिड़काव (यदि आवश्यक हो)।\n*   **दिन 4:** कीटों (जैसे तना छेदक) की जाँच करें।\n*   **दिन 5:** मौसम साफ रहने पर सिंचाई करें।\n*   **दिन 6:** पौधों की वृद्धि का निरीक्षण करें।\n*   **दिन 7:** अगले सप्ताह की खाद योजना तैयार करें।\n\n**जोखिम:** बिहार में इस समय आर्द्रता अधिक है, फफूंद (Fungus) का खतरा हो सकता है।`;
  }
  return `**7-Day Plan for ${crop} (Simulation):**\n\n*   **Day 1:** Check soil moisture at root zone.\n*   **Day 2:** Weeding operation recommended.\n*   **Day 3:** Apply Nitrogen supplement if leaves are yellowing.\n*   **Day 4:** Scout for Stem Borer pests.\n*   **Day 5:** Schedule irrigation if no rain is forecast.\n*   **Day 6:** Monitor crop canopy growth.\n*   **Day 7:** Plan nutrient management for next stage.\n\n**Risks:** High humidity in Bihar currently increases fungal disease risk.`;
};

const getMockMarket = (crop: string, district: string, lang: Language): GeminiResponse => {
  const price = Math.floor(Math.random() * (2500 - 1500) + 1500);
  const text = lang === 'hi' 
    ? `**${district} मंडी भाव:**\n${crop}: ₹${price}/क्विंटल\n\n**बाजार समाचार:**\nआवक सामान्य है। अगले सप्ताह मांग बढ़ने की संभावना है।`
    : `**${district} Mandi Rates:**\n${crop}: ₹${price}/quintal\n\n**Market News:**\nArrivals are normal. Demand expected to rise next week.`;
  
  return {
    text,
    groundingMetadata: {
      groundingChunks: [
        { web: { uri: "https://enam.gov.in", title: "e-NAM Portal" } },
        { web: { uri: "https://agmarknet.gov.in", title: "Agmarknet Bihar" } }
      ]
    }
  };
};

const getMockResources = (lang: Language): GeminiResponse => {
  const text = lang === 'hi'
    ? `**नजदीकी संसाधन (डेमो):**\n1. कृषि विज्ञान केंद्र (KVK) - 5 किमी\n2. इफको (IFFCO) बाजार - 2.5 किमी\n3. बिहार राज्य बीज निगम - 8 किमी`
    : `**Nearby Resources (Demo):**\n1. Krishi Vigyan Kendra (KVK) - 5 km\n2. IFFCO Bazar - 2.5 km\n3. Bihar State Seed Corp - 8 km`;
    
  return {
    text,
    groundingMetadata: {
      groundingChunks: [
        { maps: { title: "Krishi Vigyan Kendra", placeId: "mock1" } },
        { maps: { title: "IFFCO Bazar", placeId: "mock2" } }
      ]
    }
  };
};

const getMockDiagnosis = (lang: Language) => {
  if (lang === 'hi') {
    return `**पहचान:** अर्ली ब्लाइट (Early Blight) - फफूंद जनित रोग।\n\n**लक्षण:** पत्तियों पर भूरे रंग के धब्बे।\n\n**उपचार (जैविक):**\n- नीम तेल का छिड़काव करें।\n- प्रभावित पत्तियों को हटा दें।\n\n**रासायनिक:**\n- मैंकोजेब (Mancozeb) 2.5 ग्राम/लीटर पानी में मिलाकर छिड़कें।`;
  }
  return `**Diagnosis:** Early Blight (Fungal Disease).\n\n**Symptoms:** Concentric brown spots on lower leaves.\n\n**Organic Treatment:**\n- Spray Neem Oil solution.\n- Remove infected leaves immediately.\n\n**Chemical Treatment:**\n- Spray Mancozeb @ 2.5g/liter of water.`;
};

// --- HELPER: SYSTEM INSTRUCTION ---
const getSystemInstruction = (language: Language) => {
  if (language === 'hi') {
    return "You are a friendly agricultural expert (Kisan Sahayak) for Bihar. You MUST reply in HINDI (Devanagari script) only. Keep answers concise and practical for farmers. Use simple language.";
  }
  return "You are a friendly agricultural expert for Bihar. Reply in English only. Keep answers concise and practical.";
};

const withLang = (prompt: string, language: Language) => {
  const instruction = language === 'hi' ? "\nIMPORTANT: REPLY IN HINDI ONLY." : "\nIMPORTANT: REPLY IN ENGLISH ONLY.";
  return prompt + instruction;
};

// Helper to append Offline tag if using mock
const formatOfflineResponse = (text: string, lang: Language) => {
  const tag = lang === 'hi' ? '[ऑफ़लाइन मोड]' : '[Offline Mode]';
  return `${tag} ${text}`;
};

// --- API FUNCTIONS WITH RATE LIMITING ---

// 0. CHAT SESSION
export function createChatSession(language: Language): Chat | null {
  if (!apiKey) return null;
  
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: getSystemInstruction(language),
    }
  });
}

// 1. STANDARD ADVICE
export async function getAgronomistAdvice(
  crop: CropType, 
  location: string, 
  waterData: WaterResult,
  tMax: number,
  soil: SoilType,
  language: Language
): Promise<string> {
  // Check limit before call
  const limit = checkAndIncrementLimit();

  // If no key OR limit reached -> Use Mock
  if (!apiKey || !limit.allowed) {
    const mock = getMockAdvice(crop, language);
    // If it was a limit issue, prepend tag, otherwise just return mock (e.g. no key env)
    return limit.allowed ? mock : formatOfflineResponse(mock, language);
  }

  try {
    const prompt = `
      Region: ${location}, Crop: ${crop}, Soil: ${soil}, Max Temp: ${tMax}°C, Water Need: ${waterData.litersPerSqMeter} L/m2.
      Give 3 short practical tips for irrigation today.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: withLang(prompt, language),
      config: {
        systemInstruction: getSystemInstruction(language)
      }
    });

    return response.text || getMockAdvice(crop, language);
  } catch (error) {
    console.warn("Gemini API Error (Falling back to Simulation):", error);
    return formatOfflineResponse(getMockAdvice(crop, language), language);
  }
}

// 2. DEEP ANALYSIS
export async function getDeepAnalysis(
  crop: CropType,
  location: string,
  soil: SoilType,
  language: Language
): Promise<string> {
  const limit = checkAndIncrementLimit();
  if (!apiKey || !limit.allowed) {
    const mock = getMockAnalysis(crop, language);
    return limit.allowed ? mock : formatOfflineResponse(mock, language);
  }

  try {
    const prompt = `
      Create a 7-day irrigation and nutrient plan for ${crop} in ${location} (${soil}).
      Include specific pest risks for Bihar right now.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: withLang(prompt, language),
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
        systemInstruction: getSystemInstruction(language)
      }
    });

    return response.text || getMockAnalysis(crop, language);
  } catch (error) {
    console.warn("Gemini API Error:", error);
    return formatOfflineResponse(getMockAnalysis(crop, language), language);
  }
}

// 3. MARKET INSIGHTS
export async function getMarketInsights(
  crop: CropType,
  district: string,
  language: Language
): Promise<GeminiResponse> {
  const limit = checkAndIncrementLimit();
  if (!apiKey || !limit.allowed) {
    const mock = getMockMarket(crop, district, language);
    return { ...mock, text: limit.allowed ? mock.text : formatOfflineResponse(mock.text, language) };
  }

  try {
    const prompt = `
      Current market price (Mandi rates) for ${crop} near ${district}, Bihar.
      Recent pest news for ${crop} in Bihar.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: withLang(prompt, language),
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: getSystemInstruction(language)
      },
    });

    return {
      text: response.text || "",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    const mock = getMockMarket(crop, district, language);
    return { ...mock, text: formatOfflineResponse(mock.text, language) };
  }
}

// 4. NEARBY RESOURCES
export async function getNearbyResources(
  lat: number,
  lon: number,
  language: Language
): Promise<GeminiResponse> {
  const limit = checkAndIncrementLimit();
  if (!apiKey || !limit.allowed) {
    const mock = getMockResources(language);
    return { ...mock, text: limit.allowed ? mock.text : formatOfflineResponse(mock.text, language) };
  }

  try {
    const prompt = `
      Find Krishi Vigyan Kendra or fertilizer shops near this location.
      List names and distances.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: withLang(prompt, language),
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lon
            }
          }
        },
        systemInstruction: getSystemInstruction(language)
      },
    });

    return {
      text: response.text || "",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    const mock = getMockResources(language);
    return { ...mock, text: formatOfflineResponse(mock.text, language) };
  }
}

// 5. PLANT DOCTOR (VISION)
export async function analyzePlantHealth(
  base64Image: string,
  language: Language
): Promise<string> {
  const limit = checkAndIncrementLimit();
  if (!apiKey || !limit.allowed) {
    const mock = getMockDiagnosis(language);
    return limit.allowed ? mock : formatOfflineResponse(mock, language);
  }

  try {
    const prompt = language === 'hi' 
      ? "इस पौधे की तस्वीर का विश्लेषण करें। बीमारी या कीट की पहचान करें और उपचार के उपाय (जैविक और रासायनिक) बताएं। हिंदी में जवाब दें।"
      : "Analyze this plant image. Identify any disease or pest, and suggest treatments (organic and chemical).";

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: getSystemInstruction(language)
      }
    });

    return response.text || getMockDiagnosis(language);
  } catch (error) {
    console.warn("Gemini API Error:", error);
    return formatOfflineResponse(getMockDiagnosis(language), language);
  }
}