import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    const systemPrompt = "You are an AI documentation specialist. Generate a model card with these sections: Model Description, Intended Use, Out-of-Scope Uses, Training Data Summary, Evaluation Results (placeholder), Ethical Considerations, Bias and Fairness Risks (list specific risks for this model type), Recommended Mitigations, and a 10-item Pre-Deployment Fairness Checklist. Be specific to this model's domain.";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nUser Input: ${prompt}` }]
        }]
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

    return NextResponse.json({ result: text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
