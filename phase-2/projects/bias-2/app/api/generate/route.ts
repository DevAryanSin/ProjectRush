import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt: userPrompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = "You are an inclusive hiring AI. Scan this job description and: (1) Flag every discriminatory phrase (highlight exact text), (2) Explain which groups each phrase disadvantages and how, (3) Rate each as HIGH/MEDIUM/LOW severity, (4) Rewrite the entire JD in inclusive language. Reference EEOC guidelines where relevant.";

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
              parts: [{ text: `${systemPrompt}\n\nJob Description:\n${userPrompt}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API call failed');
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('HiringLens API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
