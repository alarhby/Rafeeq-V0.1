import { GoogleGenAI } from "@google/genai";

export const generateShipmentDescription = async (title: string, weight: number, type: string, quantity: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك خبير في الخدمات اللوجستية، قم بصياغة وصف جذاب واحترافي لشحنة تتكون من ${quantity} قطعة من نوع "${type}"، بعنوان "${title}" ووزن إجمالي تقريبي ${weight} كجم. 
      يجب أن يوضح الوصف أهمية الشحنة وضرورة التعامل معها بعناية، مما يحفز السائقين الموثوقين على تقديم عروضهم. 
      اجعل الوصف مختصراً وباللغة العربية الفصحى البسيطة.`,
    });
    return response.text || "شحنة جاهزة للنقل بأمان وموثوقية.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "شحنة جاهزة للنقل عبر رفيق.";
  }
};