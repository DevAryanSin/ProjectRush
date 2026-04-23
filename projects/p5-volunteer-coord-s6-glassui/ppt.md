# Brief
UrgencyRank is a data-driven volunteer coordination platform for social impact. It ingests scattered community needs and available resources (volunteers, budget, time) to generate a prioritized ranking of needs by urgency and resource allocation recommendations, empowering NGOs with actionable insights for social impact.

# Opportunities
## Differentiation
Unlike traditional methods of manual prioritization, UrgencyRank leverages AI to dynamically assess and rank community needs based on multiple input factors, providing a data-driven, objective prioritization.

## Problem Solving Approach
The system collects qualitative and quantitative data on community needs and available resources. It then utilizes the Gemini API to reason across these inputs, simulating a strategic planning process to generate a prioritized, actionable deployment strategy.

## USP
AI-powered, dynamic urgency ranking and resource allocation for maximum social impact, delivered through a premium, intuitive Glass UI.

# Features
- Input multiple community needs with associated resource constraints (volunteer count, budget, timeframe).
- AI-driven prioritization of needs with urgency scores.
- Recommended volunteer and budget allocation per need.
- Comprehensive 1-week deployment strategy.
- Professional, high-fidelity Glass UI with dark theme and vibrant accent colors.
- Real-time loading and error state handling.
- Responsive design for desktop and mobile.

# Technologies
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS, custom CSS variables
- Icons: Lucide React
- AI Integration: Gemini API (`gemini-2.5-flash`)
- Deployment: Serverless functions (Next.js API Routes)

--- FILE: app/page.tsx ---
"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const Page: React.FC = () => {
  const [needs, setNeeds] = useState([{ id: 1, text: '' }]);
  const [volunteerCount, setVolunteerCount] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);
  const [timeframe, setTimeframe] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const addNeed = () => {
    setNeeds([...needs, { id: needs.length + 1, text: '' }]);
  };

  const handleNeedChange = (id: number, text: string) => {
    setNeeds(needs.map(need => (need.id === id ? { ...need, text } : need)));
  };

  const removeNeed = (id: number) => {
    setNeeds(needs.filter(need => need.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setError(null);

    const formattedNeeds = needs.map(need => need.text).filter(text => text.trim() !== '');
    if (formattedNeeds.length === 0) {
      setError("Please add at least one community need.");
      setLoading(false);
      return;
    }

    const prompt = `Community Needs:\n${formattedNeeds.join('\n')}\n\nAvailable Volunteers: ${volunteerCount}\nAvailable Budget: $${budget}\nTimeframe: ${timeframe}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setResult(''); // Clear previous results on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-8">
      <Head>
        <title>UrgencyRank</title>
        <meta name="description" content="Smart Resource Allocation for Volunteer Coordination" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-cyan-400">UrgencyRank</h1>
        <nav>
          {/* Placeholder for future navigation */}
        </nav>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-card p-6">
          <h2 className="text-2xl font-semibold mb-4 text-violet-400">Input Community Needs</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Community Needs List</label>
              {needs.map((need) => (
                <div key={need.id} className="flex items-center mb-2 space-x-2">
                  <input
                    type="text"
                    className="glass-input flex-grow"
                    placeholder="Describe a community need (e.g., Food insecurity in Sector A)"
                    value={need.text}
                    onChange={(e) => handleNeedChange(need.id, e.target.value)}
                    required
                  />
                  {needs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNeed(need.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                      aria-label="Remove need"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l3 18h12l3-18M9 3v3h6V3m0 0h-2M6 18l.75-9M10.5 18l.75-9M14.25 18l.75-9M18 18l.75-9"></path></svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addNeed}
                className="mt-2 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
                <span>Add Another Need</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="volunteerCount" className="block mb-2 text-sm font-medium text-gray-300">Available Volunteers</label>
                <input
                  type="number"
                  id="volunteerCount"
                  className="glass-input"
                  value={volunteerCount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setVolunteerCount(Number(e.target.value))}
                  min="0"
                  suppressHydrationWarning // React 19 hydration fix for dynamic disabled
                />
              </div>
              <div>
                <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-300">Available Budget ($)</label>
                <input
                  type="number"
                  id="budget"
                  className="glass-input"
                  value={budget}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setBudget(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  suppressHydrationWarning // React 19 hydration fix for dynamic disabled
                />
              </div>
              <div>
                <label htmlFor="timeframe" className="block mb-2 text-sm font-medium text-gray-300">Timeframe</label>
                <input
                  type="text"
                  id="timeframe"
                  className="glass-input"
                  placeholder="e.g., 1 week, 2 months"
                  value={timeframe}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTimeframe(e.target.value)}
                  suppressHydrationWarning // React 19 hydration fix for dynamic disabled
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full glass-button glow-effect"
              disabled={loading || needs.filter(n => n.text.trim() !== '').length === 0}
              suppressHydrationWarning // React 19 hydration fix for dynamic disabled
            >
              {loading ? 'Analyzing...' : 'Analyze Needs'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        <section className="glass-card p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Analysis Results</h2>
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400 border-b-4 border-cyan-400"></div>
            </div>
          )}
          {!loading && result && (
            <div className="prose max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: formatResult(result) }} />
          )}
          {!loading && !result && !error && (
            <div className="text-center text-gray-500 py-10">
              Enter your community needs and resources above to see the analysis.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// Helper function to format Gemini's raw text output into HTML with hierarchy
const formatResult = (rawResult: string): string => {
  let html = '';
  let currentSection = '';
  const lines = rawResult.split('\n');

  const sectionTitles = ["Ranked Priority List", "Reasoning", "Recommended Volunteer Allocation", "Budget Allocation Suggestion", "Deployment Strategy"];
  const sectionRegex = new RegExp(`^(${sectionTitles.join('|')}):?`, 'i');

  for (const line of lines) {
    const match = line.match(sectionRegex);
    if (match) {
      const sectionTitle = match[1];
      // Close previous section if any
      if (currentSection) {
        html += '</div>';
      }
      // Start new section
      html += `<div class="mb-6"><h3 class="text-xl font-semibold text-cyan-400 mb-3">${sectionTitle}</h3><div class="ml-4 space-y-2">`;
      currentSection = sectionTitle;
      if (sectionTitle.toLowerCase().includes("ranked priority list")) {
          html += '<ul class="list-decimal list-inside space-y-1">';
      } else if (sectionTitle.toLowerCase().includes("deployment strategy")) {
          html += '<div class="space-y-3">';
      }
    } else if (currentSection) {
      if (currentSection.toLowerCase().includes("ranked priority list")) {
          if (line.trim()) html += `<li>${line.trim()}</li>`;
      } else if (currentSection.toLowerCase().includes("deployment strategy")) {
          if (line.trim()) html += `<p class="text-sm text-gray-400">${line.trim()}</p>`;
      }
       else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        html += `<p>${line.trim()}</p>`;
      }
      else if (line.trim() && !line.match(/^\d+$/)) { // Avoid treating numbers as separate paragraphs if they are part of a list item
        html += `<p>${line.trim()}</p>`;
      }
    }
  }

  // Close the last section
  if (currentSection) {
    if (currentSection.toLowerCase().includes("ranked priority list")) {
        html += '</ul>';
    }
    if (currentSection.toLowerCase().includes("deployment strategy")) {
        html += '</div>';
    }
    html += '</div>';
  }
  return html;
};


export default Page;
---
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Use a specific model
const MODEL_ID = 'gemini-2.5-flash';

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return NextResponse.json({ error: 'Internal server error: API key not configured.' }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 });
    }

    // System prompt for the AI
    const systemPrompt = `You are a resource allocation AI for NGO operations. Given these community needs and available resources, produce: ranked priority list (1 = most urgent) with urgency score (1-10) for each, reasoning for each ranking, recommended volunteer allocation per need (hours and headcount), budget allocation suggestion (%), and a 1-week deployment strategy. Justify trade-offs explicitly.
    `;

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          // You can add generationConfig here if needed, e.g., for temperature
          // generationConfig: {
          //   temperature: 0.7,
          //   maxOutputTokens: 800,
          // },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Gemini API Error:', errorBody);
      throw new Error(errorBody.error?.message || `Gemini API returned status ${response.status}`);
    }

    const data = await response.json();

    // Extract the content from the response
    // The structure can vary, so check the actual response format from Gemini
    let geminiResponseText = '';
    if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      geminiResponseText = data.candidates[0].content.parts.map((part: any) => part.text).join('');
    } else {
      console.warn('Unexpected Gemini API response format:', data);
      geminiResponseText = 'Could not parse Gemini response. Raw data:\n' + JSON.stringify(data, null, 2);
    }


    return NextResponse.json({ result: geminiResponseText });

  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
---
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');

/* Custom CSS Variables */
:root {
  --background-dark: #0d1117;
  --card-background: rgba(255, 255, 255, 0.06);
  --card-border: rgba(255, 255, 255, 0.1);
  --accent-primary: #00f2fe; /* Electric blue/cyan */
  --accent-secondary: #8b5cf6; /* Violet */
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --glow-primary: rgba(0, 242, 254, 0.3);
  --glow-secondary: rgba(139, 92, 246, 0.3);
}

body {
  background-color: var(--background-dark);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif; /* Modern technical font */
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: var(--text-primary);
}

h1 {
  font-size: 2.5rem; /* 40px */
  line-height: 1.2;
}

h2 {
  font-size: 2rem; /* 32px */
  line-height: 1.2;
}

h3 {
  font-size: 1.5rem; /* 24px */
  line-height: 1.3;
}

p, li, span {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: var(--text-secondary);
}

strong {
  font-weight: 700;
  color: var(--text-primary);
}

/* Glass Card Styling */
.glass-card {
  background: var(--card-background);
  border: 1px solid var(--card-border);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); /* Safari compatibility */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.glass-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Glass Input Fields */
.glass-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}

.glass-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--glow-primary);
}

.glass-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.8;
}

/* Glass Buttons */
.glass-button {
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 12px 20px;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.glass-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

/* Animated Gradient Border / Glow Effect for Focus/Hover */
.glow-effect {
  position: relative;
  transition: all 0.3s ease;
}

.glow-effect::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-primary));
  background-size: 200% 200%;
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.glow-effect:hover::before {
  opacity: 1;
  animation: gradient-border 1.5s ease infinite;
}

.glow-effect:focus::before {
  opacity: 1;
  animation: gradient-border 1.5s ease infinite;
}

/* Disable button state styling */
.glass-button:disabled {
  background: rgba(17, 24, 39, 0.5); /* Darker, less vibrant when disabled */
  border-color: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.glass-button:disabled::before {
  display: none;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  h1 {
    font-size: 2rem; /* 32px */
  }
  h2 {
    font-size: 1.75rem; /* 28px */
  }
  .glass-card {
    padding: 20px;
  }
}

/* Animations */
@keyframes gradient-border {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Prose styling for formatted results */
.prose {
  color: var(--text-secondary);
}
.prose h3 {
  color: var(--accent-primary);
  font-weight: 700;
  font-size: 1.3rem; /* 20px */
  margin-bottom: 0.8rem;
}
.prose ul {
  list-style: disc inside;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}
.prose li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}
.prose p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}
.prose a {
  color: var(--accent-primary);
  text-decoration: underline;
}
.prose a:hover {
  color: var(--accent-secondary);
}

--- END ---