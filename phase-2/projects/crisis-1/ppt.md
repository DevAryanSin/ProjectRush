# Brief
PanicTranslate provides an immediate, structured response to guest emergencies by converting panicked messages into calm, actionable reports for responders, ensuring critical information is conveyed rapidly and clearly.

# Opportunities
- Differentiation: Provides a specialized, AI-driven solution for a critical hospitality need.
- Problem Solving Approach: Leverages AI for rapid information extraction and communication streamlining during high-stress events.
- USP: Instantaneous conversion of chaotic guest distress into organized, life-saving intelligence with a striking, unignorable UI.

# Features
- AI-powered message triage
- Structured emergency fact extraction (incident type, location, people affected, severity, needs)
- Calm responder briefing generation
- Brutalist UI for maximum impact and clarity
- Responsive design for all devices
- Client-side API interaction with server-side Gemini processing
- Loading and error state handling

# Technologies
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS
- Lucide React for icons
- Gemini API (gemini-2.5-flash)

Constraints:
- No markdown like ** or ##
- No code
- Clean bullet points only
- Keep concise
--- FILE: app/page.tsx ---
'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, CheckCircle, Ban } from 'lucide-react';

interface GeminiResponse {
  result: string;
}

interface ParsedResponse {
  incidentType: string | null;
  location: string | null;
  peopleAffected: string | null;
  severity: string | null;
  immediateNeeds: string | null;
  callerStatus: string | null;
  responderBriefing: string | null;
}

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResponse, setParsedResponse] = useState<ParsedResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setParsedResponse(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      parseGeminiResponse(data.result);
    } catch (err) {
      console.error('Error submitting message:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const parseGeminiResponse = (geminiText: string) => {
    const response: ParsedResponse = {
      incidentType: null,
      location: null,
      peopleAffected: null,
      severity: null,
      immediateNeeds: null,
      callerStatus: null,
      responderBriefing: null,
    };

    const lines = geminiText.split('\n');
    let currentSection: keyof ParsedResponse | null = null;

    lines.forEach(line => {
      if (line.startsWith('(1) Incident Type:')) {
        response.incidentType = line.replace('(1) Incident Type:', '').trim();
        currentSection = 'incidentType';
      } else if (line.startsWith('(2) Location:')) {
        response.location = line.replace('(2) Location:', '').trim();
        currentSection = 'location';
      } else if (line.startsWith('(3) Number of People Affected:')) {
        response.peopleAffected = line.replace('(3) Number of People Affected:', '').trim();
        currentSection = 'peopleAffected';
      } else if (line.startsWith('(4) Severity 1-5:')) {
        response.severity = line.replace('(4) Severity 1-5:', '').trim();
        currentSection = 'severity';
      } else if (line.startsWith('(5) Immediate Needs:')) {
        response.immediateNeeds = line.replace('(5) Immediate Needs:', '').trim();
        currentSection = 'immediateNeeds';
      } else if (line.startsWith('(6) Caller Status:')) {
        response.callerStatus = line.replace('(6) Caller Status:', '').trim();
        currentSection = 'callerStatus';
      } else if (line.startsWith('Responder Briefing:')) {
        response.responderBriefing = line.replace('Responder Briefing:', '').trim();
        currentSection = 'responderBriefing';
      } else if (currentSection && response[currentSection] !== null && !line.trim().startsWith('(')) {
        // Append to the current section if it's a continuation
        const currentVal = response[currentSection] as string;
        response[currentSection] = `${currentVal} ${line.trim()}`;
      } else if (line.startsWith('Calm re-statement for responders:')) {
        // Alternative phrasing if Gemini uses it
        response.responderBriefing = line.replace('Calm re-statement for responders:', '').trim();
        currentSection = 'responderBriefing';
      }
    });

    setParsedResponse(response);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-6xl font-black uppercase mb-2 leading-tight">PanicTranslate</h1>
        <p className="text-xl font-bold uppercase">Convert a panicked guest message into a calm structured emergency report</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="form-section p-8">
          <h2 className="text-3xl font-black uppercase mb-6 text-center">Enter Crisis Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="input-group">
              <label htmlFor="message" className="block text-2xl font-black uppercase mb-2">
                PANICKED MESSAGE / TRANSCRIPT
              </label>
              <textarea
                id="message"
                rows={8}
                className="w-full p-4 text-lg font-bold"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full p-5 text-3xl font-black uppercase bg-red-500 text-white disabled:bg-gray-400"
              disabled={isLoading || !message}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" /> PROCESSING
                </span>
              ) : (
                'TRANSLATE NOW'
              )}
            </button>
          </form>
        </section>

        <section className="results-section p-8">
          <h2 className="text-3xl font-black uppercase mb-6 text-center">Emergency Report</h2>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-20 w-20 animate-spin text-red-500 mb-4" />
              <p className="text-2xl font-bold uppercase">Analyzing... Stand By...</p>
            </div>
          )}
          {error && (
            <div className="error-message p-6 flex flex-col items-center justify-center text-center">
              <Ban className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-3xl font-black uppercase mb-4">ERROR</p>
              <p className="text-xl font-bold">{error}</p>
            </div>
          )}
          {parsedResponse && (
            <div className="parsed-response">
              {parsedResponse.responderBriefing && (
                <div className="responder-briefing mb-8 p-6">
                  <h3 className="text-4xl font-black uppercase mb-4 text-red-500">RESPONDER BRIEFING</h3>
                  <p className="text-2xl font-bold leading-relaxed">{parsedResponse.responderBriefing}</p>
                </div>
              )}

              <div className="fact-list grid grid-cols-1 gap-y-4">
                {parsedResponse.incidentType && (
                  <div className="fact-item">
                    <p className="label text-xl font-black uppercase">INCIDENT TYPE</p>
                    <p className="value text-2xl font-bold">{parsedResponse.incidentType}</p>
                  </div>
                )}
                {parsedResponse.location && (
                  <div className="fact-item">
                    <p className="label text-xl font-black uppercase">LOCATION</p>
                    <p className="value text-2xl font-bold">{parsedResponse.location}</p>
                  </div>
                )}
                {parsedResponse.peopleAffected && (
                  <div className="fact-item">
                    <p className="label text-xl font-black uppercase">PEOPLE AFFECTED</p>
                    <p className="value text-2xl font-bold">{parsedResponse.peopleAffected}</p>
                  </div>
                )}
                {parsedResponse.severity && (
                  <div className="fact-item">
                    <p className="label text-xl font-black uppercase">SEVERITY (1-5)</p>
                    <p className="value text-2xl font-bold">{parsedResponse.severity}</p>
                  </div>
                )}
                {parsedResponse.immediateNeeds && (
                  <div className="fact-item">
                    <p className="label text-xl font-black uppercase">IMMEDIATE NEEDS</p>
                    <p className="value text-2xl font-bold">{parsedResponse.immediateNeeds}</p>
                  </div>
                )}
                 {parsedResponse.callerStatus && (
                  <div className="fact-item">
                    <p className="label text-xl font-black uppercase">CALLER STATUS</p>
                    <p className="value text-2xl font-bold">{parsedResponse.callerStatus}</p>
                  </div>
                )}
              </div>
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
    return NextResponse.json({ message: 'Server configuration error: Gemini API key not found.' }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ message: 'No prompt provided.' }, { status: 400 });
    }

    const systemPrompt = "You are an emergency triage AI. Extract structured facts from this panicked message: (1) Incident Type, (2) Location, (3) Number of People Affected, (4) Severity 1-5, (5) Immediate Needs, (6) Caller Status. Then write a calm 2-sentence responder briefing. Ignore emotional noise, focus only on actionable facts.";
    const fullPrompt = `${systemPrompt}\n\nUser Input:\n${prompt}`;

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
      const errorBody = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorBody}`);
      throw new Error(`Failed to get response from Gemini API. Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      const geminiResponseText = data.candidates[0].content.parts.map((part: any) => part.text).join('');
      return NextResponse.json({ result: geminiResponseText });
    } else {
      console.error('Unexpected Gemini API response format:', data);
      throw new Error('Received an unexpected response format from Gemini.');
    }

  } catch (error) {
    console.error('Error in /api/generate route:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Font - Impact for headings, Space Grotesk for body */
@import url('https://fonts.googleapis.com/css2?family=Impact&family=Space+Grotesk:wght@400;700;800&display=swap');

:root {
  --primary-accent: #FF0000; /* Loud Red */
  --background-light: #FFFFFF;
  --text-dark: #000000;
}

body {
  font-family: 'Space Grotesk', sans-serif;
  background-color: var(--background-light);
  color: var(--text-dark);
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Impact', sans-serif;
  font-weight: 900; /* Extra bold */
  text-transform: uppercase;
  color: var(--text-dark);
}

.container {
  max-width: 1280px;
}

/* Brutalist Styles */
.container {
  padding: 24px; /* Responsive padding */
}

header {
  margin-bottom: 32px;
  padding-bottom: 16px; /* Add some space below the heading */
}

h1 {
  font-size: 4rem; /* Oversized heading */
  line-height: 1.1;
  margin-bottom: 8px;
  text-shadow: 4px 4px 0 var(--primary-accent); /* Intentional shadow */
}

p.text-xl {
  font-size: 1.4rem; /* Larger body text */
  font-weight: 800;
}

section {
  background-color: var(--background-light);
  border: 4px solid var(--text-dark);
  box-shadow: 6px 6px 0 var(--text-dark);
  padding: 32px; /* Generous padding */
}

.form-section, .results-section {
  min-height: 60vh; /* Ensure sections have some height */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically */
}

h2 {
  font-size: 2.5rem; /* Large section titles */
  margin-bottom: 24px;
  text-align: center;
  border-bottom: 4px solid var(--text-dark);
  padding-bottom: 12px;
  display: inline-block; /* Make border only as wide as text */
}

.input-group label.block {
  font-size: 1.5rem; /* Larger labels */
  margin-bottom: 12px;
  line-height: 1;
}

textarea,
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 16px;
  font-size: 1.25rem; /* Larger input text */
  font-weight: 800;
  border: 4px solid var(--text-dark);
  box-shadow: 4px 4px 0 var(--text-dark);
  border-radius: 0; /* NO rounded corners */
  background-color: var(--background-light);
  margin-bottom: 0; /* Remove default margin if any */
}

textarea:focus,
input:focus {
  outline: none;
  border-color: var(--primary-accent);
  box-shadow: 4px 4px 0 var(--primary-accent);
}

button {
  border: 4px solid var(--text-dark);
  box-shadow: 6px 6px 0 var(--text-dark);
  border-radius: 0; /* NO rounded corners */
  padding: 16px 24px;
  font-size: 1.5rem; /* Larger buttons */
  font-weight: 900;
  text-transform: uppercase;
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
  background-color: var(--background-light);
  color: var(--text-dark);
}

button:hover:not(:disabled) {
  box-shadow: 2px 2px 0 var(--text-dark); /* Feels like pressing */
  transform: translate(4px, 4px);
}

button:disabled {
  background-color: #ccc;
  border-color: #999;
  box-shadow: 4px 4px 0 #999;
  cursor: not-allowed;
}

/* Specific Styles for Loading/Error */
.error-message {
  border-color: var(--primary-accent);
  box-shadow: 6px 6px 0 var(--primary-accent);
  background-color: #fff0f0; /* Light red background */
}
.error-message p.text-3xl {
  font-size: 2.25rem;
  line-height: 1;
}
.error-message p.text-xl {
  font-size: 1.25rem;
}


/* Results Section Specifics */
.results-section h2 {
  color: var(--primary-accent);
  border-color: var(--primary-accent);
}

.responder-briefing {
  border: 4px solid var(--primary-accent);
  box-shadow: 6px 6px 0 var(--primary-accent);
  background-color: #fff0f0;
}

.responder-briefing h3 {
  font-size: 2.25rem;
  color: var(--primary-accent);
}
.responder-briefing p {
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1.6;
}

.fact-list .fact-item {
  margin-bottom: 20px; /* Space between facts */
}

.fact-list .label {
  font-size: 1.1rem;
  margin-bottom: 6px;
  color: #555; /* Slightly muted label */
}

.fact-list .value {
  font-size: 1.5rem; /* Larger value text */
  font-weight: 800;
  line-height: 1.3;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  h1 {
    font-size: 3rem;
  }
  h2 {
    font-size: 2rem;
  }
  button {
    font-size: 1.25rem;
    padding: 12px 18px;
  }
  .input-group label.block {
    font-size: 1.2rem;
  }
  textarea,
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    font-size: 1.1rem;
    padding: 12px;
  }
  .responder-briefing p {
    font-size: 1.1rem;
  }
  .fact-list .value {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 16px;
  }
  header {
    margin-bottom: 24px;
  }
  h1 {
    font-size: 2.5rem;
  }
  h2 {
    font-size: 1.75rem;
    margin-bottom: 16px;
  }
  button {
    font-size: 1.1rem;
    padding: 10px 15px;
  }
  .form-section, .results-section {
    padding: 24px;
  }
}
--- END ---