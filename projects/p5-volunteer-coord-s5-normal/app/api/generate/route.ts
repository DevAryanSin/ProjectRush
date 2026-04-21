import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('GEMINI_API_KEY is not defined');
      return NextResponse.json({ error: 'API Key configuration error' }, { status: 500 });
    }

    const systemPrompt = `You are a field documentation AI for NGOs. Convert this volunteer field report into a structured record with these sections: 
1. Date/Location 
2. Volunteer Name (if mentioned) 
3. Activities Completed 
4. Beneficiaries Reached (count + description) 
5. Resources Used 
6. Issues Encountered (flag urgent ones) 
7. Follow-Up Required 
8. Overall Field Status (GREEN/YELLOW/RED)

Note any critical information that is missing. Use markdown formatting for the response.`;

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
              parts: [{ text: `${systemPrompt}\n\nUser Field Report:\n${prompt}` }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: 'AI generation failed' }, { status: response.status });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
