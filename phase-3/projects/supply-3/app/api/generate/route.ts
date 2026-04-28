import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mode, inputs } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (mode === 'demand') {
      systemPrompt = `You are a supply chain intelligence AI. Predict demand direction, magnitude, and confidence. Identify key drivers and counter-signals. Recommend inventory action.
Always: Be structured, specific, and practical. Avoid generic statements. Focus on actionable outputs.`;
      userPrompt = `Industry: ${inputs.industry}\nSignals: ${inputs.signals}\nCurrent Inventory: ${inputs.inventory}`;
    } else {
      systemPrompt = `You are a supply chain contract strategy AI. Generate 4 structured contract clauses: Force Majeure, SLA Flexibility, Liability Caps, and Dispute Resolution.
Always: Be structured, specific, and practical. Avoid generic statements. Focus on actionable outputs. Format each clause with a clear title.`;
      userPrompt = `Contract Type: ${inputs.type}\nDisruption Scenario: ${inputs.scenario}\nRole: ${inputs.role}\nJurisdiction: ${inputs.jurisdiction}\nRisk Tolerance: ${inputs.risk}`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Input:\n${userPrompt}` }],
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

    if (!response.ok) {
      const errorData = await response.json();
      // If gemini-2.5-flash is not found, fallback to gemini-1.5-flash as a safety measure for the demo
      if (response.status === 404 || response.status === 400) {
         const fallbackResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Input:\n${userPrompt}` }] }],
            }),
         });
         if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            return NextResponse.json({ text: data.candidates[0].content.parts[0].text });
         }
      }
      return NextResponse.json({ error: 'Failed to generate content', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
