import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      console.error('GEMINI_API_KEY is not defined');
      return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
    }

    const systemPrompt = `You are a crisis communications AI for a hospitality venue. Convert this incident report into a structured emergency alert with 4 separate role-specific summaries: (1) Security Team, (2) Medical Response, (3) Management, (4) Guest Communication. Each should be 2-3 sentences, clear and action-focused.
    
Output pure JSON exactly in this format without markdown or backticks:
{
  "level": "(Extract the severity level 1-5)",
  "severityDescription": "(Short 2-3 word description of the severity)",
  "security": "(security team summary)",
  "medical": "(medical response summary)",
  "management": "(management action summary)",
  "guestComms": "(guest comms summary)"
}

Here is the incident report:
${prompt}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ error: `Gemini API returned ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json({ error: 'No response from Gemini API' }, { status: 500 });
    }

    const resultText = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ result: resultText });

  } catch (error: any) {
    console.error('Error generating response:', error);
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}
