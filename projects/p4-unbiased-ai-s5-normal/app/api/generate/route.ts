import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt: userInput } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured in the environment.' }, { status: 500 });
    }

    const systemPrompt = `You are an AI debiasing specialist. Given this biased outcome, create a concrete action plan with exactly 5 steps ordered by impact. 
    For each step, follow this structure:
    STEP [number]: [Technique Name]
    IMPLEMENTATION: [Detailed, technical explanation of how to apply it specifically for this case]
    EFFORT: [Low/Medium/High]
    REDUCTION: [Estimated percentage or qualitative description of bias reduction]
    
    Be technical, actionable, and focused on mathematical or programmatic interventions (e.g., reweighting, resampling, adversarial debiasing, calibration).`;

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
                  text: `${systemPrompt}\n\nUSER INPUT:\n${userInput}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || 'Gemini API request failed' }, { status: response.status });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Internal server error occurred while processing the request.' }, { status: 500 });
  }
}
