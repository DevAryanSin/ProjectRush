# Brief
ImpactPulse is a Next.js 16 application that empowers social groups and NGOs by streamlining volunteer activity data collection and analysis. It simplifies the process of logging volunteer efforts and, through Gemini AI, generates comprehensive impact reports. This transforms raw data into clear narratives, highlighting community needs and showcasing organizational achievements to stakeholders.

# Opportunities
## Differentiation
Leverages Gemini AI for sophisticated data transformation into human-centered impact narratives, going beyond simple data aggregation. Offers a strictly minimalist UI focused on clarity and ease of use, reducing user cognitive load.

## Problem Solving Approach
The solution tackles the problem of scattered social impact data by providing a centralized input mechanism. It then uses AI to synthesize this data into digestible, compelling reports that inform decision-making and donor engagement.

## USP
Smart Resource Allocation: Converts raw volunteer logs into strategic insights, enabling better understanding of community needs and more efficient volunteer deployment.
AI-Powered Narrative Generation: Creates human-centered impact stories, making data accessible and persuasive for diverse stakeholders.
Minimalist UI: Ensures ease of data entry and clear presentation of results, adhering to a strict design philosophy for maximum focus.

# Features
- Intuitive data input form for volunteer activities.
- AI-generated impact summary reports including narratives, key metrics, and efficiency scores.
- Loading state for analysis requests.
- Clean, typographic display of generated reports.
- Responsive, minimalist user interface.
- Error handling for API calls and data processing.

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini 2.5-flash API
- Lucide-react for icons (minimal usage)

--- FILE: app/page.tsx ---
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

const ACCENT_COLOR = '#38a169'; // Warm green

export default function Home() {
  const [volunteerHours, setVolunteerHours] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [numVolunteers, setNumVolunteers] = useState('');
  const [communityMembersServed, setCommunityMembersServed] = useState('');
  const [geographicArea, setGeographicArea] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [impactReport, setImpactReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setImpactReport(null);

    const userInput = `Volunteer Hours: ${volunteerHours}\nTasks Completed: ${tasksCompleted}\nNumber of Volunteers: ${numVolunteers}\nCommunity Members Served: ${communityMembersServed}\nGeographic Area: ${geographicArea}\nTime Period: ${timePeriod}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const data = await response.json();
      setImpactReport(data.result);
    } catch (err: any) {
      setError(err.message);
      console.error('Error generating report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sansPro flex flex-col items-center p-6 md:p-12">
      <Head>
        <title>ImpactPulse</title>
        <meta name="description" content="Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">ImpactPulse</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-12">
          Input completed volunteer activity — generate a compelling impact summary report.
        </p>

        <section className="mb-16 p-8 border-t border-gray-200">
          <h2 className="text-3xl font-semibold mb-6 text-left">Log Your Impact</h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="flex flex-col space-y-2">
              <label htmlFor="volunteerHours" className="text-sm font-medium text-gray-700">Volunteer Hours Logged</label>
              <input
                id="volunteerHours"
                type="text"
                value={volunteerHours}
                onChange={(e) => setVolunteerHours(e.target.value)}
                placeholder="e.g., 250"
                className="p-3 border-b border-gray-300 focus:border-ACCENT_COLOR outline-none placeholder-gray-400"
                disabled={isLoading}
                suppressHydrationWarning={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="tasksCompleted" className="text-sm font-medium text-gray-700">Tasks Completed</label>
              <input
                id="tasksCompleted"
                type="text"
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(e.target.value)}
                placeholder="e.g., 50"
                className="p-3 border-b border-gray-300 focus:border-ACCENT_COLOR outline-none placeholder-gray-400"
                disabled={isLoading}
                suppressHydrationWarning={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="numVolunteers" className="text-sm font-medium text-gray-700">Number of Volunteers</label>
              <input
                id="numVolunteers"
                type="text"
                value={numVolunteers}
                onChange={(e) => setNumVolunteers(e.target.value)}
                placeholder="e.g., 30"
                className="p-3 border-b border-gray-300 focus:border-ACCENT_COLOR outline-none placeholder-gray-400"
                disabled={isLoading}
                suppressHydrationWarning={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="communityMembersServed" className="text-sm font-medium text-gray-700">Community Members Served</label>
              <input
                id="communityMembersServed"
                type="text"
                value={communityMembersServed}
                onChange={(e) => setCommunityMembersServed(e.target.value)}
                placeholder="e.g., 150"
                className="p-3 border-b border-gray-300 focus:border-ACCENT_COLOR outline-none placeholder-gray-400"
                disabled={isLoading}
                suppressHydrationWarning={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="geographicArea" className="text-sm font-medium text-gray-700">Geographic Area</label>
              <input
                id="geographicArea"
                type="text"
                value={geographicArea}
                onChange={(e) => setGeographicArea(e.target.value)}
                placeholder="e.g., Downtown Eastside"
                className="p-3 border-b border-gray-300 focus:border-ACCENT_COLOR outline-none placeholder-gray-400"
                disabled={isLoading}
                suppressHydrationWarning={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="timePeriod" className="text-sm font-medium text-gray-700">Time Period</label>
              <input
                id="timePeriod"
                type="text"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                placeholder="e.g., Last Quarter"
                className="p-3 border-b border-gray-300 focus:border-ACCENT_COLOR outline-none placeholder-gray-400"
                disabled={isLoading}
                suppressHydrationWarning={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 font-semibold rounded-lg transition-colors duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-ACCENT_COLOR hover:bg-green-600 text-white'
              }`}
              disabled={isLoading}
              suppressHydrationWarning={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Generate Impact Report'}
            </button>
          </form>
        </section>

        {error && (
          <section className="mb-16 p-8 border-t border-gray-200 text-left">
            <h2 className="text-3xl font-semibold mb-6 text-red-600">Error</h2>
            <p className="text-gray-700">{error}</p>
          </section>
        )}

        {impactReport && (
          <section className="mb-16 p-8 border-t border-gray-200 text-left">
            <h2 className="text-3xl font-semibold mb-6">Impact Report</h2>
            <div className="space-y-6 text-gray-800" dangerouslySetInnerHTML={{ __html: formatReport(impactReport) }} />
          </section>
        )}
      </main>
    </div>
  );
}

function formatReport(report: string): string {
  const lines = report.split('\n');
  let formattedHtml = '';
  let currentSection: string | null = null;

  lines.forEach((line) => {
    if (line.trim() === '') return;

    if (line.startsWith('Headline Impact Metric:')) {
      currentSection = 'headline';
      formattedHtml += `<h3 class="text-2xl font-bold mb-3 text-ACCENT_COLOR">${line}</h3>`;
    } else if (line.startsWith('Narrative Summary:')) {
      currentSection = 'narrative';
      formattedHtml += `<h3 class="text-2xl font-bold mb-3">Narrative Summary</h3>`;
      formattedHtml += `<p class="text-lg mb-4 leading-relaxed">${line.replace('Narrative Summary:', '').trim()}</p>`;
    } else if (line.startsWith('Key Metrics:')) {
      currentSection = 'metrics';
      formattedHtml += `<h3 class="text-2xl font-bold mb-3">Key Metrics</h3>`;
      formattedHtml += `<ul class="list-disc pl-6 space-y-2">`;
    } else if (line.startsWith('Volunteer Efficiency Score:')) {
      currentSection = 'efficiency';
      formattedHtml += `<h3 class="text-2xl font-bold mb-3">Efficiency Analysis</h3>`;
      formattedHtml += `<p class="text-lg mb-4 leading-relaxed">${line.replace('Volunteer Efficiency Score:', '').trim()}</p>`;
    } else if (line.startsWith('Stakeholder Summary:')) {
      currentSection = 'stakeholder';
      formattedHtml += `<h3 class="text-2xl font-bold mb-3">Stakeholder Ready Summary</h3>`;
      formattedHtml += `<p class="text-lg italic mb-4 leading-relaxed">" ${line.replace('Stakeholder Summary:', '').trim()} "</p>`;
    } else {
      if (currentSection === 'metrics' && line.trim().startsWith('-')) {
        formattedHtml += `<li class="text-lg mb-2">${line.replace('-', '').trim()}</li>`;
      } else if (currentSection === 'metrics' && !line.trim().startsWith('-')) {
        formattedHtml += `</ul>`; // Close list if next line isn't a list item
        currentSection = null;
        formattedHtml += `<p class="text-lg mb-4 leading-relaxed">${line.trim()}</p>`;
      } else if (currentSection === 'narrative') {
        formattedHtml += `<p class="text-lg mb-4 leading-relaxed">${line.trim()}</p>`;
      } else if (currentSection === 'efficiency') {
         formattedHtml += `<p class="text-lg mb-4 leading-relaxed">${line.trim()}</p>`;
      } else if (currentSection === 'stakeholder') {
        formattedHtml += `<p class="text-lg italic mb-4 leading-relaxed">" ${line.trim()} "</p>`;
      }
    }
  });

  if (currentSection === 'metrics') {
    formattedHtml += `</ul>`; // Ensure list is closed if it ends the report
  }

  // Add fallback for any unparsed sections
  if (!formattedHtml.includes('<h3>')) {
    formattedHtml = `<p class="text-lg mb-4 leading-relaxed">${report.replace(/\n/g, '<br/>')}</p>`;
  }

  return formattedHtml;
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key not found.' }, { status: 500 });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const systemPrompt = `You are an NGO impact reporting AI. Transform this volunteer activity data into a compelling impact report. Include: headline impact metric, narrative summary (3 sentences), key metrics with context (e.g., '120 meals delivered = 40 families fed for 3 days'), volunteer efficiency score, and a 1-sentence stakeholder quote-ready summary. Make numbers feel human and meaningful.`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Input:\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(errorData.error?.message || `Gemini API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error('Unexpected Gemini API response format:', data);
      throw new Error('Unexpected response from AI service.');
    }

    const geminiResponseText = data.candidates[0].content.parts
      .map((part: any) => part.text)
      .join('');

    return NextResponse.json({ result: geminiResponseText });

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Merriweather+Sans:wght@400;700&display=swap'); /* Premium, distinctive fonts */

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 250, 250, 250; /* Off-white */
  --background-end-rgb: 245, 245, 245; /* Very light grey */
  --accent-color: #38a169; /* Warm green - replaced placeholder */
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
    to bottom,
    var(--background-start-rgb),
    var(--background-end-rgb)
  );
  font-family: 'Inter', sans-serif; /* Primary font */
  line-height: 1.7;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Merriweather Sans', sans-serif; /* Distinctive heading font */
  font-weight: 700;
  line-height: 1.2;
}

h1 {
  font-size: 3.5rem; /* Large hero text */
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.5rem;
}

p, li, input::placeholder, label {
  font-size: 1rem;
  font-weight: 400;
}

input {
  transition: border-color 0.2s ease-in-out;
}

input:focus {
  border-color: var(--accent-color) !important;
}

.text-ACCENT_COLOR {
  color: var(--accent-color);
}

.bg-ACCENT_COLOR {
  background-color: var(--accent-color);
}

.hover\:bg-ACCENT_COLOR:hover {
  background-color: var(--accent-color);
}

.hover\:bg-green-600:hover {
  background-color: #2f855a; /* Tailwind's green-600 equivalent */
}

/* Fine hairline borders */
section, form div {
  border-top: 1px solid #e2e8f0; /* Light grey border */
  padding-top: 2rem; /* Generous padding */
  margin-top: 2rem; /* Generous margin */
}

section:first-of-type, form div:first-of-type {
  border-top: none;
  padding-top: 0;
  margin-top: 0;
}

/* Specific adjustments for form inputs */
input[type="text"] {
  background: transparent;
  border-bottom: 1px solid #d1d5db; /* Light grey bottom border */
  padding-left: 0.75rem; /* Corresponds to p-3 */
  padding-right: 0.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  color: inherit;
}

input::placeholder {
  color: #9ca3af; /* Placeholder color */
}

button {
  border-radius: 0.5rem; /* Based on Tailwind's md:rounded-lg */
  font-weight: 600;
}

/* Minimalist specific styling overrides */
.font-sansPro {
    font-family: 'Inter', sans-serif;
}

.text-lg {
    font-size: 1.125rem; /* 18px */
    line-height: 1.75rem; /* 28px */
}

.leading-relaxed {
    line-height: 1.625; /* Tailwind's leading-relaxed */
}

.italic {
    font-style: italic;
}
--- END ---