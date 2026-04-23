# Brief
ScanGuard addresses the critical need for sports organizations to protect their high-value digital media from misappropriation and unauthorized redistribution across global platforms. By leveraging AI, it provides a proactive, scalable solution to identify and flag content violations in near real-time, helping maintain intellectual property integrity.

# Opportunities
## Differentiation
The UI's distinctive Bento Box Grid style immediately sets it apart from typical analytics dashboards, offering a visually engaging and information-rich experience. The dedicated focus on "digital sports media" combined with direct, actionable AI insights creates a niche, high-value tool.
## Problem Solving Approach
The solution tackles the visibility gap by centralizing an AI-powered analysis for diverse digital content (URLs, text snippets). It shifts organizations from reactive content discovery to proactive authentication and anomaly detection, streamlining IP enforcement efforts.
## USP
ScanGuard's unique selling proposition lies in its combination of an intuitive, modern Bento Box UI with a powerful, specialized AI backend (Gemini) tailored specifically for digital sports media copyright detection, offering clear, actionable risk assessments.

# Features
- **Intuitive Input Interface:** A prominent, styled input field for URLs or content descriptions.
- **AI-Powered Analysis:** Server-side integration with Google's Gemini-2.5-Flash model for sophisticated content review.
- **Structured Results Display:** Clear presentation of risk level (HIGH/MEDIUM/LOW), confidence score, key red flags, and actionable recommendations.
- **Dynamic Bento Box UI:** Responsive grid layout with distinct, varying-sized cards for visual hierarchy and data organization.
- **Real-time Feedback:** Loading indicators and error handling ensure a smooth user experience.

# Technologies
- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Icons:** Lucide React
- **AI Integration:** Google Gemini-2.5-Flash

--- FILE: app/page.tsx ---
'use client';

import { useState, FormEvent } from 'react';
import { Search, Loader2, AlertCircle, ShieldCheck, TrendingUp, Flag, Lightbulb } from 'lucide-react';

interface ScanResult {
  riskLevel: string;
  confidence: string;
  redFlags: string[];
  recommendedAction: string;
}

export default function HomePage() {
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const parseGeminiResponse = (responseText: string): ScanResult | null => {
    // Robust parsing attempt. Gemini can be flexible, so we need to be too.
    const riskMatch = responseText.match(/Risk Level:\s*(HIGH|MEDIUM|LOW)/i);
    const confidenceMatch = responseText.match(/Confidence Percentage:\s*(\d+%?)/i);
    const redFlagsMatch = responseText.match(/Top 3 Red Flags Found:\s*([\s\S]*?)(?=Recommended Action:|$)/i);
    const actionMatch = responseText.match(/Recommended Action:\s*([\s\S]+)/i);

    if (!riskMatch || !confidenceMatch || !redFlagsMatch || !actionMatch) {
        console.warn("Failed to parse Gemini response fully:", responseText);
        // Fallback to simpler parsing or indicate partial failure
        return {
            riskLevel: riskMatch ? riskMatch[1].toUpperCase() : 'UNKNOWN',
            confidence: confidenceMatch ? confidenceMatch[1] : 'N/A',
            redFlags: redFlagsMatch ? redFlagsMatch[1].split(/[\n*-]+/).map(s => s.trim()).filter(Boolean) : [],
            recommendedAction: actionMatch ? actionMatch[1].trim() : 'Review the content manually for further details.'
        };
    }

    const redFlagsText = redFlagsMatch[1];
    const redFlags = redFlagsText
        .split('\n')
        .map(line => line.replace(/^-?\s*[\d.]*\s*/, '').trim()) // Remove leading numbers, bullets, whitespace
        .filter(line => line.length > 0)
        .slice(0, 3); // Ensure max 3 flags

    return {
      riskLevel: riskMatch[1].toUpperCase(),
      confidence: confidenceMatch[1],
      redFlags: redFlags,
      recommendedAction: actionMatch[1].trim(),
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a URL or content description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze content.');
      }

      const data = await response.json();
      const parsedResult = parseGeminiResponse(data.result);
      setResult(parsedResult);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-400';
      case 'MEDIUM':
        return 'text-orange-400';
      case 'LOW':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 text-white font-[var(--font-body)]">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-accent-gold)] font-[var(--font-heading)] mb-2">
          ScanGuard <span className="text-xl text-[var(--color-text-secondary)]">— Digital Asset Protection</span>
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          Protecting the Integrity of Digital Sports Media
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
        {/* Main Input Card */}
        <div className="bento-card col-span-full xl:col-span-2 bg-gradient-to-br from-[var(--color-card-light)] to-[var(--color-card-dark)]">
          <h2 className="bento-card-header flex items-center gap-2">
            <Search className="inline-block" /> Analyze Sports Media
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg
                         text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-accent-gold)]
                         outline-none resize-y min-h-[120px]"
              placeholder="Paste a URL or describe the sports content to analyze for misappropriation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              suppressHydrationWarning
            />
            <button
              type="submit"
              className="w-full py-3 px-6 bg-[var(--color-accent-gold)] text-[var(--color-background)]
                         font-bold rounded-lg hover:bg-opacity-90 transition-colors duration-200
                         flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              suppressHydrationWarning
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Analyzing...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} /> Scan for Misappropriation
                </>
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-800 bg-opacity-30 border border-red-600 rounded-lg flex items-center gap-2 text-red-300">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <>
            {/* Risk Level Card */}
            <div className={`bento-card bg-light col-span-full md:col-span-1 lg:col-span-1 xl:col-span-1 row-span-1 flex flex-col items-center justify-center text-center p-4`}>
                <ShieldCheck size={40} className={`mb-2 ${getRiskColor(result.riskLevel)}`} />
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Risk Level</h3>
                <p className={`text-5xl font-extrabold ${getRiskColor(result.riskLevel)} font-[var(--font-heading)] mt-2`}>
                    {result.riskLevel}
                </p>
            </div>

            {/* Confidence Score Card */}
            <div className="bento-card bg-light col-span-full md:col-span-1 lg:col-span-1 xl:col-span-1 row-span-1 flex flex-col items-center justify-center text-center p-4">
                <TrendingUp size={40} className="mb-2 text-blue-400" />
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Confidence Score</h3>
                <p className="text-5xl font-extrabold text-blue-400 font-[var(--font-heading)] mt-2">
                    {result.confidence}
                </p>
            </div>

            {/* Red Flags Card */}
            <div className="bento-card col-span-full xl:col-span-2 row-span-2">
              <h3 className="bento-card-header flex items-center gap-2">
                <Flag size={20} /> Top Red Flags
              </h3>
              {result.redFlags && result.redFlags.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)]">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start">
                        <span className="mr-2 text-[var(--color-accent-gold)]">•</span>
                        <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--color-text-secondary)]">No significant red flags detected.</p>
              )}
            </div>

            {/* Recommended Action Card */}
            <div className="bento-card col-span-full xl:col-span-2 row-span-1">
              <h3 className="bento-card-header flex items-center gap-2">
                <Lightbulb size={20} /> Recommended Action
              </h3>
              <p className="bento-card-content">
                {result.recommendedAction}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt: userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key not configured.' }, { status: 500 });
    }

    const systemPrompt = "You are a digital IP protection AI. Analyze the following content for signs of unauthorized sports media use. Provide: risk level (HIGH/MEDIUM/LOW), confidence percentage (e.g., 90%), top 3 red flags found (short, descriptive bullet points), and recommended action (specific and actionable). Be specific and actionable, and format your response clearly for parsing.";
    const fullPrompt = `${systemPrompt}\n\nUser Input: ${userInput}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt,
          }],
        }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: `Gemini API error: ${errorData.error?.message || response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const geminiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';

    return NextResponse.json({ result: geminiResponseText });
  } catch (error: any) {
    console.error('API route handler error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-background: #0D1117; /* Deep near-black navy */
  --color-card-dark: #1F2A37; /* Darker card background */
  --color-card-light: #283445; /* Lighter card background */
  --color-border: #3E4C5A; /* Subtle border for cards */
  --color-accent-gold: #FFBF00; /* Electric Gold */
  --color-text-primary: #E0E6ED;
  --color-text-secondary: #9CA3AF;

  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Space Mono', monospace;
}

body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  /* color: var(--color-accent-gold); -- Handled by Tailwind classes for specific elements */
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-card-light);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-border);
}

/* Basic card styling for reusability */
.bento-card {
  @apply relative p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-dark)]
         shadow-lg transition-all duration-300 ease-in-out;
}

.bento-card:hover {
  @apply border-[var(--color-accent-gold)] scale-[1.005] shadow-[0_0_20px_rgba(255,191,0,0.2)];
}

.bento-card.bg-light {
    background-color: var(--color-card-light);
}

.bento-card-header {
    @apply text-xl font-bold mb-4 text-[var(--color-accent-gold)];
    font-family: var(--font-heading);
}

.bento-card-content {
    @apply text-[var(--color-text-secondary)] leading-relaxed;
}
--- END ---