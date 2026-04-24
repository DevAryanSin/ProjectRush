import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const KEY = process.env.GEMINI_API_KEY;
    const MODEL = 'gemini-2.5-flash';
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

    const systemPrompt = "You are an IP licensing AI. Draft a complete content license agreement for this asset with these sections: Grant of License, Permitted Uses, Prohibited Uses, Attribution Requirements, Commercial Terms, Territory, Term and Termination, Warranties, Governing Law. Use precise legal language appropriate for digital media licensing.";

    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Asset Details:\n${prompt}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate license' }, { status: response.status });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No agreement generated.';

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
