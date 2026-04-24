import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = "You are a hospitality incident analyst. Write a post-mortem report with these sections: Executive Summary (2 sentences), Incident Timeline, Root Cause Analysis (5-Why format), What Worked Well, What Failed, 5-Item Prevention Plan ordered by priority. Be constructive and specific.";
    
    const combinedPrompt = `${systemPrompt}\n\nIncident Details from User:\n${prompt}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: combinedPrompt }]
        }],
        generationConfig: {
          temperature: 0.2,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate content' }, { status: response.status });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json({ error: 'Invalid response from model' }, { status: 500 });
    }

    return NextResponse.json({ result: generatedText });

  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
