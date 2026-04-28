import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an NGO intelligence and storytelling AI.

If mode is "signals":
* Extract unmet needs ranked by urgency (1-10)
* Identify sentiment and affected groups
* Recommend 3 NGO actions
* Format as JSON with fields: needs (array of {need, urgency, sentiment, population, implied}), recommendations (array of strings)

If mode is "story":
* Generate a donor-facing impact story with: headline, narrative, metrics, quote, and call to action
* Format as JSON with fields: headline, narrative, metrics (array of strings), quote, cta

Always:
* Be specific and grounded in real signals
* Avoid generic summaries
* Focus on actionable insights and emotional clarity
* Return ONLY valid JSON.`;

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
