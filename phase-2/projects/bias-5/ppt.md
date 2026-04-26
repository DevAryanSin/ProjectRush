# Brief
BiasTranslator is a web application that demystifies AI bias for business stakeholders. It translates technical jargon into understandable insights, enabling organizations to proactively identify and mitigate algorithmic discrimination in their systems.

# Opportunities
- Differentiation: Provides a unique, accessible tool for AI ethics and fairness in a market often saturated with technical documentation.
- Problem Solving Approach: Addresses the critical gap in understanding AI bias by focusing on clarity, relevance, and actionable insights for non-technical audiences.
- USP: Combines expert AI bias translation with an elegant, trustworthy editorial UI, making complex topics approachable and fostering responsible AI adoption.

# Features
- Clear input for AI bias concepts
- Plain-language explanations
- Intuitive real-world analogies
- Concrete business-context examples
- Explanation of legal and reputational impact
- Actionable recommendations for organizations
- Editorial UI with serif fonts and structured layout
- Responsive design for all devices
- Loading and error state handling

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini API (gemini-2.5-flash)
- Lucide-react icons

Constraints:
- No markdown like ** or ##
- No code
- Clean bullet points only
- Keep concise
--- FILE: app/page.tsx ---
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Head from 'next/head';

interface BiasExplanation {
  definition: string;
  analogy: string;
  example: string;
  impact: string;
  action: string;
}

export default function Home() {
  const [biasConcept, setBiasConcept] = useState('');
  const [explanation, setExplanation] = useState<BiasExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setExplanation(null);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: biasConcept }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch explanation. Please try again.');
      }

      const data = await response.json();
      const rawText = data.result;

      // Basic parsing assuming Gemini returns structured points
      const lines = rawText.split('\n').filter((line: string) => line.trim() !== '');
      const parsedExplanation: Partial<BiasExplanation> = {};

      let currentSection: keyof BiasExplanation | null = null;
      lines.forEach((line: string) => {
        if (line.toLowerCase().startsWith('one-sentence plain definition:')) {
          parsedExplanation.definition = line.substring('one-sentence plain definition:'.length).trim();
          currentSection = 'definition';
        } else if (line.toLowerCase().startsWith('a real-world analogy that makes it intuitive:')) {
          parsedExplanation.analogy = line.substring('a real-world analogy that makes it intuitive:'.length).trim();
          currentSection = 'analogy';
        } else if (line.toLowerCase().startsWith('a concrete example in a business context:')) {
          parsedExplanation.example = line.substring('a concrete example in a business context:'.length).trim();
          currentSection = 'example';
        } else if (line.toLowerCase().startsWith('why it matters legally and reputationally:')) {
          parsedExplanation.impact = line.substring('why it matters legally and reputationally:'.length).trim();
          currentSection = 'impact';
        } else if (line.toLowerCase().startsWith('one simple thing the organization can do about it:')) {
          parsedExplanation.action = line.substring('one simple thing the organization can do about it:'.length).trim();
          currentSection = 'action';
        } else if (currentSection && parsedExplanation[currentSection]) {
          // Append to the current section if it's a continuation
          parsedExplanation[currentSection] += ' ' + line.trim();
        }
      });

      setExplanation(parsedExplanation as BiasExplanation);

    } catch (err: any) {
      console.error('Error fetching explanation:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 font-serif text-[#1a1a1a]">
      <Head>
        <title>BiasTranslator</title>
      </Head>

      <header className="mb-8 text-center">
        <h1 className="text-6xl font-bold mb-2 font-serif-display text-[#1a1a1a]">BiasTranslator</h1>
        <p className="text-xl text-gray-700">Explain any AI bias concept in plain language for non-technical stakeholders</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="mb-12 max-w-xl mx-auto p-6 border border-gray-300 shadow-sm">
          <label htmlFor="biasConcept" className="block text-xl font-semibold mb-4 font-serif-display text-[#1a1a1a]">
            Enter AI Bias Concept:
          </label>
          <input
            type="text"
            id="biasConcept"
            value={biasConcept}
            onChange={(e) => setBiasConcept(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 font-serif text-base text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., demographic parity, disparate impact"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white font-bold py-3 px-6 font-serif text-lg hover:bg-red-800 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin mx-auto h-6 w-6" /> : 'Translate'}
          </button>
        </form>

        {error && (
          <div className="text-center text-red-600 font-serif py-4">
            Error: {error}
          </div>
        )}

        {explanation && !loading && (
          <article className="max-w-4xl mx-auto mt-8 p-6 border border-gray-300 bg-white shadow-sm editorial-content">
            <h2 className="text-4xl font-bold mb-4 font-serif-display text-[#1a1a1a]">{biasConcept} Explained</h2>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2 font-serif-display text-red-700">Definition</h3>
              <p className="text-base leading-relaxed font-serif text-[#1a1a1a]">{explanation.definition}</p>
            </div>
            <hr className="border-t-1 border-gray-300 my-6" />
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2 font-serif-display text-red-700">Analogy</h3>
              <p className="text-base leading-relaxed font-serif text-[#1a1a1a]">{explanation.analogy}</p>
            </div>
            <hr className="border-t-1 border-gray-300 my-6" />
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2 font-serif-display text-red-700">Business Context Example</h3>
              <p className="text-base leading-relaxed font-serif text-[#1a1a1a]">{explanation.example}</p>
            </div>
            <hr className="border-t-1 border-gray-300 my-6" />
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2 font-serif-display text-red-700">Why It Matters (Legal & Reputational)</h3>
              <p className="text-base leading-relaxed font-serif text-[#1a1a1a]">{explanation.impact}</p>
            </div>
            <hr className="border-t-1 border-gray-300 my-6" />
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2 font-serif-display text-red-700">Simple Actionable Step</h3>
              <p className="text-base leading-relaxed font-serif text-[#1a1a1a]">{explanation.action}</p>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    return NextResponse.json({ error: "Server configuration error. Please contact administrator." }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Bias concept is required." }, { status: 400 });
    }

    const systemPrompt = `You are an AI ethics translator for non-technical audiences. Explain this bias concept with: (1) One-sentence plain definition, (2) A real-world analogy that makes it intuitive, (3) A concrete example in a business context, (4) Why it matters legally and reputationally, (5) One simple thing the organization can do about it. Use zero technical jargon.`;

    const fullPrompt = `${systemPrompt}\n\nBias concept: ${prompt}`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorBody}`);
      throw new Error(`Gemini API request failed with status ${response.status}.`);
    }

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API returned an error:", data.error);
      throw new Error(data.error.message || "An error occurred with the AI model.");
    }

    const geminiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!geminiResponseText) {
      console.error("Unexpected response format from Gemini API:", data);
      throw new Error("Received an unexpected response format from the AI model.");
    }

    return NextResponse.json({ result: geminiResponseText });

  } catch (error: any) {
    console.error("Error in /api/generate route:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;700&display=swap');

:root {
  --background-cream: #f5f0e8; /* Slightly warmer off-white */
  --text-near-black: #1a1a1a;
  --text-dark-grey: #4a4a4a;
  --accent-red: #b00000; /* Dark red */
  --accent-blue: #0000b0; /* Dark blue */
  --accent-green: #006400; /* Forest green */
}

body {
  background-color: var(--background-cream);
  color: var(--text-near-black);
  font-family: 'Lora', serif; /* Default body font */
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif; /* Heading font */
  color: var(--text-near-black);
}

.font-serif-display {
  font-family: 'Playfair Display', serif;
}

/* Tailwind customizations */
.container {
  max-width: 1200px;
}

/* Editorial style elements */
.editorial-content h1,
.editorial-content h2,
.editorial-content h3,
.editorial-content h4 {
  margin-bottom: 0.8em;
}

.editorial-content p {
  margin-bottom: 1em;
}

.editorial-content h2 {
  font-size: 2.5rem; /* Corresponds to ~40px */
  line-height: 1.2;
}

.editorial-content h3 {
  font-size: 1.75rem; /* Corresponds to ~28px */
  line-height: 1.3;
  color: var(--accent-red); /* Using red as the accent for headings within results */
}

.editorial-content p {
  font-size: 1rem; /* Corresponds to ~16px */
  line-height: 1.7; /* Slightly increased for readability */
}

/* Add thin rule lines between sections if needed, e.g., via border-bottom on elements */
.editorial-content > div + div {
  margin-top: 1.5rem; /* Space before the next section starts */
}

.editorial-content hr {
  border-color: var(--text-dark-grey);
  border-width: 1px;
  margin: 2rem 0;
}

/* Pull quotes styling - not explicitly requested in the prompt but good for editorial */
.pull-quote {
  font-style: italic;
  font-size: 1.4rem;
  line-height: 1.5;
  margin: 1.5em 0;
  color: var(--text-dark-grey);
}

/* Date/byline style metadata - placeholder for potential future use */
.metadata {
  font-size: 0.9rem;
  color: var(--text-dark-grey);
  margin-bottom: 1.5em;
}

/* Form and button styling */
input[type="text"],
textarea {
  font-family: 'Lora', serif;
  border-radius: 0; /* Sharp corners */
  padding: 12px 16px;
  border: 1px solid var(--text-dark-grey);
  background-color: white;
  color: var(--text-near-black);
  transition: border-color 0.2s ease-in-out, ring-color 0.2s ease-in-out;
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent-red);
  box-shadow: 0 0 0 2px rgba(176, 0, 0, 0.3); /* Accent color ring */
}

button[type="submit"] {
  background-color: var(--accent-red);
  color: white;
  font-family: 'Playfair Display', serif; /* Match heading font for buttons */
  font-weight: 700;
  font-size: 1.1rem; /* Corresponds to ~17.6px */
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-radius: 0; /* Sharp corners */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #8c0000; /* Darker red on hover */
}

button[type="submit"]:disabled {
  background-color: var(--text-dark-grey);
  opacity: 0.7;
  cursor: not-allowed;
}

/* Ensure results are readable and follow editorial style */
.editorial-content {
  background-color: white;
  padding: 2rem;
  border: 1px solid var(--text-dark-grey);
  box-shadow: 2px 2px 0px var(--text-dark-grey); /* Subtle shadow mimicking print */
}
--- END ---