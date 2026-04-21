import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ result: 'API configuration error: Key missing' }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ result: 'Please provide a prompt.' }, { status: 400 });
    }

    const systemPrompt = `You are a sports media rights advisor named RightsDesk. Answer this rights question or analyze this asset registration clearly and practically. Cover: ownership status, applicable protections, licensing options, and top 3 recommended actions. Use plain language alongside precise legal terms. Always structure your response well using markdown formatting (bolding, lists, and headings if necessary), ensuring it's professional and authoritative.

User Input: ${prompt}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(endpoint, {
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
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return NextResponse.json({ result: resultText });

  } catch (error: any) {
    console.error('Error generating response:', error);
    return NextResponse.json({ result: `Error generating response: ${error.message}` }, { status: 500 });
  }
}
