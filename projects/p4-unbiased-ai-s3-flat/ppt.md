# Brief
DataMirror is a web-based tool designed to enhance AI fairness by providing a user-friendly interface for identifying and mitigating bias in datasets. It analyzes user-provided dataset metadata to detect proxy discrimination, offering actionable insights for correction.

# Opportunities
## Differentiation
A pure Flat Design aesthetic, strict adherence to Next.js 16 and modern frontend practices, and direct Gemini AI integration for bias detection differentiate DataMirror from generic data analysis tools.

## Problem Solving Approach
The tool addresses the critical issue of algorithmic bias by proactively identifying hidden discriminatory proxies before models are deployed. It translates complex AI fairness concepts into an accessible user experience.

## USP
DataMirror's unique selling proposition lies in its focused approach to proxy detection with a visually distinct, high-contrast Flat Design UI, coupled with AI-driven analysis and specific mitigation suggestions.

# Features
- Dataset input form for column names and sample values.
- Real-time loading indicator during AI analysis.
- Clearly displayed results categorizing proxy features, protected attributes, risk levels, and suggested transformations.
- Flat Design UI with bold typography and color-blocking.
- Responsive design for accessibility across devices.

# Technologies
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS, Custom CSS Variables
- Icons: lucide-react
- AI Integration: Gemini AI (gemini-2.5-flash) via server-side API route

--- FILE: app/page.tsx ---
"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { AlertTriangle, Sparkles, Loader2 } from "lucide-react";

interface AnalysisResult {
  feature: string;
  proxies_for: string;
  risk_level: "HIGH" | "MEDIUM" | "LOW";
  transformation_suggestion: string;
}

export default function HomePage() {
  const [datasetInput, setDatasetInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDatasetInput(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setAnalysisResults([]);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: datasetInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Basic parsing assuming the AI returns a structured string or JSON
      // A more robust parsing would be needed for complex AI outputs
      if (data.result) {
        try {
          // Attempt to parse as JSON first if the AI might return it
          const parsedResults = JSON.parse(data.result);
          if (Array.isArray(parsedResults) && parsedResults.every(item => item.feature && item.proxies_for && item.risk_level && item.transformation_suggestion)) {
             setAnalysisResults(parsedResults);
          } else {
             // If not valid JSON array of results, treat as text and attempt to parse lines
             parseTextResults(data.result);
          }
        } catch (parseError) {
          // If JSON parsing fails, try parsing as text lines
          parseTextResults(data.result);
        }
      } else {
        throw new Error("No result received from AI.");
      }
    } catch (err: any) {
      setError(`Analysis failed: ${err.message}`);
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseTextResults = (text: string) => {
    const lines = text.trim().split('\n');
    const results: AnalysisResult[] = [];
    let currentResult: Partial<AnalysisResult> = {};
    let riskLevel: "HIGH" | "MEDIUM" | "LOW" | undefined = undefined;

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      const featureMatch = line.match(/^Feature: "([^"]+)"/);
      const proxiesMatch = line.match(/^Proxies for: ([^,]+)/);
      const riskMatch = line.match(/^Risk Level: (HIGH|MEDIUM|LOW)/);
      const transformationMatch = line.match(/^Transformation Suggestion: (.+)/);

      if (featureMatch) {
        if (Object.keys(currentResult).length > 0) {
          if (currentResult.feature && currentResult.proxies_for && currentResult.risk_level && currentResult.transformation_suggestion) {
            results.push(currentResult as AnalysisResult);
          }
        }
        currentResult = { feature: featureMatch[1] };
        riskLevel = undefined; // Reset risk level for new feature
      } else if (proxiesMatch && currentResult.feature) {
        currentResult.proxies_for = proxiesMatch[1].trim();
      } else if (riskMatch && currentResult.feature) {
        riskLevel = riskMatch[1] as "HIGH" | "MEDIUM" | "LOW";
        currentResult.risk_level = riskLevel;
      } else if (transformationMatch && currentResult.feature) {
        currentResult.transformation_suggestion = transformationMatch[1].trim();
      } else if (currentResult.feature && riskLevel && currentResult.transformation_suggestion !== undefined) {
         // If a line doesn't match a specific field but we are mid-parsing a feature,
         // append it to the transformation suggestion if it's a continuation.
         // This is a simple heuristic and might need refinement.
         if (currentResult.transformation_suggestion) {
            currentResult.transformation_suggestion += " " + line;
         }
      }
    });

    // Add the last parsed result if it's complete
    if (currentResult.feature && currentResult.proxies_for && currentResult.risk_level && currentResult.transformation_suggestion) {
      results.push(currentResult as AnalysisResult);
    }

    setAnalysisResults(results);
  };


  return (
    <div className="min-h-screen flex flex-col p-0 bg-neutral-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      <header className="bg-purple-800 text-white py-8 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          <Sparkles className="h-10 w-10 mr-4" />
          <h1 className="text-5xl font-bold tracking-tight">DataMirror</h1>
        </div>
        <p className="text-xl">Detecting Bias in Your Data</p>
      </header>

      <main className="flex-grow container mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section className="bg-purple-100 dark:bg-gray-800 p-12 rounded-xl shadow-lg flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold mb-8 text-purple-900 dark:text-purple-300">
            Input Your Dataset Details
          </h2>
          <p className="text-lg mb-10 text-gray-700 dark:text-gray-300">
            Provide your dataset's column names and a few sample values for each. DataMirror will analyze them for potential discriminatory proxies.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <label htmlFor="datasetInput" className="text-2xl font-bold mb-2 text-purple-800 dark:text-purple-200">
              Dataset Columns & Sample Values:
            </label>
            <textarea
              id="datasetInput"
              value={datasetInput}
              onChange={handleInputChange}
              rows={10}
              placeholder="Example:&#10;column_name, sample_values&#10;age, 25, 45, 60&#10;income, 50000, 75000, 120000&#10;zip_code, 90210, 10001, 60601&#10;gender, Male, Female, Non-binary&#10;education, Bachelor's, Master's, PhD"
              className="p-5 border-2 border-purple-300 dark:border-gray-600 rounded-lg text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition duration-300 resize-none"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-8 rounded-lg text-2xl transition duration-300 flex items-center justify-center disabled:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
              ) : (
                <Sparkles className="h-8 w-8 mr-3" />
              )}
              Analyze for Bias
            </button>
          </form>
        </section>

        <section className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg">
          <h2 className="text-4xl font-extrabold mb-8 text-purple-900 dark:text-purple-300">
            Analysis Results
          </h2>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <Loader2 className="h-16 w-16 text-purple-600 animate-spin mb-6" />
              <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Analyzing your data...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg flex items-center mb-8">
              <AlertTriangle className="h-8 w-8 mr-4 text-red-600" />
              <p className="text-xl font-semibold">Error: {error}</p>
            </div>
          )}

          {!isLoading && !error && analysisResults.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <p className="text-2xl text-gray-600 dark:text-gray-400">
                Enter your dataset details and click "Analyze for Bias" to see results here.
              </p>
            </div>
          )}

          {!isLoading && !error && analysisResults.length > 0 && (
            <div className="grid grid-cols-1 gap-8">
              {analysisResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-xl shadow-lg ${
                    result.risk_level === "HIGH"
                      ? "bg-red-50 border-red-400 border-2"
                      : result.risk_level === "MEDIUM"
                      ? "bg-yellow-50 border-yellow-400 border-2"
                      : "bg-green-50 border-green-400 border-2"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                      {result.feature}
                    </h3>
                    <span
                      className={`text-xl font-bold px-4 py-2 rounded-full ${
                        result.risk_level === "HIGH"
                          ? "bg-red-600 text-white"
                          : result.risk_level === "MEDIUM"
                          ? "bg-yellow-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {result.risk_level}
                    </span>
                  </div>
                  <p className="text-xl mb-3 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-purple-700 dark:text-purple-300">Proxies For:</span> {result.proxies_for}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-purple-600 dark:text-purple-300">Suggestion:</span> {result.transformation_suggestion}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-purple-800 text-white py-8 px-8 mt-auto">
        <div className="container mx-auto text-center text-xl">
          &copy; {new Date().getFullYear()} DataMirror. Ensuring Algorithmic Fairness.
        </div>
      </footer>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse, NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Helper to format results into a string that's easier to parse
function formatGeminiResponse(geminiResponse: string): string {
    // The prompt asks for structured output, but we'll add a layer of robustness
    // This is a placeholder and might need adjustment based on actual Gemini output
    // For now, it primarily ensures the output is a string.
    return geminiResponse;
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    return NextResponse.json({ error: "Server configuration error: API key missing." }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing 'prompt' in request body." }, { status: 400 });
    }

    const systemPrompt = `You are a data discrimination detection AI. Analyze these dataset features for proxy discrimination. For each suspicious feature, explain: what protected attribute it likely proxies (e.g., zip code → race, name → gender), the proxy mechanism, risk level (HIGH/MEDIUM/LOW), and a specific transformation or mitigation to reduce the proxy effect. Be precise with examples.
    Format your output as a JSON array of objects, where each object has the keys: "feature", "proxies_for", "risk_level", and "transformation_suggestion". If no suspicious features are found, return an empty JSON array.`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: systemPrompt }
          ]
        },
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Gemini API error response:", errorData);
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const responseData = await geminiResponse.json();

    if (responseData.candidates && responseData.candidates.length > 0 && responseData.candidates[0].content && responseData.candidates[0].content.parts && responseData.candidates[0].content.parts.length > 0) {
      const aiOutput = responseData.candidates[0].content.parts[0].text;
      // Attempt to parse the response as JSON directly
      try {
        const parsedResults = JSON.parse(aiOutput);
        // Further validation could be added here to ensure parsedResults is an array of expected objects
        return NextResponse.json({ result: JSON.stringify(parsedResults) }); // Send back as string for frontend to parse
      } catch (parseError) {
        // If it's not valid JSON, return the raw text, letting the frontend handle it
        console.warn("Gemini output was not valid JSON, returning raw text:", parseError);
        return NextResponse.json({ result: aiOutput });
      }
    } else {
      console.error("Unexpected response structure from Gemini API:", responseData);
      throw new Error("Unexpected response structure from Gemini API.");
    }

  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    // Return a structured error for the client
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&family=Montserrat:wght@700;800;900&display=swap');

/* Define custom CSS Variables for Flat Design Palette */
:root {
  /* Color Palette: Deep Purple, Clean White, and supporting neutrals */
  --color-primary: #6D28D9; /* Deep Purple */
  --color-primary-light: #DDD6FE; /* Light Purple */
  --color-secondary: #F0F4F8; /* Very Light Gray/Off-white */
  --color-accent: #EC4899; /* Vibrant Pink for accents (optional, can use primary for actions) */
  --color-text-dark: #1F2937; /* Dark Gray */
  --color-text-light: #FFFFFF; /* White */
  --color-risk-high: #EF4444; /* Red */
  --color-risk-medium: #EAB308; /* Yellow */
  --color-risk-low: #22C55E; /* Green */
}

/* Apply dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #9370DB; /* Lighter Purple for dark mode */
    --color-primary-light: #3730A3; /* Darker Purple */
    --color-secondary: #1F2937; /* Dark background */
    --color-accent: #F472B6; /* Lighter Pink */
    --color-text-dark: #E5E7EB; /* Light Gray */
    --color-text-light: #111827; /* Very Dark Background */
  }
}

/* Base styles */
body {
  font-family: 'Inter', sans-serif; /* Bold Sans-Serif for UI */
  background-color: var(--color-secondary);
  color: var(--color-text-dark);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Headings - Use Montserrat for strong hierarchy */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900; /* Extra bold */
  line-height: 1.2;
}

/* Custom button styles */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  font-weight: 900;
  padding: 1rem 2rem;
  border-radius: 4px; /* Sharp edges */
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: none; /* Explicitly no shadows */
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem; /* Larger text */
}

.btn-primary:hover {
  background-color: #5b21b6; /* Darker shade for hover */
}

.btn-primary:disabled {
  background-color: var(--color-primary-light);
  color: var(--color-text-dark);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Custom input styles */
input[type="text"],
input[type="email"],
input[type="password"],
textarea {
  font-family: 'Inter', sans-serif;
  background-color: var(--color-text-light);
  color: var(--color-text-dark);
  border: 2px solid var(--color-primary-light);
  padding: 1rem 1.5rem;
  border-radius: 4px; /* Sharp edges */
  font-size: 1.1rem;
  outline: none;
  box-shadow: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.5); /* Subtle focus ring */
}

textarea {
  resize: vertical; /* Allow vertical resizing */
}

/* Flat Design Card styles */
.card {
  background-color: var(--color-text-light);
  color: var(--color-text-dark);
  border-radius: 4px; /* Sharp edges */
  padding: 2rem;
  box-shadow: none; /* Explicitly no shadows */
  border: none; /* No default borders */
}

.dark .card {
  background-color: var(--color-primary-light); /* Slightly darker background for cards in dark mode */
  color: var(--color-text-dark);
}


/* Specific risk level styling */
.risk-high {
  background-color: var(--color-risk-high);
  color: var(--color-text-light);
}
.risk-medium {
  background-color: var(--color-risk-medium);
  color: var(--color-text-dark);
}
.risk-low {
  background-color: var(--color-risk-low);
  color: var(--color-text-light);
}

/* Container for main content */
.container {
  max-width: 1280px; /* Standard max-width */
}

/* Header section */
header {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  padding: 3rem 2rem; /* Generous padding */
  box-shadow: none; /* Explicitly no shadows */
}

header h1 {
  font-size: 3.5rem; /* Large, bold font */
  letter-spacing: -1px;
}

header p {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Footer section */
footer {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  padding: 2rem 1rem;
  box-shadow: none; /* Explicitly no shadows */
}

footer p {
  font-size: 1.2rem;
  font-weight: 700;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  header h1 {
    font-size: 2.8rem;
  }
  header p {
    font-size: 1.2rem;
  }
  .card {
    padding: 1.5rem;
  }
  input[type="text"],
  textarea {
    padding: 0.8rem 1rem;
    font-size: 1rem;
  }
  .btn-primary {
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  header {
    padding: 2rem 1rem;
  }
  header h1 {
    font-size: 2.2rem;
    text-align: center;
  }
  header p {
    font-size: 1rem;
    text-align: center;
  }
  main {
    padding: 2rem 1rem;
  }
  .card {
    padding: 1rem;
  }
  h2 {
    font-size: 2rem;
  }
  h3 {
    font-size: 1.5rem;
  }
  .btn-primary {
    width: 100%; /* Full width button on small screens */
    font-size: 1rem;
    padding: 1rem;
  }
}

/* Tailwind overrides for specific Flat Design elements */
.shadow-lg {
  box-shadow: none !important; /* Ensure no shadows are applied by Tailwind */
}

.rounded-lg {
  border-radius: 4px !important; /* Enforce sharp corners */
}

.rounded-xl {
  border-radius: 4px !important; /* Enforce sharp corners */
}

.border-2 {
  border-width: 2px !important;
}

/* Ensure sufficient contrast */
.text-purple-800 { color: #6D28D9 !important; } /* Example: Ensure contrast if used on light bg */
.bg-purple-100 { background-color: #DDD6FE !important; } /* Example: Ensure contrast if used with dark text */

/* Custom class for flat illustration-like elements if needed */
.flat-shape {
  position: absolute;
  background-color: var(--color-primary-light);
  opacity: 0.5;
  filter: blur(0px); /* Ensure no blur */
  border-radius: 0; /* Sharp edges */
}
.flat-shape.circle {
  border-radius: 50%;
}
.flat-shape.square {
  border-radius: 0;
}

--- END ---