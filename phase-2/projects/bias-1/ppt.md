# Brief
PromptBias is a web application that empowers users to identify and rectify bias embedded within AI prompts. It utilizes a distinctive Brutalist UI and the Gemini API to analyze prompts for discriminatory patterns, offering actionable insights and revised, bias-reduced versions.

# Opportunities
- Differentiation: Unique Brutalist UI commands attention and conveys a sense of urgent truth-telling. Focus on prompt-level bias detection as a distinct offering.
- Problem Solving Approach: Directly addresses the amplification of historical biases by AI systems at the point of prompt creation. Provides a tangible, user-friendly tool for proactive bias mitigation.
- USP: Real-time, detailed bias analysis of AI prompts with AI-driven rewritten suggestions, presented through a bold, unforgettable interface.

# Features
- Prominent "PromptBias" title and tagline.
- Brutalist-styled input form for AI prompts.
- Real-time loading state for submit button.
- Gemini-powered bias analysis: types, affected groups, severity.
- Rewritten, bias-reduced prompt suggestions.
- Clear visual hierarchy for displaying analysis results.
- User-friendly error handling.
- Fully responsive design across devices.

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS (with custom CSS variables)
- Gemini API (gemini-2.5-flash)
- Lucide React for icons

Constraints:
- No markdown like ** or ##
- No code
- Clean bullet points only
- Keep concise
--- FILE: app/page.tsx ---
'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Head from 'next/head';

interface BiasAnalysis {
  biasTypes: string;
  affectedGroups: string;
  severity: string;
  rewrittenPrompt: string;
}

export default function HomePage() {
  const [promptInput, setPromptInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<BiasAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        const parsedResult = parseGeminiResponse(data.result);
        setAnalysisResult(parsedResult);
      } else {
        throw new Error('Received empty result from API');
      }
    } catch (err: any) {
      console.error("API Error:", err);
      setError(`Failed to analyze prompt. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const parseGeminiResponse = (text: string): BiasAnalysis => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    let biasTypes = '';
    let affectedGroups = '';
    let severity = '';
    let rewrittenPrompt = '';
    let currentSection: 'biasTypes' | 'affectedGroups' | 'severity' | 'rewrittenPrompt' | null = null;

    lines.forEach(line => {
      if (line.toLowerCase().includes('bias types present')) {
        currentSection = 'biasTypes';
        biasTypes += line.replace(/.*:\s*/i, '').trim() + ' ';
      } else if (line.toLowerCase().includes('which groups are disadvantaged')) {
        currentSection = 'affectedGroups';
        affectedGroups += line.replace(/.*:\s*/i, '').trim() + ' ';
      } else if (line.toLowerCase().includes('severity rating')) {
        currentSection = 'severity';
        severity += line.replace(/.*:\s*/i, '').trim() + ' ';
      } else if (line.toLowerCase().includes('rewritten bias-reduced version')) {
        currentSection = 'rewrittenPrompt';
        rewrittenPrompt += line.replace(/.*:\s*/i, '').trim() + ' ';
      } else if (currentSection) {
        switch (currentSection) {
          case 'biasTypes':
            biasTypes += line.trim() + ' ';
            break;
          case 'affectedGroups':
            affectedGroups += line.trim() + ' ';
            break;
          case 'severity':
            severity += line.trim() + ' ';
            break;
          case 'rewrittenPrompt':
            rewrittenPrompt += line.trim() + ' ';
            break;
        }
      }
    });

    return {
      biasTypes: biasTypes.trim() || 'Analysis incomplete.',
      affectedGroups: affectedGroups.trim() || 'Analysis incomplete.',
      severity: severity.trim() || 'Analysis incomplete.',
      rewrittenPrompt: rewrittenPrompt.trim() || 'Analysis incomplete.',
    };
  };

  return (
    <div className="container mx-auto p-6 md:p-12">
      <Head>
        <title>PromptBias</title>
      </Head>

      <header className="mb-8 text-center">
        <h1 className="text-6xl font-black uppercase mb-2">PromptBias</h1>
        <p className="text-2xl font-bold uppercase">Paste any AI prompt — detect bias baked into the prompt itself</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="mb-12 p-6 border-4 border-black shadow-form">
          <label htmlFor="prompt" className="block text-3xl font-black uppercase mb-4">
            Enter your AI Prompt
          </label>
          <textarea
            id="prompt"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            rows={8}
            className="w-full p-4 text-xl font-bold border-4 border-black shadow-form focus:outline-none resize-none mb-6"
            placeholder="e.g., 'Write a story about a successful CEO...'"
            required
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-3xl font-black uppercase bg-accent border-4 border-black shadow-form transition-shadow duration-200 ease-in-out ${loading ? 'cursor-not-allowed' : 'hover:shadow-form-press'}`}
          >
            {loading ? <Loader2 className="inline-block animate-spin mr-2" /> : ''}
            Analyze Prompt
          </button>
        </form>

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="inline-block w-16 h-16 animate-spin text-black" />
            <p className="text-3xl font-black uppercase mt-4">Analyzing...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-300 text-black p-6 border-4 border-black shadow-form text-center">
            <p className="text-3xl font-black uppercase mb-4">Error</p>
            <p className="text-xl">{error}</p>
          </div>
        )}

        {analysisResult && !loading && (
          <div className="bg-white p-6 md:p-12 border-4 border-black shadow-form">
            <h2 className="text-5xl font-black uppercase mb-6 text-center">Analysis Results</h2>

            <section className="mb-8 p-6 border-4 border-black shadow-form">
              <h3 className="text-4xl font-black uppercase mb-4">Bias Types Found</h3>
              <p className="text-xl">{analysisResult.biasTypes}</p>
            </section>

            <section className="mb-8 p-6 border-4 border-black shadow-form">
              <h3 className="text-4xl font-black uppercase mb-4">Affected Groups</h3>
              <p className="text-xl">{analysisResult.affectedGroups}</p>
            </section>

            <section className="mb-8 p-6 border-4 border-black shadow-form">
              <h3 className="text-4xl font-black uppercase mb-4">Severity Rating</h3>
              <p className="text-xl">{analysisResult.severity}</p>
            </section>

            <section className="p-6 border-4 border-black shadow-form">
              <h3 className="text-4xl font-black uppercase mb-4">Bias-Reduced Prompt</h3>
              <p className="text-xl whitespace-pre-wrap">{analysisResult.rewrittenPrompt}</p>
            </section>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-xl font-bold">
        <p>© {new Date().getFullYear()} PromptBias. All rights reserved.</p>
      </footer>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not configured.');
    return NextResponse.json({ error: 'Internal server error: API key not configured.' }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are a prompt bias auditor. Analyze this AI prompt for: (1) Bias types present (framing/assumption/exclusion/stereotype), (2) Which groups are disadvantaged by the bias, (3) Severity rating HIGH/MEDIUM/LOW for each, (4) A rewritten bias-reduced version of the prompt. Be specific about which exact words or phrases carry bias.`;

    const geminiPrompt = `${systemPrompt}\n\nUser prompt to analyze:\n${prompt}`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorBody}`);
      throw new Error(`Gemini API returned status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const geminiResponseText = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ result: geminiResponseText });
    } else {
      console.error('Unexpected response structure from Gemini:', data);
      throw new Error('Received unexpected response structure from Gemini.');
    }

  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts Import - Impact for headings, Space Grotesk for body */
@import url('https://fonts.googleapis.com/css2?family=Impact&family=Space+Grotesk:wght@400;700;800;900&display=swap');

:root {
  --primary-bg: #FFFFFF;
  --text-color: #000000;
  --accent-color: #FFFF00; /* Loud Yellow */
  --border-color: #000000;
  --shadow-color: #000000;
}

body {
  font-family: 'Space Grotesk', sans-serif;
  background-color: var(--primary-bg);
  color: var(--text-color);
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Impact', sans-serif;
  font-weight: 900; /* Extra Bold */
  text-transform: uppercase;
  color: var(--text-color);
}

.container {
  max-width: 1200px;
  width: 100%;
}

/* Brutalist Styles */
.border-4 {
  border-width: 4px !important;
}
.border-black {
  border-color: var(--border-color) !important;
}

.shadow-form {
  box-shadow: 6px 6px 0 var(--shadow-color) !important;
}

/* Button Hover Effect */
.hover\:shadow-form-press:hover {
  box-shadow: 2px 2px 0 var(--shadow-color) !important;
  transform: translate(4px, 4px); /* Simulates pressing down */
}

/* Accent Color */
.bg-accent {
  background-color: var(--accent-color);
}

/* Input and Textarea Styling */
textarea, input {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800; /* Bold */
  border-color: var(--border-color);
  box-shadow: 6px 6px 0 var(--shadow-color);
  padding: 1rem;
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem; /* leading-7 */
}

textarea:focus, input:focus {
  outline: none;
  border-color: var(--border-color); /* Ensure border remains */
  box-shadow: 6px 6px 0 var(--shadow-color); /* Ensure shadow remains */
}

/* Explicitly reset rounded corners */
* {
  border-radius: 0 !important;
}

/* Utility classes for specific overrides if needed */
.text-6xl { font-size: 4rem; line-height: 1; } /* Impact font needs adjustment */
.text-5xl { font-size: 3.5rem; line-height: 1; }
.text-4xl { font-size: 2.75rem; line-height: 1; }
.text-3xl { font-size: 2.25rem; line-height: 1; }
.text-2xl { font-size: 1.5rem; line-height: 1.5; } /* Tagline */
.text-xl { font-size: 1.25rem; line-height: 1.75; }
.text-lg { font-size: 1.125rem; line-height: 1.625; }


@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
  .text-6xl { font-size: 5rem; }
  .text-5xl { font-size: 4rem; }
  .text-4xl { font-size: 3rem; }
  .text-3xl { font-size: 2.5rem; }
  .text-2xl { font-size: 1.75rem; }
  .text-xl { font-size: 1.375rem; }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
  .text-6xl { font-size: 6rem; }
  .text-5xl { font-size: 4.5rem; }
  .text-4xl { font-size: 3.5rem; }
  .text-3xl { font-size: 2.75rem; }
  .text-2xl { font-size: 2rem; }
  .text-xl { font-size: 1.5rem; }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1140px;
  }
}
--- END ---