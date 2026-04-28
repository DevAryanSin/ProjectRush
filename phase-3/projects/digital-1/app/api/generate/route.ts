import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are a digital IP protection and legal analysis AI.

If the input is about asset creation:
* Generate:
  (1) A unique watermark signature
  (2) Encoded ownership token
  (3) Clear embedding instructions

If the input is about infringement:
* Generate:
  (1) Case title
  (2) Legal basis (copyright/DMCA)
  (3) Evidence chain (have vs need)
  (4) Estimated damages range
  (5) 5 prioritized legal actions

Always:
* Be precise and actionable
* Avoid vague statements
* Structure output clearly`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Input: ${prompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
