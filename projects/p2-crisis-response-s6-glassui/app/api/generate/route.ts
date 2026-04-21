import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `Generate a first responder situational brief (SBAR format: Situation, Background, Assessment, Recommendation) for incoming emergency services at a hospitality venue. 
    Include: venue access points, current situation status, known hazards, estimated casualties, on-site command contact. 
    Be factual, concise, and use emergency services terminology.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Input: ${prompt}` }] }],
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json({ error: 'Failed to generate brief' }, { status: 500 });
  }
}
