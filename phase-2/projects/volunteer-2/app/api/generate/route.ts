import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

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

    const systemPrompt = "You are an NGO storytelling AI. Write a compelling volunteer impact bio (150-200 words) covering: who they are, what they did (specific tasks and hours), who they helped (concrete community impact), and what drives them. Make it inspiring for donor reports and volunteer recruitment. Use first-person voice.";
    const fullPrompt = `${systemPrompt}\n\nHere are the volunteer's details:\n${prompt}`;

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
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
