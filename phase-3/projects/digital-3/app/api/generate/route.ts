import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let systemInstruction = "";
    if (mode === "trace") {
      systemInstruction = `
        You are a digital forensics expert specialized in content origin tracing. 
        Analyze the provided input and generate a structured "Trace Output" report.
        Format the response in a clear, forensic, and editorial style.
        
        Sections to include:
        1. SOURCE: Identify the likely origin or creator.
        2. PATH: Describe the probable propagation or modification history.
        3. SIGNALS: List technical and stylistic indicators used for analysis.
        4. VERIFICATION: Provide a confidence score and recommended verification steps.
        
        Keep the tone analytical, precise, and professional. Use editorial structure with clear headers.
      `;
    } else {
      systemInstruction = `
        You are a legal technology expert specialized in digital licensing.
        Generate a comprehensive "License Output" document based on the provided asset description.
        Format the response as a formal legal document inside a structured layout.
        
        Sections to include:
        1. LICENSE TYPE: Clearly define the usage rights (e.g., Commercial, Creative Commons, Private).
        2. TERMS OF USE: Specific permissions and restrictions.
        3. ATTRIBUTION REQUIREMENTS: How the creator must be credited.
        4. VALIDITY: Duration and jurisdiction of the license.
        
        Keep the tone formal, legally structured, and highly readable.
      `;
    }

    const result = await model.generateContent([systemInstruction, prompt]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
