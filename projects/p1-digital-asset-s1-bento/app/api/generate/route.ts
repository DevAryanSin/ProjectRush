import { NextRequest, NextResponse } from 'next/server';

const GEMINI_SYSTEM_PROMPT =
  'You are a digital IP protection AI specializing in sports media rights. Analyze the following content for signs of unauthorized sports media use. Provide a clear response with exactly these four sections:\n\n1. RISK LEVEL: State HIGH, MEDIUM, or LOW on its own line.\n2. CONFIDENCE: State a percentage (e.g. 82%) on its own line.\n3. RED FLAGS: List exactly 3 specific red flags found, numbered 1. 2. 3.\n4. RECOMMENDED ACTION: Give one specific, actionable recommendation on its own line.\n\nBe specific, factual, and actionable. Consider: missing attribution, suspicious platform patterns, content anomalies, metadata inconsistencies, unauthorized redistribution signals.\n\nContent to analyze:\n';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userPrompt: string = body?.prompt ?? '';

    if (!userPrompt.trim()) {
      return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      contents: [
        {
          parts: [
            {
              text: GEMINI_SYSTEM_PROMPT + userPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    };

    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json(
        { error: `Gemini API error: ${geminiRes.status}` },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const result =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response from Gemini.';

    return NextResponse.json({ result });
  } catch (err) {
    console.error('Route error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
