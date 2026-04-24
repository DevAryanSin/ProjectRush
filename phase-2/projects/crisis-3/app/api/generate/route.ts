import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = "You are a guest safety AI for a hospitality venue. A guest is in distress. Give them: (1) 5 immediate actions numbered simply, (2) 3 things NOT to do, (3) one reassuring closing sentence. Use the simplest possible language. No jargon. Write as if texting someone who is panicking.";
    
    const finalPrompt = `${systemPrompt}\n\nGuest Situation:\n${prompt}`;

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
              parts: [{ text: finalPrompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API Error:', err);
      return NextResponse.json(
        { error: 'Failed to generate response from Gemini API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      return NextResponse.json(
        { error: 'No content generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Generate route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
