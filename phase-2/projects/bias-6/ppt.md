# Brief
RedTeamAI is a web application that helps identify and mitigate bias in AI systems. It generates adversarial attack scenarios based on user-provided AI system details, making bias detection accessible and actionable for organizations.

# Opportunities
- Differentiation: Offers a unique blend of a playful, claymorphic UI with serious AI fairness capabilities, making bias detection approachable.
- Problem Solving Approach: Proactively identifies AI vulnerabilities through structured red-teaming scenarios, preventing real-world discriminatory outcomes.
- USP: Combines advanced AI for scenario generation with an intuitive, engaging user interface for easy adoption and effective bias mitigation.

# Features
- AI System Input: Form to describe AI purpose, inputs, decisions, and user population.
- Adversarial Scenario Generation: Creates 10 detailed bias attack scenarios using Gemini AI.
- Scenario Breakdown: Each scenario includes attack method, target vulnerability, expected biased output, and detection strategy.
- Claymorphism UI: Soft, inflated, 3D-like shapes with pastel colors and rounded elements for an approachable aesthetic.
- Loading & Error Handling: Visual feedback for submission processing and user-friendly error messages.
- Responsive Design: Fully functional and visually appealing across mobile and desktop devices.
- AI Fairness Focus: Dedicated to identifying and flagging unfair discrimination in AI models.

# Technologies
- Frontend: Next.js 16, React, TypeScript, Tailwind CSS
- Icons: Lucide React
- AI Integration: Gemini API (gemini-2.5-flash) via server-side route
- Styling: Claymorphism UI principles, custom CSS variables

Constraints:
- No markdown like bold or headers
- No code
- Clean bullet points only
- Keep concise

--- FILE: app/page.tsx ---
'use client'

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Scenario {
  attackName: string;
  inputToSubmit: string;
  biasVulnerability: string;
  expectedBiasedOutput: string;
  detectionStrategy: string;
}

export default function Home() {
  const [aiPurpose, setAiPurpose] = useState('');
  const [inputTypes, setInputTypes] = useState('');
  const [decisionsMade, setDecisionsMade] = useState('');
  const [userPopulation, setUserPopulation] = useState('');
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScenarios([]);

    const prompt = `
      AI System Purpose: ${aiPurpose}
      Input Types Accepted: ${inputTypes}
      Decisions Made By System: ${decisionsMade}
      User Population: ${userPopulation}
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
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.result;

      // Basic parsing - assuming Gemini returns text that can be split by common delimiters
      // A more robust solution might involve asking Gemini for JSON output
      const parsedScenarios = generatedText.split('--- Scenario ---').slice(1).map((s: string) => {
        const lines = s.trim().split('\n');
        let scenario: Partial<Scenario> = {};
        let currentKey = '';

        lines.forEach(line => {
          if (line.startsWith('Attack Name:')) {
            scenario.attackName = line.replace('Attack Name:', '').trim();
            currentKey = 'attackName';
          } else if (line.startsWith('Input to Submit:')) {
            scenario.inputToSubmit = line.replace('Input to Submit:', '').trim();
            currentKey = 'inputToSubmit';
          } else if (line.startsWith('Bias Vulnerability Targeted:')) {
            scenario.biasVulnerability = line.replace('Bias Vulnerability Targeted:', '').trim();
            currentKey = 'biasVulnerability';
          } else if (line.startsWith('Expected Biased Output:')) {
            scenario.expectedBiasedOutput = line.replace('Expected Biased Output:', '').trim();
            currentKey = 'expectedBiasedOutput';
          } else if (line.startsWith('Detection Strategy:')) {
            scenario.detectionStrategy = line.replace('Detection Strategy:', '').trim();
            currentKey = 'detectionStrategy';
          } else if (currentKey && scenario[currentKey as keyof Scenario]) {
            // Append to the current field if it spans multiple lines
            scenario[currentKey as keyof Scenario] += '\n' + line.trim();
          }
        });
        return scenario as Scenario;
      });

      setScenarios(parsedScenarios);

    } catch (err: any) {
      console.error("Error generating scenarios:", err);
      setError(`Failed to generate scenarios. Please try again. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6 md:p-12 font-nunito">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-purple-700 mb-4 drop-shadow-lg">RedTeamAI</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-12 font-semibold">Describe your AI system — generate adversarial bias attack scenarios</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 claymorphism-card">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">Describe Your AI System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="aiPurpose" className="block text-left text-lg font-bold text-gray-700 mb-2">AI System Purpose</label>
              <input
                id="aiPurpose"
                type="text"
                value={aiPurpose}
                onChange={(e) => setAiPurpose(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 shadow-inner claymorphism-input"
                placeholder="e.g., Loan application approval"
                required
              />
            </div>
            <div>
              <label htmlFor="inputTypes" className="block text-left text-lg font-bold text-gray-700 mb-2">Input Types Accepted</label>
              <input
                id="inputTypes"
                type="text"
                value={inputTypes}
                onChange={(e) => setInputTypes(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-pink-300 focus:border-pink-500 shadow-inner claymorphism-input"
                placeholder="e.g., Financial history, credit score, demographic data"
                required
              />
            </div>
            <div>
              <label htmlFor="decisionsMade" className="block text-left text-lg font-bold text-gray-700 mb-2">Decisions Made By System</label>
              <input
                id="decisionsMade"
                type="text"
                value={decisionsMade}
                onChange={(e) => setDecisionsMade(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-pink-300 focus:border-pink-500 shadow-inner claymorphism-input"
                placeholder="e.g., Approve/Deny loan, loan amount"
                required
              />
            </div>
            <div>
              <label htmlFor="userPopulation" className="block text-left text-lg font-bold text-gray-700 mb-2">User Population</label>
              <input
                id="userPopulation"
                type="text"
                value={userPopulation}
                onChange={(e) => setUserPopulation(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 shadow-inner claymorphism-input"
                placeholder="e.g., General public, specific age groups, geographical regions"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-12 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Generating Scenarios...</span>
              </>
            ) : (
              <span>Generate Scenarios</span>
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-3xl mt-12 shadow-lg claymorphism-card">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-lg">{error}</p>
          </div>
        )}

        {scenarios.length > 0 && !loading && (
          <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-2xl claymorphism-card">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">Adversarial Bias Attack Scenarios</h2>
            <div className="space-y-12">
              {scenarios.map((scenario, index) => (
                <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-pink-600 mb-4 flex items-center space-x-3">
                    <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{scenario.attackName}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-left">
                      <p className="font-semibold text-lg text-gray-700 mb-2">Input to Submit:</p>
                      <p className="text-gray-600 p-3 rounded-xl bg-gray-100 border border-gray-200">{scenario.inputToSubmit}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg text-gray-700 mb-2">Bias Vulnerability Targeted:</p>
                      <p className="text-gray-600 p-3 rounded-xl bg-gray-100 border border-gray-200">{scenario.biasVulnerability}</p>
                    </div>
                    <div className="text-left md:col-span-2">
                      <p className="font-semibold text-lg text-gray-700 mb-2">Expected Biased Output:</p>
                      <p className="text-gray-600 p-3 rounded-xl bg-gray-100 border border-gray-200">{scenario.expectedBiasedOutput}</p>
                    </div>
                    <div className="text-left md:col-span-2">
                      <p className="font-semibold text-lg text-gray-700 mb-2">Detection Strategy:</p>
                      <p className="text-gray-600 p-3 rounded-xl bg-gray-100 border border-gray-200">{scenario.detectionStrategy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(request: Request) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return NextResponse.json(
      { message: 'Server configuration error: Gemini API key not found.' },
      { status: 500 }
    );
  }

  try {
    const { prompt: userInputPrompt } = await request.json();

    if (!userInputPrompt) {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    const systemPrompt = `You are an AI red-team specialist. Generate 10 adversarial bias test scenarios for this AI system. For each scenario: attack name, specific input to submit, which bias vulnerability it targets, what a biased system would likely output, and how to detect if the system failed the test. Make scenarios concrete and executable by a QA tester. Format each scenario clearly, using '--- Scenario ---' as a separator between scenarios.

    AI System Purpose: [Purpose]
    Input Types Accepted: [Input Types]
    Decisions Made By System: [Decisions]
    User Population: [Population]
    `;

    const fullPrompt = systemPrompt.replace('[Purpose]', userInputPrompt.split('AI System Purpose:')[1]?.split('\n')[0]?.trim() || '')
                                 .replace('[Input Types]', userInputPrompt.split('Input Types Accepted:')[1]?.split('\n')[0]?.trim() || '')
                                 .replace('[Decisions]', userInputPrompt.split('Decisions Made By System:')[1]?.split('\n')[0]?.trim() || '')
                                 .replace('[Population]', userInputPrompt.split('User Population:')[1]?.split('\n')[0]?.trim() || '');


    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }]
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Gemini API Error:', response.status, errorBody);
      throw new Error(`Gemini API returned status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts) {
       console.error('Unexpected Gemini API response structure:', data);
       throw new Error('Received an unexpected response format from Gemini.');
    }

    const geminiResponseText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ result: geminiResponseText });

  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { message: `Failed to generate scenarios: ${error.message}` },
      { status: 500 }
    );
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Varela+Round&display=swap');

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start: 255, 255, 255; /* White */
  --background-end: 245, 245, 250; /* Very light gray */

  --primary-purple-100: #E9D5FF; /* Very light purple */
  --primary-purple-300: #C084FC; /* Light purple */
  --primary-purple-500: #A78BFA; /* Medium purple */
  --primary-purple-700: #7C3AED; /* Strong purple */

  --accent-pink-100: #FBCFE8; /* Very light pink */
  --accent-pink-300: #F9A8D4; /* Light pink */
  --accent-pink-500: #EC4899; /* Medium pink */
  --accent-pink-600: #DB2777; /* Strong pink */

  --accent-blue-100: #BFDBFE; /* Very light blue */
  --accent-blue-300: #93C5FD; /* Light blue */
  --accent-blue-500: #60A5FA; /* Medium blue */

  --text-gray-500: #6B7280; /* Medium gray */
  --text-gray-600: #4B5563; /* Darker gray */
  --text-gray-700: #374151; /* Darkest gray */

  --error-red-100: #FEE2E2; /* Very light red */
  --error-red-700: #B91C1C; /* Strong red */
}

/* Claymorphism Card Style */
.claymorphism-card {
  background: linear-gradient(180deg, rgba(var(--background-start), 1) 0%, rgba(var(--background-end), 0.8) 100%);
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08);
  padding: 32px;
}

/* Claymorphism Input Style */
.claymorphism-input {
  border-radius: 24px;
  border-width: 2px;
  padding: 16px;
  font-size: 1rem; /* Equivalent to text-base */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.claymorphism-input:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(167, 138, 250, 0.3); /* Purple focus ring */
}

/* General Body Styles */
body {
  font-family: 'Nunito', sans-serif; /* Primary font */
  color: var(--text-gray-700);
  background-color: var(--background-start); /* Default to white */
  background: linear-gradient(180deg, var(--primary-purple-100) 0%, var(--accent-pink-100) 100%);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Nunito', sans-serif; /* Use Nunito for headings too for consistency */
  font-weight: 700; /* Bold */
}

/* Specific element styling */
.shadow-inner {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Ensure rounded buttons */
button {
  border-radius: 9999px; /* Pill shape */
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .claymorphism-card {
    padding: 48px;
  }
  .claymorphism-input {
    padding: 20px;
    font-size: 1.125rem; /* text-lg */
  }
}

@media (min-width: 1024px) {
  .claymorphism-card {
    padding: 64px;
  }
}
--- END ---