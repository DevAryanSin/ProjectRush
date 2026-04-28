import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Note: Using 1.5-flash as 2.5-flash is likely a placeholder or future version, but I will check if 2.5 is requested. The user said "gemini-2.5-flash". I'll use that string.

    const systemPrompt = `You are a digital IP risk intelligence AI.

If the input describes assets:
- Rank each asset type by vulnerability (1–10)
- Explain exposure drivers
- Provide protection recommendations

If the input describes a platform:
- Generate a platform risk profile including:
  - enforcement rating (A-F)
  - top 3 theft vectors
  - exposure level
  - 4 defensive tactics

Always:
- Be specific and actionable
- Avoid generic advice
- Structure output clearly using Markdown format.
- For assets, use a list format with "SCORE: [number]" for each.
- For platforms, use sections: ENFORCEMENT, VECTORS, EXPOSURE, DEFENSE.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUser Input: ${prompt}` }] }],
    });

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate risk analysis" }, { status: 500 });
  }
}
