import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a digital watermarking AI. Generate a unique ownership signature for this asset: create a steganographic text string, an encoded ownership token, and step-by-step instructions for embedding it invisibly into the asset. Make the signature unique and traceable. Use a professional, technical tone with clear sections. \n\nUser Input: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Failed to call Gemini API' }, { status: response.status });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
