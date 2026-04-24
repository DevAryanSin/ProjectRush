import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const systemPrompt = "You are a community intelligence AI for NGOs. Analyze these social media posts and extract: (1) Top 5 unmet needs ranked by urgency (1-10 score), (2) Sentiment per need (frustrated/scared/resigned/hopeful), (3) Population segments most affected, (4) Hidden needs not stated explicitly but implied, (5) 3 specific NGO interventions recommended. Quote specific posts as evidence.";
    
    const combinedPrompt = `${systemPrompt}\n\nUser Input:\n${prompt}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: combinedPrompt }]
          }
        ],
        generationConfig: {
            temperature: 0.4,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', response.status, errorData);
      return NextResponse.json({ error: 'Failed to generate response from AI' }, { status: response.status });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
