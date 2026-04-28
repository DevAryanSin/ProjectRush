import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    // Using gemini-2.5-flash as strictly requested by the user
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a risk analysis and incident review AI.

If the input describes a venue:
* Identify hazard zones with: risk level (HIGH/MEDIUM/LOW), hazard types, explanation, and 2 mitigation actions per zone.
* Provide top 3 emergency access recommendations.
* Output format: Return a JSON object with "type": "hazard" and "zones": [{ "name", "riskLevel", "hazards", "explanation", "mitigations": [] }] and "recommendations": [].

If the input describes an incident:
* Generate a structured post-mortem:
  Executive Summary (2 sentences),
  Timeline,
  Root Cause Analysis (5-Why),
  What Worked,
  What Failed,
  5-item Prevention Plan.
* Output format: Return a JSON object with "type": "post-mortem", "summary", "timeline": [], "rootCause": [], "whatWorked": [], "whatFailed": [], "preventionPlan": [].

Always be specific, practical, and actionable. Avoid generic statements.
Return ONLY valid JSON.

User Input: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.2, // Lower temperature for more structured JSON
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || 'Gemini API error' }, { status: response.status });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Parse the JSON to ensure it's valid before sending to client
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid response format from AI', raw: text }, { status: 500 });
    }
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
