import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { mode, input } = await req.json();

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    const systemPrompt = `You are a supply chain intelligence AI.
    
    If mode is 'story' (input is tracking data):
    - Generate a chronological narrative
    - Explain delays, causes, current state, and next steps
    - Use clear, professional, and slightly editorial tone
    - Format as a list of narrative blocks
    
    If mode is 'cost' (input is supply chain description):
    - Identify top 5 cost inefficiencies
    - Estimate waste magnitude (Low/Medium/High)
    - Rank by savings potential
    - Provide one specific, actionable fix per issue
    - Format each issue with ISSUE, COST, PRIORITY, and FIX fields
    
    Always:
    - Be clear, structured, and practical
    - Avoid vague explanations
    - Focus on actionable insights
    - Output ONLY a JSON array of objects.
    
    For 'story' mode: [{"title": "Event Title", "time": "Time/Date", "content": "Narrative detail", "type": "status|delay|next"}]
    For 'cost' mode: [{"issue": "Issue description", "cost": "Waste magnitude", "priority": "Ranking", "fix": "Actionable fix"}]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser Input: ${input}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || "Gemini API error");
    }

    const text = result.candidates[0].content.parts[0].text;
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Intelligence Analysis Error:", error);
    return NextResponse.json({ error: "System failure: " + error.message }, { status: 500 });
  }
}
