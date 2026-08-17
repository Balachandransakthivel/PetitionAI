import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function analyzeImagesWithAI(base64Images: string[]): Promise<string[]> {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    console.warn("Gemini API key not configured. Skipping image analysis.");
    return base64Images.map(() => "Image analysis unavailable (API key not configured).");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const results: string[] = [];

  for (const base64 of base64Images) {
    try {
      const mimeType = base64.startsWith("data:image/jpeg") ? "image/jpeg" :
                       base64.startsWith("data:image/png") ? "image/png" :
                       "application/pdf";

      const base64Data = base64.split(",")[1] || base64;

      const prompt = `Analyze this image/document for a civic complaint system. 
      Identify:
      1. What type of issue is visible (pothole, garbage, water leak, broken streetlight, illegal construction, etc.)
      2. Severity level (critical, high, medium, low)
      3. Any visible location markers (street signs, landmarks, building numbers)
      4. Any text visible in the image
      5. Whether this appears to be a genuine civic issue

      Provide a concise analysis in 2-3 sentences.`;

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const analysis = result.response.text();
      results.push(analysis);
    } catch (error) {
      console.error("Image analysis failed:", error);
      results.push("Image analysis failed.");
    }
  }

  return results;
}