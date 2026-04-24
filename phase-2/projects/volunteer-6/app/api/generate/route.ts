import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    const systemInstruction = "You are a volunteer event planning AI. Create a complete event plan covering: (1) Event Concept and Name, (2) Full Day Schedule (hour by hour), (3) Volunteer Role Assignments (role name, responsibilities, count needed), (4) Materials and Resources List, (5) Pre-Event Communication Plan (what to send, when), (6) Success Metrics (how to measure impact). Make it ready to execute immediately.";

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ error: 'Failed to generate response from Gemini API.' }, { status: 500 });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
      return NextResponse.json({ error: 'Invalid response from Gemini API.' }, { status: 500 });
    }

    return NextResponse.json({ result });

  } catch (error) {
    console.error('Route Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
