import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are a data discrimination detection AI. Analyze these dataset features for proxy discrimination. For each suspicious feature, explain: what protected attribute it likely proxies (e.g., zip code → race, name → gender), the proxy mechanism, risk level (HIGH/MEDIUM/LOW), and a specific transformation or mitigation to reduce the proxy effect. Be precise with examples. Format your response into clear sections for each feature.`;

    const fullPrompt = `${systemPrompt}\n\nUser Input Data:\n${prompt}`;

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
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'Gemini API call failed' }, { status: response.status });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
