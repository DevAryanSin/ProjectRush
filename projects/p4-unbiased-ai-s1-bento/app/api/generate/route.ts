import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'Gemini API provider error' }, { status: 500 });
    }

    const systemPrompt = `You are an AI bias risk analyst. Analyze this dataset description or model output for bias. 
    Be specific and cite evidence from the input. 
    IMPORTANT: You must follow this format EXACTLY:
    Rating: [HIGH/MEDIUM/LOW]
    Types Detected: [List of types such as Historical, Representation, Measurement, Aggregation]
    Groups: [Affected demographic groups]
    Audits:
    - [Detailed recommendation 1]
    - [Detailed recommendation 2]
    - [Detailed recommendation 3]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nInput:\n${prompt}` }] }]
        }),
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return NextResponse.json({ result: data.candidates[0].content.parts[0].text });
    } else {
      console.error('Gemini Error:', data);
      return NextResponse.json({ error: 'Analysis failed. API returned unexpected response.' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
