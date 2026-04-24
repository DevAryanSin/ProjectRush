import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const systemPrompt = "You are an NGO talent strategy AI. Analyze this skill gap and provide: (1) Top 5 missing skills ranked by criticality to mission, (2) Impact of each gap on project outcomes, (3) A 3-sentence volunteer recruitment brief for each missing skill, (4) An interim workaround for each gap while recruiting. Make recruitment briefs compelling for potential volunteers. Format the output logically with clear headers so it can be parsed as a newspaper article.";

    const fullPrompt = `${systemPrompt}\n\nUser Input:\n${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ error: 'Failed to generate content' }, { status: response.status });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No result generated.';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error in generate route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
