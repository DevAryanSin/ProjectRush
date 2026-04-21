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

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = "You are a forensic media analyst. Analyze these file properties for signs of tampering, cloning, or unauthorized modification. List specific tampering indicators found, rate each as HIGH/MEDIUM/LOW severity, give an overall clone likelihood score, and recommend verification steps.";
    const fullPrompt = `${systemPrompt}\n\nUser Input: ${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
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
        const errorText = await response.text();
        console.error('Gemini API Error:', response.status, errorText);
        return NextResponse.json(
          { error: `API Error: ${response.status}` },
          { status: response.status }
        );
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json(
        { error: 'No response generated from Gemini API' },
        { status: 500 }
      );
    }

    const resultText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ result: resultText });

  } catch (error: any) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: error.message || 'Error communicating with AI service' },
      { status: 500 }
    );
  }
}
