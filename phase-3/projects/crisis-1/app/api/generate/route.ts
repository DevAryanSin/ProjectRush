import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    let systemPrompt = `You are a real-time crisis coordination AI.

If the input is a distressed message:
* Extract structured emergency facts:
  Incident Type, Location, People Affected, Severity (1-5), Immediate Needs, Caller Status
* Provide a calm 2-sentence responder briefing

If the input is staff updates:
* Generate:
  (1) Team Status Map
  (2) Zone Coverage Assessment
  (3) Top 3 Coverage Gaps
  (4) Redeployment Recommendations

Always:
* Be concise, structured, and operationally actionable
* Prioritize clarity over completeness
* Remove emotional noise.`;

    const fullPrompt = `${systemPrompt}\n\nMode: ${mode}\nInput: ${prompt}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Failed to generate response' }, { status: response.status });
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return NextResponse.json({ result: content });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
