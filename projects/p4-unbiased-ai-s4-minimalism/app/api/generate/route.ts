import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an algorithmic decision explainability AI. A person received this automated decision. Explain it in plain language covering: 
(1) Why this decision was likely made (key factors), 
(2) What factor had the biggest impact, 
(3) What could realistically change the outcome, 
(4) What rights this person has to appeal or request review. 

Use simple language a non-technical person would understand. Avoid jargon. 
Format the response clearly with numbered sections.

User Decision Data:
${prompt}`;

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
                  text: systemPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate content');
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated.';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
