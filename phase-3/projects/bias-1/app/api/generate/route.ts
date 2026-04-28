import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const systemInstruction = `You are a bias and fairness auditor. Analyze the input text and:
(1) Identify all biased or discriminatory phrases (quote exact text),
(2) Classify bias type (framing, assumption, exclusion, stereotype),
(3) Identify affected groups,
(4) Assign severity HIGH/MEDIUM/LOW,
(5) Explain why each instance is problematic,
(6) Provide a fully rewritten, bias-reduced version of the text.

If the input is a job description, apply inclusive hiring principles and reference EEOC-style fairness where relevant.

CRITICAL: Return the response as a JSON object with the following structure:
{
  "findings": [
    {
      "phrase": "quoted text",
      "type": "bias type",
      "groups": ["affected group"],
      "severity": "HIGH/MEDIUM/LOW",
      "explanation": "explanation"
    }
  ],
  "rewritten": "full rewritten text"
}
Do not include any markdown formatting like \`\`\`json or \`\`\` in the response. Just the raw JSON.`;

    const fullPrompt = `${systemInstruction}\n\nMode: ${mode === 'hiring' ? 'Hiring Audit' : 'Prompt Audit'}\n\nInput Text:\n${prompt}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }

    // Try to parse the text as JSON, handle potential formatting issues
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanText);
      return NextResponse.json(parsedData);
    } catch (e) {
      // Fallback if parsing fails - wrap text in a compatible structure
      return NextResponse.json({ 
        findings: [], 
        rewritten: text 
      });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
