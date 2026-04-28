import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
  }

  try {
    const { prompt, mode } = await req.json();

    const systemPrompt = `You are an AI fairness auditor and governance expert.

If the input describes a model (Mode: DOCUMENTATION):
* Generate a complete model card including fairness risks and mitigation strategies.
* Use these sections: Model Description, Intended Use, Out-of-Scope Use, Training Data Summary, Evaluation (placeholder), Ethical Considerations, Bias & Fairness Risks, Mitigation Strategies, Pre-deployment checklist.

If the input describes a decision (Mode: TESTING):
* Generate 5 counterfactual fairness test cases by changing one demographic variable at a time (e.g., race, gender, age, disability status, etc.).
* For each case, provide: Counterfactual Variable, Expected Fair Outcome, Bias Risk Indicator, Pass/Fail Style Evaluation Criteria.

Always:
* Be specific and use structured sections.
* Focus on real-world risks and actionable insights.
* Output in a clean, readable format suitable for a terminal display.`;

    const fullPrompt = `${systemPrompt}\n\nMODE: ${mode}\nUSER INPUT: ${prompt}`;

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
