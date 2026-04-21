import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const systemPrompt = "You are a content propagation analyst for sports media. Given this asset description, explain its likely spread pattern across social media, streaming sites, and news aggregators. Identify top 3 high-risk redistribution channels and any anomaly signals to watch.";
    const fullPrompt = `${systemPrompt}\n\nAsset Description: ${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate content');
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ result: generatedText });
  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
