import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are a resource allocation AI for NGO operations. Given these community needs and available resources, produce: ranked priority list (1 = most urgent) with urgency score (1-10) for each, reasoning for each ranking, recommended volunteer allocation per need (hours and headcount), budget allocation suggestion (%), and a 1-week deployment strategy. Justify trade-offs explicitly. 

Format the response using clean Markdown with clear headings for each section. Use bolding for key terms. Avoid technical jargon where possible, but stay precise.`;

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
                  text: `${systemPrompt}\n\nUser Input:\n${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return NextResponse.json({ error: 'Failed to generate response from Gemini' }, { status: response.status });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
