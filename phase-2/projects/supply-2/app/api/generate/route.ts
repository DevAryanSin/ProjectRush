import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    const systemPrompt = "You are a vendor assessment AI. Score this vendor across 5 dimensions (each 1-10): Delivery Reliability, Communication Quality, Financial Stability, Flexibility/Responsiveness, Risk Concentration. Give overall grade (A-F), top 2 risk flags, and 3 relationship recommendations. Justify each score briefly. Format the output with clear headings for each section.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Input: ${prompt}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return NextResponse.json({ error: 'Failed to generate response' }, { status: response.status });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
