import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AuspiciousData } from '../types';

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing or invalid.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const auspiciousSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    thaiDate: { type: Type.STRING, description: "Thai Lunar Date (e.g. ขึ้น 5 ค่ำ เดือน 4)" },
    chineseDate: { type: Type.STRING, description: "Chinese Lunar Date (Day and Month)" },
    zodiac: { type: Type.STRING, description: "Year Zodiac (Thai/Chinese)" },
    auspiciousColor: { type: Type.STRING, description: "Lucky colors for the day" },
    forbiddenColor: { type: Type.STRING, description: "Unlucky colors to avoid" },
    auspiciousTime: { type: Type.STRING, description: "Best time range for important tasks" },
    advice: { type: Type.STRING, description: "Short fortune or advice for the day (max 2 sentences)" },
    isWanPhra: { type: Type.BOOLEAN, description: "Is this a Buddhist Holy Day (Wan Phra)?" },
    element: { type: Type.STRING, description: "Feng Shui Element of the day (e.g. Earth, Fire)" },
  },
  required: ["thaiDate", "chineseDate", "zodiac", "auspiciousColor", "forbiddenColor", "auspiciousTime", "advice", "isWanPhra", "element"],
};

const wanPhraSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    days: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      description: "List of day numbers (1-31) that are Thai Buddhist Holy Days (Wan Phra) for the requested month."
    }
  },
  required: ["days"]
};

export const fetchAuspiciousData = async (date: Date): Promise<AuspiciousData> => {
  const dateString = date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  try {
    const ai = getAIClient();
    if (!ai) {
      throw new Error("Gemini Client not initialized (Missing API Key)");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate astrological and auspicious data for this date in Thailand: ${dateString}. 
      The response must be in Thai language suitable for a formal calendar application.
      Ensure the Thai Lunar Date and Chinese Lunar Date are accurate for the given Gregorian date.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: auspiciousSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AuspiciousData;
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error fetching auspicious data:", error);
    // Return fallback data in case of error
    return {
      thaiDate: "ไม่สามารถโหลดข้อมูลได้",
      chineseDate: "-",
      zodiac: "-",
      auspiciousColor: "-",
      forbiddenColor: "-",
      auspiciousTime: "-",
      advice: "กรุณาลองใหม่อีกครั้ง หรือตรวจสอบ API Key",
      isWanPhra: false,
      element: "-"
    };
  }
};

export const fetchWanPhraDays = async (date: Date): Promise<number[]> => {
  const monthYear = date.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
  
  try {
    const ai = getAIClient();
    if (!ai) {
      // Return empty array silently if no key, to avoid spamming errors for background fetches
      return [];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Identify all Thai Buddhist Holy Days (Wan Phra) for ${monthYear}. 
      Return ONLY a list of the day numbers (integers between 1-31) corresponding to Wan Phra based on the Thai Lunar Calendar.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: wanPhraSchema,
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.days || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching Wan Phra days:", error);
    return [];
  }
};