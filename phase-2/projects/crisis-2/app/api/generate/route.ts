import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 500 });
    }

    const systemPrompt = "You are a crisis coordination AI. Synthesize these staff check-in updates into: (1) Team Status Map (name, location, status for each), (2) Zone Coverage Assessment (which areas are covered/uncovered), (3) Top 3 Coverage Gaps, (4) Redeployment Recommendations. Be tactical and concise.";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nStaff Updates:\n${prompt}` }]
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || 'Gemini API error' }, { status: response.status });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json({ error: 'Internal server error during synthesis' }, { status: 500 });
  }
}
