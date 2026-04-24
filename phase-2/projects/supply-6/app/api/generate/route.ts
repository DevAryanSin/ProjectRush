import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = "You are a demand forecasting AI. Analyze these market signals and predict near-term demand: direction (increase/decrease/stable), magnitude (%, low/medium/high confidence), top 3 signals driving the prediction, 2 counter-signals to watch, and specific inventory recommendation (build/hold/reduce by how much). Explain your signal logic clearly.";

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
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Input: ${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Gemini API error' }, { status: response.status });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No prediction generated.';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error in generate route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
