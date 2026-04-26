# Brief
WatermarkIQ is a digital asset protection platform designed for sports organizations. It generates invisible steganographic watermarks and cryptographic ownership signatures for digital media, helping to identify, track, and flag unauthorized use across the internet.

# Opportunities
- Differentiation: Offers advanced IP protection for the high-volume digital media market in sports.
- Problem Solving Approach: Leverages AI for robust, scalable, and near real-time digital asset authentication.
- USP: Provides unique, invisible watermarking and traceable ownership signatures to combat digital misappropriation and IP violations.

# Features
- User-friendly input form for asset details.
- AI-powered generation of invisible watermarks and ownership signatures.
- Clear display of generated signatures and embedding instructions.
- Loading and error handling with user-friendly feedback.
- Responsive design for all devices.
- Brutalist UI for a bold, attention-grabbing aesthetic.

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini API (gemini-2.5-flash)
- Lucide-React for icons

--- FILE: app/page.tsx ---
'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

const INITIAL_STATE = {
  assetTitle: '',
  creatorName: '',
  organization: '',
  assetType: '',
  creationDate: '',
};

interface GeminiResponse {
  result?: string;
  error?: string;
}

export default function HomePage() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setGeminiResult(null);
    setError(null);

    const prompt = `
      Asset Title: ${formData.assetTitle}
      Creator Name: ${formData.creatorName}
      Organization: ${formData.organization}
      Asset Type: ${formData.assetType}
      Creation Date: ${formData.creationDate}
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

      const data: GeminiResponse = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.result) {
        setGeminiResult(data.result);
      }
    } catch (err: any) {
      setError(`Failed to generate watermark. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setFormData(INITIAL_STATE);
    setGeminiResult(null);
    setError(null);
  };

  const parseGeminiResponse = (text: string) => {
    const sections: { [key: string]: string } = {};
    let currentKey = '';
    let currentValue = '';

    const lines = text.split('\n');
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.length === 0) return;

      const match = trimmedLine.match(/^([^:]+):(.*)$/);
      if (match) {
        if (currentKey) {
          sections[currentKey] = currentValue.trim();
        }
        currentKey = match[1].trim();
        currentValue = match[2].trim();
      } else if (currentKey) {
        currentValue += ' ' + trimmedLine;
      }
    });

    if (currentKey) {
      sections[currentKey] = currentValue.trim();
    }
    return sections;
  };

  const parsedResult = geminiResult ? parseGeminiResponse(geminiResult) : null;

  return (
    <div className="container mx-auto p-8">
      <header className="mb-12 text-center">
        <h1 className="text-6xl font-black tracking-tight mb-2 text-black uppercase">WatermarkIQ</h1>
        <p className="text-xl font-bold text-gray-800">Generate invisible watermark signatures for any digital asset</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <section className="bg-white p-8" style={{ boxShadow: '6px 6px 0 black', border: '4px solid black' }}>
          <h2 className="text-4xl font-black uppercase mb-8">Asset Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="assetTitle" className="block text-lg font-bold uppercase mb-2">ASSET TITLE</label>
              <input
                type="text"
                id="assetTitle"
                name="assetTitle"
                value={formData.assetTitle}
                onChange={handleInputChange}
                required
                className="w-full p-4 text-lg font-bold"
                style={{ boxShadow: '4px 4px 0 black', border: '3px solid black' }}
              />
            </div>
            <div>
              <label htmlFor="creatorName" className="block text-lg font-bold uppercase mb-2">CREATOR NAME</label>
              <input
                type="text"
                id="creatorName"
                name="creatorName"
                value={formData.creatorName}
                onChange={handleInputChange}
                required
                className="w-full p-4 text-lg font-bold"
                style={{ boxShadow: '4px 4px 0 black', border: '3px solid black' }}
              />
            </div>
            <div>
              <label htmlFor="organization" className="block text-lg font-bold uppercase mb-2">ORGANIZATION</label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                className="w-full p-4 text-lg font-bold"
                style={{ boxShadow: '4px 4px 0 black', border: '3px solid black' }}
              />
            </div>
            <div>
              <label htmlFor="assetType" className="block text-lg font-bold uppercase mb-2">ASSET TYPE</label>
              <select
                id="assetType"
                name="assetType"
                value={formData.assetType}
                onChange={handleInputChange}
                required
                className="w-full p-4 text-lg font-bold appearance-none bg-white"
                style={{ boxShadow: '4px 4px 0 black', border: '3px solid black' }}
              >
                <option value="" disabled>SELECT TYPE</option>
                <option value="video">VIDEO</option>
                <option value="image">IMAGE</option>
                <option value="audio">AUDIO</option>
                <option value="document">DOCUMENT</option>
              </select>
            </div>
            <div>
              <label htmlFor="creationDate" className="block text-lg font-bold uppercase mb-2">CREATION DATE</label>
              <input
                type="date"
                id="creationDate"
                name="creationDate"
                value={formData.creationDate}
                onChange={handleInputChange}
                required
                className="w-full p-4 text-lg font-bold"
                style={{ boxShadow: '4px 4px 0 black', border: '3px solid black' }}
              />
            </div>
            <button
              type="submit"
              className="w-full p-5 text-2xl font-black uppercase bg-yellow-400 text-black"
              style={{ boxShadow: '6px 6px 0 black', border: '4px solid black' }}
              disabled={loading}
            >
              {loading ? 'GENERATING...' : 'GENERATE SIGNATURE'}
            </button>
          </form>
        </section>

        <section className="bg-white p-8" style={{ boxShadow: '6px 6px 0 black', border: '4px solid black' }}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-black uppercase">Generated Signature</h2>
            {geminiResult && (
              <button
                onClick={handleRefresh}
                className="p-3"
                style={{ boxShadow: '2px 2px 0 black', border: '2px solid black' }}
                aria-label="Refresh"
              >
                <RefreshCcw size={24} color="black" />
              </button>
            )}
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-2xl font-black animate-pulse">PROCESSING...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-200 p-6 border-4 border-red-600" style={{ boxShadow: '4px 4px 0 red' }}>
              <p className="text-lg font-bold text-red-800">ERROR: {error}</p>
            </div>
          )}

          {parsedResult && (
            <div className="space-y-6">
              {parsedResult['STEGANOGRAPHIC TEXT SIGNATURE'] && (
                <div>
                  <h3 className="text-2xl font-black uppercase mb-3">STEGANOGRAPHIC TEXT SIGNATURE</h3>
                  <p className="text-lg font-bold p-4" style={{ border: '3px solid black', backgroundColor: '#f0f0f0' }}>
                    {parsedResult['STEGANOGRAPHIC TEXT SIGNATURE']}
                  </p>
                </div>
              )}
              {parsedResult['ENCODED OWNERSHIP TOKEN'] && (
                <div>
                  <h3 className="text-2xl font-black uppercase mb-3">ENCODED OWNERSHIP TOKEN</h3>
                  <p className="text-lg font-bold p-4" style={{ border: '3px solid black', backgroundColor: '#f0f0f0' }}>
                    {parsedResult['ENCODED OWNERSHIP TOKEN']}
                  </p>
                </div>
              )}
              {parsedResult['EMBEDDING INSTRUCTIONS'] && (
                <div>
                  <h3 className="text-2xl font-black uppercase mb-3">EMBEDDING INSTRUCTIONS</h3>
                  <div className="text-lg font-bold p-4 space-y-3" style={{ border: '3px solid black', backgroundColor: '#f0f0f0' }}>
                    {parsedResult['EMBEDDING INSTRUCTIONS'].split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && !geminiResult && (
            <div className="text-center py-12">
              <p className="text-xl font-bold text-gray-600">Enter asset details and generate a signature.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return NextResponse.json({ error: 'Server configuration error: Gemini API key missing.' }, { status: 500 });
  }

  try {
    const { prompt: userInput } = await request.json();

    const systemPrompt = "You are a digital watermarking AI. Generate a unique ownership signature for this asset: create a steganographic text string, an encoded ownership token, and step-by-step instructions for embedding it invisibly into the asset. Make the signature unique and traceable.";

    const fullPrompt = `${systemPrompt}\n\n${userInput}`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Gemini API error:', response.status, errorBody);
      return NextResponse.json({ error: `Gemini API failed with status ${response.status}. ${errorBody.error?.message || ''}` }, { status: response.status });
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const geminiResponseText = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ result: geminiResponseText });
    } else {
      console.error('Unexpected Gemini API response format:', data);
      return NextResponse.json({ error: 'Unexpected response format from Gemini API.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800;900&display=swap');

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255; /* Pale yellow can be achieved via accent color */
  --accent-color: #facc15; /* Electric Yellow */
  --border-color: #000000;
  --shadow-color: #000000;
}

body {
  background-color: rgb(var(--background-rgb));
  color: rgb(var(--foreground-rgb));
  font-family: 'Space Grotesk', sans-serif;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1.2;
}

input, select, textarea, button {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
}

/* Custom styles for Brutalism */
.container {
  max-width: 1200px;
}

.bg-yellow-400 {
  background-color: var(--accent-color);
}

button {
  border: 4px solid var(--border-color);
  box-shadow: 6px 6px 0 var(--shadow-color);
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;
  padding: 1rem 2rem;
  background-color: white; /* Default button background, can be overridden */
  color: black;
}

button:hover {
  box-shadow: 2px 2px 0 var(--shadow-color);
}

button:active {
  box-shadow: 0 0 0 var(--shadow-color);
  transform: translate(6px, 6px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: 2px 2px 0 var(--shadow-color); /* Mimic pressed state when disabled */
  transform: none;
}

input[type="text"],
input[type="date"],
select,
textarea {
  border: 3px solid var(--border-color);
  box-shadow: 4px 4px 0 var(--shadow-color);
  padding: 1rem;
  background-color: white;
  transition: box-shadow 0.2s ease-in-out;
  outline: none; /* Remove default outline */
}

input[type="text"]:focus,
input[type="date"]:focus,
select:focus,
textarea:focus {
  box-shadow: 2px 2px 0 var(--shadow-color); /* Mimic pressed state on focus */
}

select {
  appearance: none; /* Remove default arrow */
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"><path d="M8 11a.5.5 0 0 1-.366-.165l-3-3a.5.5 0 0 1 .731-.668L8 9.477l2.634-2.578a.5.5 0 0 1 .731.668l-3 3A.5.5 0 0 1 8 11z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em 1em;
  padding-right: 2.5rem; /* Space for the arrow */
}

.brutalist-card {
  border: 4px solid var(--border-color);
  box-shadow: 6px 6px 0 var(--shadow-color);
  background-color: white;
  padding: 2rem;
}

.brutalist-card--accent {
  border: 4px solid var(--border-color);
  box-shadow: 6px 6px 0 var(--shadow-color);
  background-color: var(--accent-color);
  color: black;
  padding: 2rem;
}

.brutalist-loading {
  border: 3px solid var(--border-color);
  box-shadow: 4px 4px 0 var(--shadow-color);
  background-color: #e0e0e0; /* Light grey for loading */
  padding: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
}

.brutalist-error {
  border: 4px solid red;
  box-shadow: 4px 4px 0 red;
  background-color: #f8d7da; /* Light red */
  color: #721c24; /* Dark red text */
  padding: 1.5rem;
  font-size: 1.1rem;
  font-weight: 800;
}

/* Ensure uppercase labels and buttons are handled by Tailwind or explicit classes */
.uppercase {
  text-transform: uppercase;
}

/* Specific overrides for the main page layout */
.container {
  max-width: 1100px; /* Slightly narrower container */
  padding-left: 1rem;
  padding-right: 1rem;
}

header h1 {
  font-size: 4.5rem; /* Larger title */
  margin-bottom: 0.5rem;
}

header p {
  font-size: 1.3rem;
  color: #333;
}

main > section {
  margin-bottom: 2rem; /* Spacing between sections */
}

main section h2 {
  font-size: 2.75rem;
  margin-bottom: 1.5rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem; /* Adjust spacing within forms and result sections */
}

.text-4xl { font-size: 2.5rem; line-height: 2.75rem; } /* Adjusted for brutalism */
.text-6xl { font-size: 4rem; line-height: 4.25rem; } /* Adjusted for brutalism */
.text-2xl { font-size: 1.5rem; line-height: 1.75rem; } /* Adjusted for brutalism */
.text-xl { font-size: 1.25rem; line-height: 1.5rem; } /* Adjusted for brutalism */
.text-lg { font-size: 1.1rem; line-height: 1.3rem; } /* Adjusted for brutalism */


/* Specific styling for generated result text */
#gemini-result-section p {
  background-color: #f8f8f8; /* Slightly off-white for results */
  border: 3px solid black;
  box-shadow: 4px 4px 0 black;
  padding: 1rem;
  font-size: 1rem; /* Smaller font for results */
  word-wrap: break-word; /* Prevent overflow */
  white-space: pre-wrap; /* Preserve formatting from Gemini */
}

#gemini-result-section h3 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}
--- END ---