# Brief
ETA Shield is a minimalist Next.js application for real-time supply chain disruption analysis. It provides revised ETAs, impact assessments, and stakeholder communication drafts based on user-provided shipment and disruption details, powered by Gemini AI.

# Opportunities
## Differentiation
The tool differentiates itself by offering immediate, AI-driven insights into complex supply chain disruptions, moving beyond reactive reporting to proactive problem-solving. Its minimalist UI focuses entirely on critical information, reducing cognitive load and enhancing user experience in high-stakes situations.

## Problem Solving Approach
ETA Shield addresses the critical issue of reactive disruption management by employing Gemini AI to simulate scenarios and predict outcomes. It provides actionable intelligence, allowing users to make data-backed decisions on route adjustments and stakeholder communication before minor issues escalate into major crises.

## USP
Its unique selling proposition is the combination of **AI-powered predictive analytics for supply chain disruptions** with a **"maximum reduction" minimalist UI**, offering critical insights with unparalleled clarity and speed, specifically for ETA recalculation and impact assessment.

# Features
- **AI-Powered ETA Recalculation:** Instantly revises ETAs based on disruption type, severity, and cargo criticality.
- **Detailed Impact Assessment:** Provides breakdown of delay causes and downstream effects on operations.
- **Automated Stakeholder Communication:** Generates a concise, three-sentence email for timely updates.
- **Minimalist User Interface:** Clean, focused design emphasizing essential information and ease of use.
- **Responsive Design:** Ensures usability across various devices (desktop and mobile).

# Technologies
- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom CSS variables
- **Icons:** Lucide React
- **AI Integration:** Google Gemini-2.5-Flash via server-side API

--- FILE: app/page.tsx ---
'use client';

import { useState, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

interface Result {
  revisedEta: string;
  delayBreakdown: string[];
  downstreamImpact: string;
  stakeholderCommunication: string;
}

export default function HomePage() {
  const [originalEta, setOriginalEta] = useState('');
  const [disruptionType, setDisruptionType] = useState('');
  const [disruptionSeverity, setDisruptionSeverity] = useState('3');
  const [currentLocation, setCurrentLocation] = useState('');
  const [cargoCriticality, setCargoCriticality] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseGeminiResponse = (text: string): Result => {
    const revisedEtaMatch = text.match(/Revised ETA:\s*([^\n]+)/i);
    const delayBreakdownMatch = text.match(/Delay Breakdown:\s*([\s\S]+?)(?=(Downstream Impact:|Stakeholder Communication:|$))/i);
    const downstreamImpactMatch = text.match(/Downstream Impact:\s*([\s\S]+?)(?=(Stakeholder Communication:|$))/i);
    const stakeholderCommunicationMatch = text.match(/Stakeholder Communication:\s*([\s\S]+)/i);

    const revisedEta = revisedEtaMatch ? revisedEtaMatch[1].trim() : 'N/A';
    const delayBreakdown = delayBreakdownMatch
      ? delayBreakdownMatch[1]
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0 && line !== '-')
      : [];
    const downstreamImpact = downstreamImpactMatch ? downstreamImpactMatch[1].trim() : 'N/A';
    const stakeholderCommunication = stakeholderCommunicationMatch ? stakeholderCommunicationMatch[1].trim() : 'N/A';

    return {
      revisedEta,
      delayBreakdown,
      downstreamImpact,
      stakeholderCommunication,
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const prompt = `
    Original ETA: ${originalEta}
    Disruption Type: ${disruptionType}
    Disruption Severity: ${disruptionSeverity} (1-5)
    Current Location: ${currentLocation}
    Cargo Criticality: ${cargoCriticality}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        setResult(parseGeminiResponse(data.result));
      } else {
        setError('No result returned from AI.');
      }
    } catch (err: any) {
      console.error('Failed to fetch AI response:', err);
      setError(`Failed to get analysis: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container min-h-screen pt-16 pb-24 px-4 md:px-8 bg-background text-text font-inter">
      <header className="max-w-xl mx-auto mb-16 text-center">
        <h1 className="font-poppins text-5xl md:text-6xl font-extrabold leading-tight text-text-dark mb-4 tracking-tighter">
          ETA Shield
        </h1>
        <p className="text-xl md:text-2xl text-text leading-relaxed">
          Input your shipment details and disruption event — get a revised ETA and impact summary.
        </p>
      </header>

      <main className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8 mb-16">
          <div>
            <label htmlFor="originalEta" className="block text-sm font-medium text-text-dark mb-2">
              Original Estimated Time of Arrival
            </label>
            <input
              type="text"
              id="originalEta"
              value={originalEta}
              onChange={(e) => setOriginalEta(e.target.value)}
              placeholder="e.g., 2024-08-15 14:00 UTC"
              className="w-full pb-2 border-b border-border bg-transparent focus:border-accent-teal focus:outline-none text-text-dark text-lg"
              required
              suppressHydrationWarning
            />
          </div>

          <div>
            <label htmlFor="disruptionType" className="block text-sm font-medium text-text-dark mb-2">
              Disruption Type & Details
            </label>
            <textarea
              id="disruptionType"
              value={disruptionType}
              onChange={(e) => setDisruptionType(e.target.value)}
              placeholder="e.g., Severe weather in North Atlantic causing reroute; Port congestion in Shanghai due to labor strike"
              rows={3}
              className="w-full pb-2 border-b border-border bg-transparent focus:border-accent-teal focus:outline-none text-text-dark text-lg resize-none"
              required
            ></textarea>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
            <div className="flex-1">
              <label htmlFor="disruptionSeverity" className="block text-sm font-medium text-text-dark mb-2">
                Disruption Severity (1-5)
              </label>
              <select
                id="disruptionSeverity"
                value={disruptionSeverity}
                onChange={(e) => setDisruptionSeverity(e.target.value)}
                className="w-full pb-2 border-b border-border bg-transparent focus:border-accent-teal focus:outline-none text-text-dark text-lg"
                required
                suppressHydrationWarning
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <option key={s} value={s}>
                    {s} - {s === 1 && 'Minor'} {s === 2 && 'Moderate'} {s === 3 && 'Significant'} {s === 4 && 'Severe'} {s === 5 && 'Critical'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="currentLocation" className="block text-sm font-medium text-text-dark mb-2">
                Current Location
              </label>
              <input
                type="text"
                id="currentLocation"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="e.g., Mid-Atlantic; Port of Hamburg"
                className="w-full pb-2 border-b border-border bg-transparent focus:border-accent-teal focus:outline-none text-text-dark text-lg"
                required
                suppressHydrationWarning
              />
            </div>
          </div>

          <div>
            <label htmlFor="cargoCriticality" className="block text-sm font-medium text-text-dark mb-2">
              Cargo Criticality
            </label>
            <input
              type="text"
              id="cargoCriticality"
              value={cargoCriticality}
              onChange={(e) => setCargoCriticality(e.target.value)}
              placeholder="e.g., Perishable goods; High-value electronics; Standard industrial components"
              className="w-full pb-2 border-b border-border bg-transparent focus:border-accent-teal focus:outline-none text-text-dark text-lg"
              required
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            suppressHydrationWarning
            className="w-full py-4 text-lg font-semibold bg-accent-teal text-white rounded-sm transition-opacity duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-3" />}
            {isLoading ? 'Analyzing...' : 'Analyze Disruption'}
          </button>
        </form>

        {error && (
          <div className="max-w-xl mx-auto p-6 border border-accent-amber bg-red-50 text-red-700 text-lg">
            <h2 className="font-poppins text-2xl font-semibold mb-3 text-red-800">Error</h2>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <section className="max-w-xl mx-auto space-y-10">
            <div className="border-t border-border pt-10">
              <h2 className="font-poppins text-3xl font-semibold mb-4 text-accent-teal">Revised ETA</h2>
              <p className="text-xl leading-relaxed text-text-dark">{result.revisedEta}</p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-poppins text-3xl font-semibold mb-4 text-text-dark">Delay Breakdown</h2>
              <ul className="list-disc list-inside text-lg leading-relaxed text-text">
                {result.delayBreakdown.length > 0 ? (
                  result.delayBreakdown.map((item, index) => (
                    <li key={index} className="mb-2 last:mb-0">{item.replace(/^- /, '')}</li>
                  ))
                ) : (
                  <li>No specific delay breakdown provided.</li>
                )}
              </ul>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-poppins text-3xl font-semibold mb-4 text-text-dark">Downstream Impact</h2>
              <p className="text-lg leading-relaxed text-text">{result.downstreamImpact}</p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-poppins text-3xl font-semibold mb-4 text-text-dark">Stakeholder Communication</h2>
              <div className="p-6 bg-gray-50 border border-border text-text-dark whitespace-pre-wrap text-lg leading-relaxed">
                {result.stakeholderCommunication}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
  }

  try {
    const { prompt: userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const geminiSystemPrompt = `You are a logistics ETA recalculation AI. Given the following disruption details, provide a comprehensive analysis. Structure your response with clear headings for each section:

**Revised ETA:**
(Present Best Case, Likely, and Worst Case ETAs, e.g., 'Best Case: [Date/Time], Likely: [Date/Time], Worst Case: [Date/Time]')

**Delay Breakdown:**
(Use brief bullet points to detail primary causes of delay and their estimated contribution.)

**Downstream Impact:**
(Explain the cascading effects on dependent shipments, inventory levels, or subsequent operational stages.)

**Stakeholder Communication:**
(Draft a concise email for stakeholders. It should be exactly three sentences: 1. State what happened. 2. Provide the new estimated timeline. 3. Detail the immediate actions being taken. Conclude with 'Sincerely, The ETA Shield Team.')

---
User Input:
${userInput}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiSystemPrompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: 'Failed to get response from AI', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const geminiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ result: geminiResponseText });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap');

:root {
  --background: #fafafa; /* Off-white */
  --text-dark: #1a1a1a; /* Near-black */
  --text: #333333; /* Darker grey for body */
  --border: #e0e0e0; /* Light grey for hairline borders */
  --accent-teal: #007B8C; /* Industrial Teal */
  --accent-amber: #FFC107; /* Amber for highlight */
}

@layer base {
  html {
    @apply antialiased;
    font-family: 'Inter', sans-serif;
    color: var(--text);
    background-color: var(--background);
  }

  body {
    @apply text-base md:text-lg leading-relaxed;
    color: var(--text);
    background-color: var(--background);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    color: var(--text-dark);
  }

  input[type="text"],
  input[type="number"],
  textarea,
  select {
    @apply border-b-2 border-border focus:border-accent-teal outline-none transition-colors duration-200 bg-transparent py-2 px-0 text-text-dark text-lg;
    border-radius: 0;
  }

  input[type="text"]:focus,
  input[type="number"]:focus,
  textarea:focus,
  select:focus {
    box-shadow: none;
  }

  /* Remove default styling for select on Webkit */
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231a1a1a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.6-6.4H18.9c-5%200-9.4%202.4-13.6%206.4-4.2%204-6.4%209.4-6.4%2015.6s2.4%2011.6%206.4%2015.6l128%20127.9c4.2%204.2%209.6%206.4%2015.6%206.4s11.6-2.4%2015.6-6.4L287%20100.6c4.2-4.2%206.4-9.6%206.4-15.6S291.2%2073.4%20287%2069.4z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 0.5rem center; /* Adjust position for minimalist look */
    background-size: 0.7em auto;
    padding-right: 2.5rem; /* Make space for the custom arrow */
  }

  /* Define custom Tailwind colors */
  .bg-background { background-color: var(--background); }
  .text-text-dark { color: var(--text-dark); }
  .text-text { color: var(--text); }
  .border-border { border-color: var(--border); }
  .bg-accent-teal { background-color: var(--accent-teal); }
  .focus\\:border-accent-teal:focus { border-color: var(--accent-teal); }
  .text-accent-teal { color: var(--accent-teal); }
  .border-accent-amber { border-color: var(--accent-amber); }
}
--- END ---