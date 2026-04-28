import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an NGO strategy and execution AI.

If mode is "gaps":
- Identify top skill gaps from the input projects
- Rank by criticality
- Explain impact
- Generate recruitment briefs and workarounds
- Return JSON with fields: gaps (array of {skill, criticality, impact, brief, workaround})

If mode is "plan":
- Generate a complete event execution plan from the community initiative input
- Include concept, schedule, roles, materials, communication, metrics
- Return JSON with fields: concept, name, schedule (array of {time, activity}), roles (array of {role, assignment}), materials (array of strings), communication, metrics (array of strings)

Always:
- Be structured and actionable
- Avoid generic suggestions
- Focus on real-world execution feasibility
- Return ONLY valid JSON.`;

    const fullPrompt = `System: ${systemPrompt}\n\nMode: ${mode}\n\nInput: ${prompt}`;

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
          generationConfig: {
            responseMimeType: "application/json",
          }
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(resultText));
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
