# Brief
FieldDebrief is a data-driven volunteer coordination tool that automates the structuring of raw field reports into standardized NGO documentation. It leverages AI to extract critical information, identify urgent needs, and prepare data for efficient volunteer allocation, thereby enhancing social impact.

# Opportunities
## Differentiation
- AI-powered natural language processing for report structuring.
- Seamless integration of field data into NGO operational workflows.
- Focus on immediate actionable insights for volunteer deployment.

## Problem Solving Approach
The system addresses the challenge of scattered and unstructured community data by providing a single, automated pipeline for processing field reports. This ensures that valuable insights are captured, organized, and readily available for decision-making.

## USP
"Submit your field report in plain language — get it structured for NGO records automatically."

# Features
- Plain-language field report submission form.
- AI-driven conversion of unstructured text to structured NGO report format.
- Automatic extraction of key data points: Date/Location, Activities, Beneficiaries, Issues, Follow-up.
- Urgent issue flagging and identification of missing critical information.
- Professional, clean, and responsive web UI for enhanced user experience.
- Loading and error state handling.

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini API (via serverless route)
- lucide-react for icons
- Google Fonts for professional typography

--- FILE: app/page.tsx ---
"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';

const HomePage: React.FC = () => {
  const [reportText, setReportText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: reportText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error("Failed to fetch analysis:", err);
      if (err instanceof Error) {
        setError(`Analysis failed: ${err.message}`);
      } else {
        setError('An unknown error occurred during analysis.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseResult = () => {
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="FieldDebrief Logo" className="h-8 w-auto"/>
            <h1 className="text-2xl font-semibold text-green-800">FieldDebrief</h1>
          </div>
          <nav>
            {/* Placeholder for future navigation */}
            <a href="#" className="text-green-600 hover:text-green-800 px-3 py-2 rounded-md transition duration-150 ease-in-out">About</a>
            <a href="#" className="text-green-600 hover:text-green-800 px-3 py-2 rounded-md transition duration-150 ease-in-out">Docs</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">Submit Your Field Report</h2>
            <p className="text-gray-600 mb-6 text-center">Describe what you saw, did, and who you helped. AI will structure it for NGO records.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="report" className="block text-lg font-medium text-gray-700 mb-2">
                  Your Observations
                </label>
                <textarea
                  id="report"
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm resize-none text-base text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Visited Oak Street community center today. Conducted a workshop for 15 youths on digital literacy. Noticed several families struggling with food insecurity. Need to coordinate with food bank for next week."
                  value={reportText}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReportText(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading || !reportText.trim()}
                suppressHydrationWarning
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Report"
                )}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg shadow-md flex justify-between items-center animate-fade-in">
                <div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    <strong className="font-semibold">Error!</strong>
                  </div>
                  <p className="mt-2">{error}</p>
                </div>
                <button onClick={handleCloseError} className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {result && (
              <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-green-900">Structured Report</h2>
                  <button onClick={handleCloseResult} className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full p-1">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6 text-gray-700">
                  {result.split('\n').map((line, index) => {
                    if (!line.trim()) return null;

                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <div key={index} className="text-xl font-semibold text-green-800 mt-4">
                          {line.replace(/\*\*/g, '')}
                        </div>
                      );
                    }
                    if (line.includes(':')) {
                      const [key, value] = line.split(':', 2);
                      return (
                        <div key={index} className="text-base">
                          <span className="font-medium text-gray-800">{key.trim()}:</span>
                          <span className="ml-2 text-gray-700">{value.trim()}</span>
                        </div>
                      );
                    }
                    return (
                      <p key={index} className="text-base leading-relaxed">
                        {line.trim()}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {!isLoading && !result && !error && (
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                Submit a report to see the structured output here.
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} FieldDebrief. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    return NextResponse.json({ error: "Server configuration error: API key missing." }, { status: 500 });
  }

  const { prompt } = await request.json();
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: "Invalid input: prompt is required." }, { status: 400 });
  }

  const systemPrompt = `You are a field documentation AI for NGOs. Convert this volunteer field report into a structured record with these sections: **Date/Location**, **Volunteer Name**, **Activities Completed**, **Beneficiaries Reached**, **Resources Used**, **Issues Encountered**, **Follow-Up Required**, and **Overall Field Status (GREEN/YELLOW/RED)**. Note any critical information that is missing.`;

  const fullPrompt = `${systemPrompt}\n\nVolunteer Report:\n${prompt}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      const resultText = data.candidates[0].content.parts.map((part: any) => part.text).join('');
      return NextResponse.json({ result: resultText });
    } else {
      console.error("Unexpected Gemini API response format:", data);
      throw new Error("Unexpected response format from Gemini API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: `Failed to process report: ${error instanceof Error ? error.message : 'An unknown error occurred.'}` }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Montserrat:wght@700&display=swap');

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start: 255, 255, 255; /* White */
  --background-end: 248, 249, 250;   /* Light Grey */
  --primary-color: #2E7D32; /* Darker Green for trust */
  --secondary-color: #FF8F00; /* Earthy Orange for warmth */
  --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --card-border-radius: 0.5rem; /* 8px */
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(to bottom right, rgb(var(--background-start)), rgb(var(--background-end))) no-repeat center center fixed;
  background-size: cover;
  font-family: 'Inter', sans-serif; /* Professional sans-serif */
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif; /* Distinctive headline font */
  color: #1E4A1E; /* Deep green for headings */
}

a {
  color: inherit;
  text-decoration: none;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom styles for input focus */
input:focus,
textarea:focus {
  outline: none;
  --tw-ring-opacity: 1;
  --tw-ring-color: theme('colors.green.500'); /* Using primary color for focus */
  --tw-ring-width: 2px;
  --tw-ring-offset-width: 2px;
  --tw-ring-offset-color: theme('colors.white');
  border-color: transparent;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Card styling */
.shadow-xl {
  box-shadow: var(--card-shadow);
}

.rounded-2xl {
  border-radius: var(--card-border-radius);
}

/* Adjust Tailwind defaults if needed */
html, body {
  margin: 0;
  padding: 0;
}

/* Ensure responsiveness */
@media (max-width: 768px) {
  :root {
    --card-border-radius: 0.75rem; /* Slightly larger radius on mobile */
  }
}
--- END ---