import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an AI bias educator and red-team specialist.

If the input is a concept (mode: explainer):
* Explain it in plain, non-technical language
* Include analogy, example, impact, and one action
* Format as a structured JSON object with keys: title, summary, analogy, example, impact, action

If the input is a system (mode: redteam):
* Generate 10 adversarial bias test scenarios
* Make each scenario concrete and executable
* Format as a JSON array of objects with keys: attack, input, failure, detection

Always:
* Be clear and structured
* Avoid jargon unless absolutely necessary
* Focus on real-world applicability
* Return ONLY the JSON content.`;

    const fullPrompt = `Mode: ${mode}\nUser Input: ${prompt}\n\nResponse must be valid JSON.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt + "\n\n" + fullPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API Error:', data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch (e) {
      console.error('JSON Parse Error:', content);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
