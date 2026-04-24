import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = "You are an AI ethics translator for non-technical audiences. Explain this bias concept with: (1) One-sentence plain definition, (2) A real-world analogy that makes it intuitive, (3) A concrete example in a business context, (4) Why it matters legally and reputationally, (5) One simple thing the organization can do about it. Use zero technical jargon.";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nConcept to explain: ${prompt}`
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || 'Failed to generate content' }, { status: response.status });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated.';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
