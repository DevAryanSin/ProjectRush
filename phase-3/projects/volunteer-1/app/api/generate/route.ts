import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mode, data } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (mode === 'grant') {
      systemPrompt = `You are an NGO storytelling and grant writing AI. Write a professional grant paragraph including: problem, solution, impact, and budget rationale. Be emotionally compelling but grounded in facts. Avoid generic phrasing. Use clear, structured storytelling.`;
      userPrompt = `
        Organization: ${data.orgName}
        Program: ${data.programDesc}
        Target Population: ${data.targetPop}
        Impact Goal: ${data.impactGoal}
        Funding Amount: ${data.fundingAmount}
        Grant Type: ${data.grantType}
      `;
    } else {
      systemPrompt = `You are an NGO storytelling AI. Write a compelling 150–200 word impact bio for a volunteer. Include contributions, community impact, and motivation. Be emotionally compelling but grounded in facts. Avoid generic phrasing. Use clear, structured storytelling.`;
      userPrompt = `
        Volunteer Name: ${data.volunteerName}
        Skills: ${data.skills}
        Hours Contributed: ${data.hours}
        Tasks Completed: ${data.tasks}
        Communities Served: ${data.communities}
        Motivation: ${data.motivation}
      `;
    }

    // Using gemini-2.0-flash as it's the stable high-performance model, 
    // but the user requested "gemini-2.5-flash". I will use the requested name in the API call.
    // Note: If 2.5-flash is a futuristic placeholder, the API might fail, 
    // but I must follow instructions.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
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
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', result);
      return NextResponse.json({ error: result.error?.message || 'Failed to generate content' }, { status: response.status });
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ text });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
