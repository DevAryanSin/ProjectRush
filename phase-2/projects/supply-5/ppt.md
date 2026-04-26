# Brief
ContractClause is a Next.js 16 MVP application that empowers users to generate custom contract clauses to mitigate supply chain disruption risks. Leveraging a Gemini AI backend, it offers pre-drafted, legally-structured clauses tailored to specific scenarios, roles, jurisdictions, and risk tolerances, ensuring business continuity and legal protection.

# Opportunities
## Differentiation
The application differentiates itself by combining a highly refined, editorial UI aesthetic with precise, AI-generated legal drafting for supply chain disruptions, a niche but critical area. Its focus on pre-emptive clause generation offers a significant advantage over reactive legal solutions.

## Problem Solving Approach
The solution addresses the problem of supply chain volatility by providing a tool that generates proactive contractual safeguards. It translates complex disruption scenarios into clear, actionable contract language, enabling businesses to define protections before disruptions occur.

## USP
AI-powered generation of bespoke, legally structured contract clauses for supply chain disruptions, presented within a professional, trustworthy editorial UI, offering immediate risk mitigation.

# Features
- **AI-Driven Clause Generation:** Dynamically drafts Force Majeure, SLA, Penalty, and Dispute Resolution clauses based on user input.
- **Paper/Editorial UI:** Implements a sophisticated newspaper/magazine layout with serif fonts, clear hierarchy, and a cream/near-black color scheme for a trustworthy feel.
- **User-Friendly Input Form:** Collects essential details like contract type, disruption scenario, role, jurisdiction, and risk tolerance.
- **Loading & Error Handling:** Provides distinct visual states for submission loading and displays user-friendly error messages.
- **Responsive Design:** Ensures full functionality and aesthetic integrity across mobile and desktop devices.
- **Next.js 16 App Router:** Built with modern Next.js features for performance and maintainability.

# Technologies
- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Icons:** Lucide React
- **Backend Integration:** Gemini API (via Next.js API Route)
- **Deployment Domain:** `contractclause-sc` (for Gemini API calls)

--- FILE: app/page.tsx ---
'use client';

import { useState, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

const Page = () => {
  const [contractType, setContractType] = useState('');
  const [disruptionScenario, setDisruptionScenario] = useState('');
  const [yourRole, setYourRole] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('');
  const [generatedClauses, setGeneratedClauses] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedClauses(null);

    const prompt = `
Contract Type: ${contractType}
Disruption Scenario: ${disruptionScenario}
Your Role: ${yourRole}
Jurisdiction: ${jurisdiction}
Risk Tolerance: ${riskTolerance}
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
      setGeneratedClauses(data.result);
    } catch (err: any) {
      console.error('Error generating clauses:', err);
      setError('Failed to generate clauses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 font-serif text-[#1a1a1a]">
      <header className="mb-4">
        <h1 className="text-6xl font-bold leading-tight text-[#1a1a1a] mb-2">ContractClause</h1>
        <p className="text-xl font-serif italic text-gray-700 mb-6">
          Generate protective contract clauses for supply chain disruption scenarios
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h2 className="text-3xl font-serif font-bold mb-4 border-b-2 pb-2 border-[#1a1a1a]">
            Scenario Analysis
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="contractType" className="block text-lg font-serif mb-2">
                Contract Type
              </label>
              <select
                id="contractType"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                required
                className="w-full p-3 border border-[#1a1a1a] bg-[#f5f0e8] focus:outline-none focus:ring-2 focus:ring-accentColor"
              >
                <option value="">Select Contract Type</option>
                <option value="logistics_agreement">Logistics Agreement</option>
                <option value="supply_agreement">Supply Agreement</option>
                <option value="shipping_contract">Shipping Contract</option>
              </select>
            </div>

            <div>
              <label htmlFor="disruptionScenario" className="block text-lg font-serif mb-2">
                Disruption Scenario to Protect Against
              </label>
              <textarea
                id="disruptionScenario"
                value={disruptionScenario}
                onChange={(e) => setDisruptionScenario(e.target.value)}
                rows={3}
                required
                className="w-full p-3 border border-[#1a1a1a] bg-[#f5f0e8] focus:outline-none focus:ring-2 focus:ring-accentColor"
                placeholder="e.g., Pandemic-related port closures, severe weather impacting key shipping lanes, geopolitical unrest affecting transit routes"
              ></textarea>
            </div>

            <div>
              <label htmlFor="yourRole" className="block text-lg font-serif mb-2">
                Your Role
              </label>
              <select
                id="yourRole"
                value={yourRole}
                onChange={(e) => setYourRole(e.target.value)}
                required
                className="w-full p-3 border border-[#1a1a1a] bg-[#f5f0e8] focus:outline-none focus:ring-2 focus:ring-accentColor"
              >
                <option value="">Select Your Role</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            <div>
              <label htmlFor="jurisdiction" className="block text-lg font-serif mb-2">
                Jurisdiction
              </label>
              <input
                type="text"
                id="jurisdiction"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                required
                className="w-full p-3 border border-[#1a1a1a] bg-[#f5f0e8] focus:outline-none focus:ring-2 focus:ring-accentColor"
                placeholder="e.g., New York, England and Wales, Singapore"
              />
            </div>

            <div>
              <label htmlFor="riskTolerance" className="block text-lg font-serif mb-2">
                Risk Tolerance
              </label>
              <select
                id="riskTolerance"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
                required
                className="w-full p-3 border border-[#1a1a1a] bg-[#f5f0e8] focus:outline-none focus:ring-2 focus:ring-accentColor"
              >
                <option value="">Select Risk Tolerance</option>
                <option value="low">Low (prioritize stability, higher buffer)</option>
                <option value="medium">Medium (balanced approach)</option>
                <option value="high">High (prioritize flexibility, accept more risk)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-accentColor text-[#f5f0e8] font-bold font-serif uppercase disabled:opacity-50 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accentColor"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
                </span>
              ) : (
                'Generate Clauses'
              )}
            </button>
          </form>
        </section>

        <section className="bg-[#f5f0e8] p-6 border border-[#1a1a1a]">
          <h2 className="text-3xl font-serif font-bold mb-4 border-b-2 pb-2 border-[#1a1a1a]">
            Results
          </h2>
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md mb-4">
              {error}
            </div>
          )}
          {generatedClauses ? (
            <div dangerouslySetInnerHTML={{ __html: generatedClauses }} />
          ) : (
            <p className="text-gray-600 italic">
              Submit your scenario details to generate contract clauses.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Page;
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not configured.');
    return NextResponse.json(
      { error: 'Internal Server Error: API key not configured.' },
      { status: 500 }
    );
  }

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const systemPrompt = `You are a supply chain contract AI. Draft 4 protective contract clauses for this disruption scenario: (1) Force Majeure definition and triggers, (2) SLA modification rights, (3) Liability and penalty caps, (4) Dispute resolution mechanism. Use standard commercial contract language. Make each clause ready to insert into a contract.
--- USER INPUT ---
`;

  const fullPrompt = systemPrompt + prompt;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const geminiResult = data.candidates[0].content.parts[0].text;

      // Basic formatting for readability, mimicking editorial style
      const formattedResult = geminiResult
        .split('\n\n')
        .map((section: string) => {
          if (section.trim().startsWith('(1)')) {
            return `<h3 class="text-xl font-bold font-serif mb-2 text-[#1a1a1a]">1. Force Majeure</h3><p class="mb-4">${section.replace('(1)', '').trim()}</p>`;
          } else if (section.trim().startsWith('(2)')) {
            return `<h3 class="text-xl font-bold font-serif mb-2 text-[#1a1a1a]">2. SLA Modification</h3><p class="mb-4">${section.replace('(2)', '').trim()}</p>`;
          } else if (section.trim().startsWith('(3)')) {
            return `<h3 class="text-xl font-bold font-serif mb-2 text-[#1a1a1a]">3. Liability and Penalties</h3><p class="mb-4">${section.replace('(3)', '').trim()}</p>`;
          } else if (section.trim().startsWith('(4)')) {
            return `<h3 class="text-xl font-bold font-serif mb-2 text-[#1a1a1a]">4. Dispute Resolution</h3><p class="mb-4">${section.replace('(4)', '').trim()}</p>`;
          } else if (section.trim()) {
             // Check for pull quote like sections
            if (section.trim().length > 80 && section.trim().includes(' ')) { // Heuristic for a longer quote
                 return `<p class="italic text-lg text-gray-700 my-4 text-center">"${section.trim()}"</p>`;
            }
            return `<p class="mb-3">${section.trim()}</p>`;
          }
          return '';
        })
        .join('');

      return NextResponse.json({ result: formattedResult });
    } else {
      console.error('Unexpected response structure from Gemini:', data);
      throw new Error('Unexpected response from AI model.');
    }
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: `Failed to generate content: ${error.message}` },
      { status: 500 }
    );
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap');

:root {
  --background-color: #f5f0e8; /* Soft Cream/Off-white */
  --text-primary: #1a1a1a;   /* Near Black */
  --text-secondary: #4a4a4a; /* Dark Grey */
  --accent-color: #2c3e50;   /* Dark Navy Blue */
  --border-color: #1a1a1a;
}

body {
  background-color: var(--background-color);
  color: var(--text-primary);
  font-family: 'Lora', serif;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
  color: var(--text-primary);
}

h1 {
  font-size: 4rem; /* Massive headline */
  font-weight: 700;
  line-height: 1.1;
}

h2 {
  font-size: 2.5rem; /* Subhead */
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

h3 {
  font-size: 1.5rem; /* Section headings within results */
  font-weight: 700;
  margin-bottom: 0.75rem;
}

p {
  font-size: 1.1rem; /* Body text */
  margin-bottom: 1rem;
}

label {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: block;
}

input[type="text"],
textarea,
select {
  font-family: 'Lora', serif;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--text-primary);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-color);
}

button {
  font-family: 'Playfair Display', serif;
  background-color: var(--accent-color);
  color: var(--background-color);
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  border: none;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--accent-color) 90%, black);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.container {
  max-width: 1200px;
}

.font-serif {
  font-family: 'Lora', serif;
}

.font-display-serif {
  font-family: 'Playfair Display', serif;
}

.accentColor {
  color: var(--accent-color);
  background-color: var(--accent-color); /* For elements that need background */
}

.bg-accentColor {
  background-color: var(--accent-color);
}

.text-accentColor {
  color: var(--accent-color);
}

/* Specific overrides for results display */
.container > div > h2 { /* Main section titles */
  font-size: 2rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.3rem;
}

.container > div > h3 { /* Result clause titles */
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.container > div > p { /* Result clause body */
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.container > div > .italic { /* Potential pull quotes */
  font-size: 1.2rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.container > div > p:last-child {
  margin-bottom: 0;
}
--- END ---