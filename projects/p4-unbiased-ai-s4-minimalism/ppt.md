# Brief
DecisionTrace is a minimalist web application that demystifies automated decision-making. It takes an automated decision's output, associated factors, and domain as input, and provides a human-readable explanation using Gemini AI. The goal is to increase transparency, identify potential bias, and empower individuals with knowledge about decisions affecting them in areas like loans, jobs, and medical care.

# Opportunities
## Differentiation
DecisionTrace stands out by offering a hyper-minimalist, typography-first UI that prioritizes clarity and ease of use over visual clutter. Its focus on translating opaque AI decisions into actionable, plain-language insights addresses a critical gap in algorithmic accountability.

## Problem Solving Approach
The solution tackles the problem of biased AI by providing a direct interface for users to understand *why* an automated decision was made. By surfacing the factors influencing a decision and potential avenues for recourse, it empowers individuals and encourages organizations to address biases proactively.

## USP
Plain-language explanation of complex AI decisions, delivered through an ultra-minimalist, accessible UI, fostering transparency and accountability.

# Features
- User-friendly form for inputting automated decision details.
- Real-time loading state for AI analysis.
- Clear, hierarchical display of Gemini AI-generated explanations.
- Comprehensive plain-language breakdown: decision logic, key factors, outcome modifiers, and user rights.
- Fully responsive design adhering to minimalist principles.
- Error handling for a robust user experience.

# Technologies
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- AI Integration: Gemini API (`gemini-2.5-flash`)
- Icons: Lucide React

--- FILE: app/page.tsx ---
'use client';

import { useState } from 'react';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeDecision = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
      console.error('Error analyzing decision:', err);
      setError(`Failed to analyze decision. Please try again. (${err.message})`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const isSubmitDisabled = !input.trim() || isLoading;

  return (
    <div className="min-h-screen bg-background text-primary px-4 py-12 md:py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 leading-tight">
          DecisionTrace
        </h1>
        <p className="text-xl text-center text-secondary mb-16">
          Paste an automated decision output — get a plain-language explanation anyone can understand.
        </p>

        <div className="border-t border-hairline pt-16 mb-16">
          <h2 className="text-3xl font-semibold mb-8">Analyze Your Decision</h2>
          <textarea
            rows={8}
            className="w-full p-0 text-lg border-b border-hairline focus:outline-none focus:ring-0 resize-none bg-transparent placeholder-secondary"
            placeholder="Enter the automated decision details here (e.g., 'Loan application denied. Reason: Insufficient credit history, high debt-to-income ratio. Domain: Finance')."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            onClick={analyzeDecision}
            disabled={isSubmitDisabled}
            suppressHydrationWarning
            className={`mt-8 w-full py-3 px-6 text-lg font-semibold rounded-md transition-colors
              ${isSubmitDisabled
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-accent text-white hover:bg-accent-dark'
              }`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Decision'}
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-16">
            <p className="text-secondary">Analyzing your decision. This may take a moment...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-red-50 p-6 rounded-md border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="border-t border-hairline pt-16">
            <h2 className="text-3xl font-semibold mb-8">Explanation</h2>
            <div className="prose max-w-none text-lg leading-relaxed">
              <p>{result}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Invalid prompt provided' }, { status: 400 });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not found');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const systemPrompt = `You are an algorithmic decision explainability AI. A person received this automated decision. Explain it in plain language covering: (1) Why this decision was likely made (key factors), (2) What factor had the biggest impact, (3) What could realistically change the outcome, (4) What rights this person has to appeal or request review. Use simple language a non-technical person would understand. Avoid jargon.`;

  const fullPrompt = `${systemPrompt}\n\nUser Input:\n${prompt}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorBody}`);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates.length || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts.length) {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(data));
      throw new Error('Received an unexpected response format from Gemini.');
    }

    const geminiResponseText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ result: geminiResponseText });

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: `Failed to generate content: ${error.message}` }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=DM+Serif+Display&display=swap');

:root {
  --color-background: #f9f9f9; /* Off-white */
  --color-primary: #1a1a1a;   /* Near-black */
  --color-secondary: #666666; /* Medium gray for subtle text */
  --color-accent: #673ab7;    /* Deep Purple */
  --color-accent-dark: #512da8; /* Darker Purple for hover */
  --color-hairline: #e0e0e0;  /* Light gray for borders */
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--color-background);
  color: var(--color-primary);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'DM Serif Display', serif;
  color: var(--color-primary);
}

h1 {
  font-size: 3rem; /* 48px */
  line-height: 1.2;
}

h2 {
  font-size: 2.25rem; /* 36px */
  line-height: 1.2;
}

p {
  margin-bottom: 1.5em;
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

a:hover {
  color: var(--color-accent-dark);
  text-decoration: underline;
}

button {
  cursor: pointer;
}

.border-hairline {
  border-color: var(--color-hairline);
}

.bg-background {
  background-color: var(--color-background);
}

.text-primary {
  color: var(--color-primary);
}

.text-secondary {
  color: var(--color-secondary);
}

.bg-accent {
  background-color: var(--color-accent);
}

.hover\:bg-accent-dark:hover {
  background-color: var(--color-accent-dark);
}

.prose {
  color: var(--color-primary);
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  font-family: 'DM Serif Display', serif;
  color: var(--color-primary);
}

.prose p {
  margin-bottom: 1.5em;
  font-size: 1.125rem; /* 18px */
  line-height: 1.7;
}

.prose strong {
  font-weight: 700;
}

.prose ul,
.prose ol {
  margin-bottom: 1.5em;
  padding-left: 1.5em;
}

.prose li {
  margin-bottom: 0.5em;
}

textarea {
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem; /* 18px */
}

@media (min-width: 768px) {
  h1 {
    font-size: 4rem; /* 64px */
  }
  h2 {
    font-size: 2.75rem; /* 44px */
  }
  textarea {
    font-size: 1.25rem; /* 20px */
  }
}
--- END ---