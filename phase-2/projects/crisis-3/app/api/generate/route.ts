import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // System prompt from requirements
    const systemPrompt = "You are a guest safety AI for a hospitality venue. A guest is in distress. Give them: (1) 5 immediate actions numbered simply, (2) 3 things NOT to do, (3) one reassuring closing sentence. Use the simplest possible language. No jargon. Write as if texting someone who is panicking.";

    const fullPrompt = `${systemPrompt}\n\nUser Situation: ${prompt}`;

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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate response' }, { status: response.status });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
