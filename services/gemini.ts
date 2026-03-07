
import { GoogleGenAI, GenerateContentResponse, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { AdTemplate, ProductAnalysis } from "../types";

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const WORKER_SYSTEM_INSTRUCTION = `
You are the Worker Agency AI, a Senior Advertising Creative & Content Strategist and Specialist in Meta Andromeda.
MISSION: Transform product concepts into high-converting visual advertisements with surgical precision.

STRICT PROTOCOL:
1. MASTER BLUEPRINT: When provided with a JSON blueprint, you MUST replicate the layout, element positioning, and visual hierarchy EXACTLY. You are a precise layout engine, not a loose interpreter.
2. ICONIC COMPONENTS:
   - "magnifying_glass" / "zoom": Create a circular zoom bubble with a thin connecting line pointing to a specific detail of the product. The detail inside the bubble MUST be a high-resolution close-up of the target.
   - "features_grid": Render 3-6 items as a professional, clean grid of minimalist icons with text underneath or beside them. Use studio-grade iconography.
   - "price_tag" / "offer": Render pricing in large, bold, high-contrast typography. Use a strike-through for original prices and a highlight for promo prices.
3. BRAND INTEGRITY: Rule #1: NEVER modify original brand elements (logos, text on packaging, labels). Preserve them at all costs.
4. VISUAL ZERO-HALLUCINATION: Do NOT add extraneous background elements (flags, unrelated props, busy scenery) unless explicitly requested. Keep the background clean, professional, and commercial-grade (Studio, Marble, Minimalist).
5. HUMAN MODELS: Use unknown, professional agency models. No celebrities.
6. LANGUAGE: All text content MUST be in SPANISH (Español).
7. QUALITY: High-end cinematic studio lighting, photorealistic textures, 8k commercial quality.
`;

const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Cache for product analysis to reduce costs
const analysisCache = new Map<string, ProductAnalysis>();

const fileToPart = (file: File | Blob): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve({
        inlineData: { data: base64String, mimeType: file.type },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mapToSupportedRatio = (ratio: string): "1:1" | "3:4" | "4:3" | "9:16" | "16:9" => {
  const supported = ["1:1", "3:4", "4:3", "9:16", "16:9"];
  if (supported.includes(ratio)) return ratio as any;
  if (ratio === "4:5") return "3:4";
  return "1:1";
};

const getMimeTypeFromBase64 = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : 'image/png';
};

export const analyzeProductUrl = async (url: string): Promise<ProductAnalysis> => {
  if (analysisCache.has(url)) {
    return analysisCache.get(url)!;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `You are a high-performance e-commerce advertising specialist. 
Analyze the provided product URL and extract all relevant data for creating a professional marketing campaign.

STRICT RULE: All text content (name, description, features, keywords, environment, tone) MUST be in SPANISH (Español), even if the source URL is in English or another language.

URL: ${url}

EXTRACT THE FOLLOWING DATA:
1. name: Complete product name as shown on the store (Translate to Spanish).
2. brand: The brand name or store name.
3. logo: URL of the brand logo image (very important).
4. description: A clear, compelling product description in Spanish.
5. features: Array of the top 3-6 product benefits or specifications in Spanish.
6. pricing: Numeric object containing { original, promo, currency }.
7. mainImage: The highest quality primary product image URL.
8. gallery: Array of up to 4 additional product image URLs.
9. keywords: 5-8 strategic marketing keywords in Spanish.
10. environment: A specific visual setting for an ad shoot in Spanish (e.g., "Mármol minimalista con sombras suaves").
11. tone: Emotional brand tone in Spanish (e.g., "Premium y Sofisticado").

Return ONLY valid JSON format. No extra text.`,
    config: {
      tools: [{ googleSearch: {} }],
      safetySettings: SAFETY_SETTINGS
    }
  } as any);

  const sources = (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks?.filter((chunk: any) => chunk.web)?.map((chunk: any) => ({ uri: chunk.web!.uri, title: chunk.web!.title || chunk.web!.uri })) || [];

  try {
    let text = (response as any).text || "{}";
    // Clean JSON if the model returns markdown code blocks
    if (text.includes("```json")) {
      text = text.split("```json")[1].split("```")[0];
    } else if (text.includes("```")) {
      text = text.split("```")[1].split("```")[0];
    }
    const data = JSON.parse(text);

    const result: ProductAnalysis = {
      name: data.name || "Producto sin nombre",
      brand: data.brand,
      logo: data.logo,
      description: data.description || "",
      features: data.features || [],
      pricing: data.pricing,
      mainImage: data.mainImage,
      gallery: data.gallery,
      keywords: data.keywords || [],
      environment: data.environment || "E-commerce Studio",
      tone: data.tone || "Professional",
      sources
    };

    analysisCache.set(url, result);
    return result;
  } catch (e: any) {
    console.error("Content Analysis Error:", e);
    throw new Error("No se pudo extraer la información del producto. Verifica el link.");
  }
};

export const generateAdCreative = async (
  template: AdTemplate,
  fieldValues: Record<string, string>,
  productImages: (File | string)[],
  ratioOverride?: string,
  extraOptions?: { originalPrice?: string, promoPrice?: string, extraInstructions?: string }
): Promise<string> => {
  let templatePrompt = template.basePrompt;

  Object.keys(fieldValues).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    templatePrompt = templatePrompt.replace(regex, fieldValues[key]);
  });

  const parts: any[] = [];

  // 1. Inject Reference Image as a master guide for the AI
  if (template.thumbnailUrl) {
    try {
      const refResponse = await fetch(template.thumbnailUrl);
      const refBlob = await refResponse.blob();
      const refPart = await fileToPart(new File([refBlob], "reference.png", { type: refBlob.type }));
      parts.push({ text: "### REFERENCE LAYOUT (STRICTLY FOLLOW THIS STRUCTURE AND STYLE):" });
      parts.push(refPart);
    } catch (e) {
      console.warn("Could not load reference image for guidance:", e);
    }
  }

  // 2. Inject User Products
  parts.push({ text: "### CLIENT PRODUCT ASSETS (USE THESE IN THE AD):" });
  for (const img of productImages) {
    if (typeof img === 'string') {
      const base64Data = img.split(',')[1] || img;
      parts.push({
        inlineData: { data: base64Data, mimeType: getMimeTypeFromBase64(img) }
      });
    } else {
      parts.push(await fileToPart(img));
    }
  }

  let finalTask = `VISUAL COMPOSITION TASK: STRICT REPLICATION REQUIRED
You are a senior ad designer and Meta Andromeda expert. Your task is to REPLICATE the layout and style of the provided "REFERENCE LAYOUT" while using the product from the "CLIENT PRODUCT ASSETS".

BLUEPRINT (Element Mapping):
${templatePrompt}

INSTRUCTIONS:
- Use the provided REFERENCE LAYOUT image as your MASTER GUIDE for positioning, hierarchy, and overall visual balance.
- REPLICATE the layout structure and element positioning exactly as seen in the reference.
- If the reference has a "magnifying_glass", render it with the callout text provided.
- If the reference is held by a hand, preserve that interaction.
`;


  if (extraOptions?.originalPrice || extraOptions?.promoPrice) {
    finalTask += `\nPRICING DATA:
Original Price: ${extraOptions.originalPrice || ''}
Promo Price: ${extraOptions.promoPrice || ''}
Include these prices clearly in the ad as part of the "price_tag" or "offer" components.Use large bold font for the Promo Price.`;
  }

  if (extraOptions?.extraInstructions) {
    finalTask += `\nCLIENT FEEDBACK / EXTRA DIRECTIONS: ${extraOptions.extraInstructions}.`;
  }

  finalTask += `\n\nTECHNICAL SPECS: Cinematic studio lighting.Clean backgrounds only.No hallucinations of extra regional flags or props.Maintain absolute brand integrity of labels and logos.ALL TEXT IN SPANISH(Español).`;

  parts.push({ text: finalTask });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts },
    config: {
      systemInstruction: WORKER_SYSTEM_INSTRUCTION,
      safetySettings: SAFETY_SETTINGS,
      imageConfig: { aspectRatio: mapToSupportedRatio(ratioOverride || template.aspectRatio), imageSize: "1K" }
    }
  } as any);

  const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
  if (!part) throw new Error("Blocked by Security Filter. Try removing people or changing the context.");
  return `data: image / png; base64, ${part.inlineData.data} `;
};

export const editAdCreative = async (imageBase64: string, instructions: string): Promise<string> => {
  const base64Data = imageBase64.split(',')[1] || imageBase64;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: base64Data } },
        { text: `Edit instructions: ${instructions}. Keep the professional commercial style.` }
      ]
    },
    config: { systemInstruction: WORKER_SYSTEM_INSTRUCTION, safetySettings: SAFETY_SETTINGS }
  } as any);
  const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
  return part ? `data: image / png; base64, ${part.inlineData.data} ` : "";
};

export const renderVideoVariation = async (base64Image: string, prompt: string, aspectRatio: '9:16' | '16:9' = '9:16'): Promise<string> => {
  const mimeType = getMimeTypeFromBase64(base64Image);
  const base64Data = base64Image.split(',')[1] || base64Image;

  const cinematicPrompt = `Cinematic professional E - commerce spot.${prompt}.High - end commercial photography featuring an unknown professional agency model.Soft studio lighting, slow cinematic motion, focusing on the quality and detail of the product.No identities or celebrities involved. 4k resolution aesthetic.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    prompt: cinematicPrompt,
    image: { imageBytes: base64Data, mimeType: mimeType },
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
  } as any);

  while (!operation.done) {
    await delay(10000);
    operation = await ai.operations.getVideosOperation({ operation: operation } as any);
  }

  const raiFilteredCount = (operation as any).response?.generateVideoResponse?.raiMediaFilteredCount;
  if (raiFilteredCount > 0) {
    throw new Error(`BLOQUEO DE SEGURIDAD: El modelo detectó contenido sensible o una persona que confunde con una celebridad.Sugerencia: Recorta la foto para no mostrar el rostro o usa una pose menos compleja.`);
  }

  const downloadLink = (operation as any).response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("No video generated.");

  const response = await fetch(`${downloadLink}& key=${API_KEY} `);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const resizeAdCreative = async (imageBase64: string, targetRatio: string): Promise<string> => {
  const base64Data = imageBase64.split(',')[1] || imageBase64;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: base64Data } },
        { text: `Adapt this ad to ${targetRatio}. Maintain composition and brand style.` }
      ]
    },
    config: {
      systemInstruction: WORKER_SYSTEM_INSTRUCTION,
      safetySettings: SAFETY_SETTINGS,
      imageConfig: { aspectRatio: mapToSupportedRatio(targetRatio) as any }
    }
  } as any);
  const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
  return part ? `data: image / png; base64, ${part.inlineData.data} ` : "";
};

export const createCreativeBriefs = async (analysis: ProductAnalysis, userInstructions?: string, count: number = 10): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Product: ${analysis.name}.Instructions: ${userInstructions}. Generate ${count} different visual advertising prompts for product photography.Return ONLY a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      safetySettings: SAFETY_SETTINGS,
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } as any
    }
  } as any);
  try { return JSON.parse(response.text || "[]"); } catch { return []; }
};

export const renderVariation = async (productImageBase64: string, prompt: string): Promise<string> => {
  const base64Data = productImageBase64.split(',')[1] || productImageBase64;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: `Professional commercial product photography: ${prompt}.` }] },
    config: {
      systemInstruction: WORKER_SYSTEM_INSTRUCTION,
      safetySettings: SAFETY_SETTINGS,
      imageConfig: { aspectRatio: "3:4", imageSize: "1K" }
    }
  } as any);
  const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
  if (!part) throw new Error("Safety Block.");
  return `data: image / png; base64, ${part.inlineData.data} `;
};

export const generateVideoSequence = async (base64Image: string, mimeType: string, prompt: string, aspectRatio: '9:16' | '16:9', duration: '8s' | '15s' | '25s', onProgress?: (msg: string) => void): Promise<string> => {
  return renderVideoVariation(base64Image, prompt, aspectRatio);
};

export const createUGCBriefs = async (analysis: ProductAnalysis, idea?: string): Promise<{ visual: string; voiceover: string }[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Product: ${analysis.name}.Theme: ${idea}. Generate 3 UGC video briefs.JSON format.`,
    config: {
      responseMimeType: "application/json",
      safetySettings: SAFETY_SETTINGS,
      responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { visual: { type: Type.STRING }, voiceover: { type: Type.STRING } }, required: ['visual', 'voiceover'] } } as any
    }
  } as any);
  try { return JSON.parse(response.text || "[]"); } catch { return []; }
};

export const renderUGCVideo = async (productImageBase64: string, visualPrompt: string): Promise<string> => {
  return renderVideoVariation(productImageBase64, visualPrompt, '9:16');
};
export const generateTemplateBlueprint = async (referenceImage: File | string): Promise<string> => {
  const parts: any[] = [];
  if (typeof referenceImage === 'string') {
    const base64Data = referenceImage.split(',')[1] || referenceImage;
    parts.push({
      inlineData: { data: base64Data, mimeType: getMimeTypeFromBase64(referenceImage) }
    });
  } else {
    parts.push(await fileToPart(referenceImage));
  }

  const prompt = `You are a Senior Creative Strategist. Analyze the attached reference image and create a High-Detail JSON Blueprint that describes its visual aesthetic and layout structure perfectly for replication.

OUTPUT RULES:
- Return ONLY valid JSON.
- Use the following structure:
{
  "template_id": "suggest-a-slug",
  "visual_aesthetic": {
    "vibe": "Describe color palette, mood, and brand feeling",
    "background": "Describe the environment and background elements in detail",
    "lighting": "Describe the light source and intensity"
  },
  "layout_structure": {
    "main_composition": "Describe how the product and humans are positioned",
    "elements": {
      "item_name": "describe its style, position, and purpose. Use {{template_tags}} for dynamic text."
    },
    "typography": "Describe the font style, weight, and colors used"
  }
}

Identify all text elements in the image and replace them with {{descriptive_tags}}.
Be extremely specific so an AI can replicate it almost perfectly.`;

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro', // Using Pro for better visual analysis
    contents: { parts },
    config: {
      safetySettings: SAFETY_SETTINGS
    }
  } as any);

  let text = response.candidates?.[0]?.content?.parts[0]?.text || "{}";
  if (text.includes("```json")) {
    text = text.split("```json")[1].split("```")[0];
  } else if (text.includes("```")) {
    text = text.split("```")[1].split("```")[0];
  }
  return text.trim();
};
