import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'Gemini API Key is not configured' }, { status: 500 });
    }

    const systemPrompt = "You are a digital forensics AI. Analyze this suspicious content description and provide: most likely original source (with confidence %), hypothetical distribution path, authenticity signals present or missing, 3 specific verification steps to confirm origin. Be forensic and methodical.";
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Input: ${prompt}`
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Gemini API Error');
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
