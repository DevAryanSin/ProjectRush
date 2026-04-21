import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an AI ethics compliance auditor. For this AI system, generate a compliance checklist covering: EU AI Act requirements, NIST AI Risk Management Framework, and IEEE 7010 Wellbeing standard. 

For each checklist item, follow this exact format:
- [STANDARD] Requirement Name: Short description
- STATUS: [LIKELY COMPLIANT / NEEDS REVIEW / LIKELY NON-COMPLIANT]
- REASONING: Brief explanation of why this status was given based on the system description.

After the checklist, include a section titled "TOP 3 RISK GAPS" with three bullet points highlighting the highest-risk compliance gaps.

System Description provided by user:
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
              parts: [{ text: systemPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Failed to fetch from Gemini' }, { status: response.status });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from analysis tool.';

    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    console.error('Error in EthicsCheck API:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
