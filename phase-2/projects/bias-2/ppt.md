# Brief
A tool to identify and correct discriminatory language in job descriptions, promoting inclusive hiring practices and algorithmic fairness.

# Opportunities
- Differentiation: Focus on proactive bias detection and remediation for hiring.
- Problem Solving Approach: Uses AI to analyze text, explain bias mechanisms, and offer solutions.
- USP: Combines an intuitive neomorphic UI with powerful AI for accessible fairness in recruitment.

# Features
- Job Description Analysis: Identifies and flags discriminatory phrases.
- Bias Explanation: Details disadvantaged groups and the nature of the bias.
- Severity Rating: Assigns HIGH/MEDIUM/LOW severity to flagged phrases.
- Inclusive Rewrite: Generates a fully inclusive job description.
- Neomorphic UI: Soft, extruded design with dual shadows for a modern aesthetic.
- Responsive Design: Optimized for both mobile and desktop viewing.
- Loading & Error States: Clear visual feedback during processing and for any errors.

# Technologies
- Frontend: Next.js 16, React, TypeScript, Tailwind CSS
- Icons: Lucide-react
- AI Integration: Gemini API (`gemini-2.5-flash`)
- Styling: Custom CSS Variables, Google Fonts (Poppins)

--- FILE: app/page.tsx ---
'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Head from 'next/head';

interface BiasDetail {
  phrase: string;
  disadvantaged_groups: string;
  mechanism: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface GeminiResponse {
  flagged_phrases: BiasDetail[];
  rewritten_description: string;
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<GeminiResponse | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unexpected error occurred');
      }

      const data = await response.json();
      // Basic parsing assuming Gemini returns a structured text response
      // A more robust solution would involve JSON output from Gemini or better parsing
      const resultText = data.result;

      // Attempt to parse the Gemini response. This is a simplified parser.
      // Ideally, Gemini would return JSON.
      const parsedResult: GeminiResponse = {
        flagged_phrases: [],
        rewritten_description: '',
      };

      const sections = resultText.split('\n\n');
      let currentPhrase: Partial<BiasDetail> | null = null;
      let currentRewrittenSection = false;

      sections.forEach((section: string) => {
        if (section.startsWith('(1) Flagged Discriminatory Phrase:')) {
          if (currentPhrase) {
            parsedResult.flagged_phrases.push(currentPhrase as BiasDetail);
          }
          currentPhrase = { phrase: section.replace('(1) Flagged Discriminatory Phrase:', '').trim() };
          currentRewrittenSection = false;
        } else if (section.startsWith('(2) Disadvantaged Groups:') && currentPhrase) {
          currentPhrase.disadvantaged_groups = section.replace('(2) Disadvantaged Groups:', '').trim();
        } else if (section.startsWith('(3) Discrimination Mechanism:') && currentPhrase) {
          currentPhrase.mechanism = section.replace('(3) Discrimination Mechanism:', '').trim();
        } else if (section.startsWith('(4) Severity:') && currentPhrase) {
          currentPhrase.severity = section.replace('(4) Severity:', '').trim() as any; // Cast for simplicity
        } else if (section.startsWith('(5) Rewritten Inclusive Job Description:')) {
          currentRewrittenSection = true;
          parsedResult.rewritten_description = ''; // Reset for new description
        } else if (currentRewrittenSection) {
          parsedResult.rewritten_description += section + '\n';
        }
      });

      if (currentPhrase) {
        parsedResult.flagged_phrases.push(currentPhrase as BiasDetail);
      }
      parsedResult.rewritten_description = parsedResult.rewritten_description.trim();


      setAnalysisResult(parsedResult);

    } catch (err: any) {
      setError(err.message || 'Failed to analyze job description.');
    } finally {
      setIsLoading(false);
    }
  };

  const severityColorMap: Record<string, string> = {
    HIGH: 'text-red-500',
    MEDIUM: 'text-yellow-500',
    LOW: 'text-green-500',
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Head>
        <title>HiringLens</title>
      </Head>
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-primary-text">HiringLens</h1>
      <p className="text-lg md:text-xl text-center mb-8 text-secondary-text">
        Paste a job description — find discriminatory language and get a rewrite
      </p>

      <form onSubmit={handleSubmit} className="neomorphic-card p-6 md:p-8 mb-8 flex flex-col gap-6">
        <label htmlFor="job-description" className="text-lg font-medium text-primary-text">
          Job Description
        </label>
        <textarea
          id="job-description"
          rows={10}
          value={jobDescription}
          onChange={handleInputChange}
          placeholder="Paste your job description here..."
          className="neomorphic-input w-full resize-none"
          required
        />
        <button
          type="submit"
          className={`neomorphic-button ${isLoading ? 'neomorphic-button-disabled' : ''} flex items-center justify-center gap-2`}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="animate-spin" />}
          Analyze Description
        </button>
      </form>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="animate-spin mx-auto mb-3 text-accent-color" size={40} />
          <p className="text-lg text-secondary-text">Analyzing your job description...</p>
        </div>
      )}

      {error && (
        <div className="neomorphic-card p-6 md:p-8 bg-red-100 border border-red-300 text-red-800">
          <h2 className="text-2xl font-semibold mb-3">Error</h2>
          <p>{error}</p>
        </div>
      )}

      {analysisResult && (
        <div className="neomorphic-card p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-6 text-primary-text">Analysis Results</h2>

          {analysisResult.flagged_phrases.length > 0 && (
            <section className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-primary-text">Discriminatory Phrases Found</h3>
              {analysisResult.flagged_phrases.map((detail, index) => (
                <div key={index} className="neomorphic-card p-4 mb-4 last:mb-0">
                  <p className="text-lg font-medium mb-2">
                    Phrase: <span className="font-normal text-primary-text">{detail.phrase}</span>
                  </p>
                  <p className="text-lg font-medium mb-2">
                    Disadvantaged Groups: <span className="font-normal text-primary-text">{detail.disadvantaged_groups}</span>
                  </p>
                  <p className="text-lg font-medium mb-2">
                    Mechanism: <span className="font-normal text-primary-text">{detail.mechanism}</span>
                  </p>
                  <p className={`text-lg font-medium ${severityColorMap[detail.severity] || 'text-primary-text'}`}>
                    Severity: <span className="font-normal">{detail.severity}</span>
                  </p>
                </div>
              ))}
            </section>
          )}

          <section>
            <h3 className="text-2xl font-semibold mb-4 text-primary-text">Rewritten Inclusive Description</h3>
            <div className="neomorphic-card p-4">
              <p className="text-base text-primary-text whitespace-pre-wrap leading-relaxed">
                {analysisResult.rewritten_description || "No rewritten description available."}
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse, NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set.' }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Job description prompt is required.' }, { status: 400 });
    }

    const systemPrompt = `You are an inclusive hiring AI. Scan this job description and: (1) Flag every discriminatory phrase (highlight exact text), (2) Explain which groups each phrase disadvantages and how, (3) Rate each as HIGH/MEDIUM/LOW severity, (4) Rewrite the entire JD in inclusive language. Reference EEOC guidelines where relevant. Format your response clearly with numbered sections for each part, ensuring the rewritten description is clearly marked. Use the following structure:
(1) Flagged Discriminatory Phrase: [phrase]
(2) Disadvantaged Groups: [groups and explanation]
(3) Discrimination Mechanism: [how it's discriminatory]
(4) Severity: [HIGH/MEDIUM/LOW]
(5) Rewritten Inclusive Job Description:
[rewritten text]
`;

    const userPrompt = `${systemPrompt}\n\nJob Description:\n${prompt}`;

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`Gemini API Error: ${geminiResponse.status} - ${errorText}`);
      throw new Error(`Gemini API returned status ${geminiResponse.status}`);
    }

    const data = await geminiResponse.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const resultText = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ result: resultText });
    } else {
      console.error('Unexpected Gemini response format:', data);
      throw new Error('Received an unexpected response format from Gemini.');
    }

  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

:root {
  --background-color: #e0e5ec; /* Soft warm grey */
  --primary-text: #333;
  --secondary-text: #555;
  --accent-color: #6b8ef5; /* Soft blue */
  --accent-hover-color: #4f76d3;
  --card-background: #ffffff;
  --shadow-light: #ffffff;
  --shadow-dark: rgba(0, 0, 0, 0.15);
  --input-background: #f0f4f8;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--background-color);
  color: var(--primary-text);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
}

.neomorphic-card {
  background-color: var(--card-background);
  border-radius: 16px; /* Slightly more rounded for neomorphism */
  box-shadow: -5px -5px 10px var(--shadow-light), 5px 5px 10px var(--shadow-dark);
  padding: 20px; /* Default padding */
}

.neomorphic-input {
  background-color: var(--input-background);
  border-radius: 12px;
  box-shadow: inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark);
  padding: 12px 16px;
  border: none;
  outline: none;
  color: var(--primary-text);
  font-size: 1rem;
  font-weight: 500;
  transition: box-shadow 0.3s ease;
}

.neomorphic-input:focus {
  box-shadow: inset -2px -2px 5px var(--shadow-light), inset 2px 2px 5px var(--shadow-dark);
}

.neomorphic-button {
  background-color: var(--accent-color);
  color: white;
  border-radius: 12px;
  box-shadow: -5px -5px 10px var(--shadow-light), 5px 5px 10px var(--shadow-dark);
  padding: 12px 24px;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex; /* For centering items inside */
  align-items: center;
  justify-content: center;
}

.neomorphic-button:hover:not(:disabled) {
  background-color: var(--accent-hover-color);
  box-shadow: -7px -7px 15px var(--shadow-light), 7px 7px 15px var(--shadow-dark);
}

.neomorphic-button:active:not(:disabled) {
  box-shadow: inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark);
  transform: translateY(1px);
}

.neomorphic-button-disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark);
}


/* Specific text colors */
.text-primary-text {
  color: var(--primary-text);
}

.text-secondary-text {
  color: var(--secondary-text);
}

.text-accent-color {
  color: var(--accent-color);
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .neomorphic-card {
    padding: 30px;
  }
  .neomorphic-button {
    padding: 15px 30px;
    font-size: 1.1rem;
  }
  textarea.neomorphic-input {
    font-size: 1.1rem;
  }
  h1 {
    font-size: 4rem;
  }
  h2 {
    font-size: 2.25rem;
  }
  h3 {
    font-size: 1.75rem;
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 4.5rem;
  }
}
--- END ---