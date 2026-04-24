import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const systemPrompt = "You are a nonprofit storytelling AI. Transform this task data into a donor impact story with: (1) Compelling headline, (2) Human narrative (who helped who, what changed), (3) Key impact metrics made emotional (not just numbers), (4) Quote from the experience (fabricate plausibly), (5) Call to action for continued support. Make donors feel the difference their money made.";

    const combinedPrompt = `${systemPrompt}\n\nUSER INPUT DATA:\n${prompt}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: combinedPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Gemini API Error:', err);
      throw new Error(err.error?.message || 'Failed to generate content from Gemini API');
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
      throw new Error('No valid response from Gemini API');
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
