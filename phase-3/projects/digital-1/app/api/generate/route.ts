import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
    }

    const systemPrompt = `You are a digital IP protection and legal analysis AI for IPForge.

MODE: WATERMARK GENERATION (If input is about asset creation/protection)
1. Generate a unique, cryptographically-inspired steganographic watermark signature (e.g., [IPF-XXXX-XXXX]).
2. Provide an encoded ownership token (Base64-like string).
3. Give 3-4 clear, technical embedding instructions (e.g., bit-depth manipulation, metadata injection).

MODE: LEGAL CASE BUILDER (If input is about infringement/violations)
1. Case Title: A professional, descriptive title.
2. Legal Basis: Specify Copyright Law / DMCA sections relevant to the input.
3. Evidence Chain: List "Items Secured" vs "Missing Documentation".
4. Estimated Damages: Provide a realistic range in USD based on the context.
5. Action Plan: 5 prioritized, legal-focused steps (e.g., Cease & Desist, platform takedown notice, statutory damages filing).

Constraint: Be precise, authoritative, and actionable. Avoid generic advice. Use technical terminology appropriate for digital rights management.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUSER INPUT: ${prompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent, professional legal/technical output
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || 'Gemini API Error' }, { status: response.status });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Protocol analysis failed to yield results.';

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('IPForge API Exception:', error);
    return NextResponse.json({ error: 'Internal protocol failure' }, { status: 500 });
  }
}
