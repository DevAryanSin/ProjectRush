import { NextResponse } from 'next/server';

const systemPrompt = `You are a digital asset authentication specialist. Analyze these asset metadata signals and provide: authenticity score (0-100%), list of positive originality signals, list of suspicious anomalies, and a one-paragraph verification summary. Be precise.

Format the output strictly as JSON with this schema:
{
  "score": 85,
  "summary": "This asset demonstrates consistent temporal lineage...",
  "signals": ["First published on verified platform", "Creator signature match"],
  "anomalies": ["Minor compression artifacts detected"]
}
If there are no anomalies, return an empty array for anomalies. Return ONLY valid JSON, without markdown formatting blocks.`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

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
              parts: [{ text: `${systemPrompt}\n\nUser Input: ${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error('No valid response from Gemini');
    }

    return NextResponse.json({ result: resultText });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
