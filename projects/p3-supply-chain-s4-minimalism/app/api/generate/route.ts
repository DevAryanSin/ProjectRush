import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a logistics ETA recalculation AI. Given this disruption, provide: revised ETA (best case / likely / worst case), delay breakdown by cause, downstream impact on operations, and a draft stakeholder update email (3 sentences: what happened, new ETA, what's being done). Be realistic and specific. Format your response clearly with headings for each section. Use the following user data: `;

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
                  text: systemPrompt + prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to call Gemini API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
