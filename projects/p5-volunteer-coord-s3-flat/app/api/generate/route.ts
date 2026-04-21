import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are a volunteer task planning AI for NGOs. Decompose this community problem into exactly 6-8 specific volunteer tasks. For each task: task name, clear deliverable, required skills (max 3), time estimate (hours), volunteer count needed, dependencies on other tasks, and success criteria. Make tasks specific enough to assign immediately. Output as a structured task list. Format each task clearly with a title and bullet points.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Input: ${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Error generating tasks:', error);
    return NextResponse.json({ error: 'Failed to generate tasks' }, { status: 500 });
  }
}
