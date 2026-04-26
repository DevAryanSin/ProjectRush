# Brief
StaffPulse provides instant, synthesized crisis response coordination for hospitality venues, bridging communication gaps between staff and emergency services.

# Opportunities
- Differentiation: Real-time, AI-powered synthesis of fragmented crisis communications.
- Problem Solving Approach: Centralizes critical incident information, enabling rapid, informed decision-making.
- USP: Live team status synthesis and AI-driven redeployment recommendations for optimized crisis management.

# Features
- Real-time Staff Check-in Forms
- AI-powered Crisis Situation Synthesis
- Visual Team Status Map
- Zone Coverage Assessment
- Identification of Coverage Gaps
- Redeployment Recommendations
- Loading and Error State Handling
- Responsive Neomorphism UI

# Technologies
- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Gemini API
- Lucide React Icons

--- FILE: app/page.tsx ---
'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !status || !observations) {
      setError('All fields are required.');
      return;
    }
    setError(null);
    setLoading(true);
    setResponse(null);

    const userInput = `Name: ${name}, Location: ${location}, Status: ${status}, Observations: ${observations}`;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.result);
    } catch (err: any) {
      console.error('Error fetching from API:', err);
      setError('Failed to get crisis synthesis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setName('');
    setLocation('');
    setStatus('');
    setObservations('');
    setResponse(null);
    setError(null);
  };

  useEffect(() => {
    document.title = 'StaffPulse';
  }, []);

  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center font-nunito">
      <h1 className="text-5xl font-bold text-gray-700 mb-2">StaffPulse</h1>
      <p className="text-lg text-gray-600 mb-12">Staff check-in during a crisis — get a live team status synthesis</p>

      <div className="neomorphic-card w-full max-w-lg p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="neomorphic-input w-full"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="neomorphic-input w-full"
              placeholder="Current Location (e.g., Kitchen, Floor 3)"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-lg font-medium text-gray-700 mb-2">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="neomorphic-select w-full"
            >
              <option value="" disabled>Select Status</option>
              <option value="Safe">Safe</option>
              <option value="Assisting">Assisting</option>
              <option value="Investigating">Investigating</option>
              <option value="Needs Help">Needs Help</option>
            </select>
          </div>
          <div>
            <label htmlFor="observations" className="block text-lg font-medium text-gray-700 mb-2">Observations</label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="neomorphic-textarea w-full"
              rows={4}
              placeholder="What you see, any immediate threats or needs..."
            ></textarea>
          </div>

          <div className="flex justify-between">
            <button type="submit" className="neomorphic-button" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Status'}
            </button>
            <button type="button" className="neomorphic-button-secondary" onClick={handleClear}>
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="neomorphic-card w-full max-w-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Synthesizing crisis information...</p>
        </div>
      )}

      {error && (
        <div className="neomorphic-card w-full max-w-lg p-8 bg-red-100 border border-red-300">
          <p className="text-red-700 font-medium">Error: {error}</p>
        </div>
      )}

      {response && !loading && (
        <div className="neomorphic-card w-full max-w-lg p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">Crisis Synthesis</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            {response.split('\n\n').map((section, i) => {
              const lines = section.split('\n');
              if (lines.length > 1) {
                const heading = lines[0];
                const content = lines.slice(1).join('\n');
                if (heading.includes(':')) {
                  // Assume key: value pairs for specific sections
                  return (
                    <div key={i}>
                      <h3 className="text-2xl font-semibold text-amber-600 mb-3">{heading.split(':')[0]}</h3>
                      <p>{content.trim()}</p>
                    </div>
                  );
                } else {
                   // Simple section header and content
                  return (
                    <div key={i}>
                      <h3 className="text-2xl font-semibold text-amber-600 mb-3">{heading}</h3>
                      <p>{content.trim()}</p>
                    </div>
                  );
                }
              } else {
                // Handle single-line sections or potential empty lines
                return <p key={i}>{section.trim()}</p>;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not set.');
    return NextResponse.json({ result: 'Internal server error: API key not configured.' }, { status: 500 });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const systemPrompt = "You are a crisis coordination AI. Synthesize these staff check-in updates into: (1) Team Status Map (name, location, status for each), (2) Zone Coverage Assessment (which areas are covered/uncovered), (3) Top 3 Coverage Gaps, (4) Redeployment Recommendations. Be tactical and concise.";

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nStaff Updates:\n${prompt}` },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API Error: ${response.status} - ${errorText}`);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      const geminiResponseText = data.candidates[0].content.parts.map((part: any) => part.text).join('\n');
      return NextResponse.json({ result: geminiResponseText });
    } else {
      console.error('Unexpected Gemini API response format:', data);
      return NextResponse.json({ result: 'Could not parse Gemini response.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ result: `Error communicating with crisis AI. Please try again. Details: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Font Import */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Poppins:wght@400;600&display=swap');

:root {
  --background: #e0e5ec;
  --text-primary: #333;
  --shadow-light: #ffffff;
  --shadow-dark: rgba(0, 0, 0, 0.15);
  --accent: #4e80ee; /* Soft Blue */
  --accent-hover: #3b6ac9;
  --button-secondary-bg: #d0d5db;
  --button-secondary-hover-bg: #c0c5cc;
}

body {
  font-family: 'Nunito', sans-serif;
  background-color: var(--background);
  color: var(--text-primary);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: var(--text-primary);
}

.neomorphic-card {
  background: var(--background);
  border-radius: 20px;
  box-shadow:
    -5px -5px 10px var(--shadow-light),
    5px 5px 10px var(--shadow-dark);
}

.neomorphic-card.inset {
  box-shadow:
    inset -3px -3px 7px var(--shadow-light),
    inset 3px 3px 7px var(--shadow-dark);
}

.neomorphic-input,
.neomorphic-textarea,
.neomorphic-select {
  background: var(--background);
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  box-shadow:
    inset -3px -3px 7px var(--shadow-light),
    inset 3px 3px 7px var(--shadow-dark);
  transition: all 0.2s ease-in-out;
  color: var(--text-primary);
  font-size: 1rem;
}

.neomorphic-input:focus,
.neomorphic-textarea:focus,
.neomorphic-select:focus {
  outline: none;
  box-shadow:
    inset -4px -4px 9px var(--shadow-light),
    inset 4px 4px 9px var(--shadow-dark),
    0 0 0 2px var(--accent); /* Subtle focus ring */
}

.neomorphic-textarea {
  resize: vertical;
}

.neomorphic-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%234e80ee'%3E%3Cpath d='M8 11a.75.75 0 0 1 .53.22l3.5-3.5a.75.75 0 0 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 .53.22z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 16px;
}


.neomorphic-button {
  background-color: var(--accent);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  box-shadow:
    -4px -4px 8px var(--shadow-light),
    4px 4px 8px var(--shadow-dark);
}

.neomorphic-button:hover:not(:disabled) {
  background-color: var(--accent-hover);
  box-shadow:
    inset -3px -3px 7px var(--shadow-light),
    inset 3px 3px 7px var(--shadow-dark);
}

.neomorphic-button:active:not(:disabled) {
    box-shadow: inset 0px 0px 5px rgba(0,0,0,0.2);
}

.neomorphic-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}


.neomorphic-button-secondary {
  background-color: var(--button-secondary-bg);
  color: var(--text-primary);
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  box-shadow:
    -4px -4px 8px var(--shadow-light),
    4px 4px 8px var(--shadow-dark);
}

.neomorphic-button-secondary:hover {
  background-color: var(--button-secondary-hover-bg);
  box-shadow:
    inset -3px -3px 7px var(--shadow-light),
    inset 3px 3px 7px var(--shadow-dark);
}

.neomorphic-button-secondary:active {
    box-shadow: inset 0px 0px 5px rgba(0,0,0,0.2);
}

.prose {
  /* Basic styling for response text */
  font-size: 1rem;
  line-height: 1.7;
}

.prose h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--accent); /* Use accent for section titles */
}

.prose p {
  margin-bottom: 1rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
  h1 {
    font-size: 3rem;
  }
  p.text-lg.text-gray-600.mb-12 {
    font-size: 1rem;
    margin-bottom: 30px;
  }
  .neomorphic-card {
    padding: 25px;
  }
  .neomorphic-button, .neomorphic-button-secondary {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  .prose h3 {
      font-size: 1.3rem;
  }
}
--- END ---