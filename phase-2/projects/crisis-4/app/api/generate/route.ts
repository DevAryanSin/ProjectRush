import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is not configured' }, { status: 500 });
    }

    const systemPrompt = "You are a crisis communications scriptwriter. For this emergency, write 3 scripts: (1) PA System Announcement (calm, clear, 3 sentences max), (2) Staff Briefing Script (tactical, role-specific, 5 bullet points), (3) Social Media Statement (transparent, reassuring, under 280 chars). Each must be appropriate for its audience.";
    const fullPrompt = `${systemPrompt}\n\nUSER INPUT:\n${prompt}`;

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
              role: 'user',
              parts: [{ text: fullPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ error: `API Error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error generating scripts:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
