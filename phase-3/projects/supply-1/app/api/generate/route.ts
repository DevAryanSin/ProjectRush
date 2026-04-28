import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { origin, destination, mode, date, conditions } = await req.json();

    if (!origin || !destination) {
      return NextResponse.json({ error: "Origin and destination are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a logistics weather intelligence AI.
      Analyze the following route and output a JSON object:
      Route: ${origin} to ${destination}
      Transport Mode: ${mode}
      Departure Date: ${date}
      Current Conditions: ${conditions}

      The output MUST be a valid JSON object with exactly these keys:
      {
        "riskScore": number (0-100),
        "threats": [
          { "segment": string, "threat": string, "severity": "low" | "medium" | "high" }
        ],
        "etaImpact": number (hours),
        "mitigations": [string, string, string]
      }

      Be operational, concise, and specific.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Failed to process intelligence: " + error.message }, { status: 500 });
  }
}
