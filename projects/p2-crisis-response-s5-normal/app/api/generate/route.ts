import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt: userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an incident documentation AI for hospitality operations. Convert this plain-language incident description into a formal incident report with these sections: Incident Reference, Date/Time, Location, Incident Type, Parties Involved, Narrative Description, Immediate Actions Taken, Follow-Up Required, Reporting Officer. Note any missing information that should be obtained. Use clear, professional, and authoritative language. Format each section clearly.`;

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
                  text: `${systemPrompt}\n\nUSER INPUT:\n${userInput}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || 'Gemini API error' }, { status: response.status });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
