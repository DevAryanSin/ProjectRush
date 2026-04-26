# Brief
PlatformSpy identifies and mitigates digital content misappropriation risks for sports organizations by analyzing platform-specific IP theft vulnerabilities and offering actionable defensive strategies.

# Opportunities
- Differentiation: Unique hacker terminal UI and specialized focus on digital sports media IP.
- Problem Solving Approach: Proactive risk assessment and tailored defense recommendations for content creators.
- USP: Near real-time content authentication and anomaly detection for digital assets across various platforms.

# Features
- Platform Risk Profiling: Generates detailed IP theft risk assessments for user-specified platforms.
- IP Enforcement Ratings: Provides an A-F grade for platform IP enforcement with detailed reasoning.
- Common Theft Vectors: Identifies the top 3 methods of content theft specific to each platform.
- Personal Exposure Level: Assesses the user's individual risk based on account size and content type.
- Defensive Tactics: Offers 4 actionable, platform-specific strategies to protect digital assets.
- Interactive Terminal UI: Immersive, retro-futuristic hacker aesthetic with green-on-black theme.
- Dynamic Loading States: Visual feedback during analysis and data fetching.
- Responsive Design: Optimized for both desktop and mobile viewing.

# Technologies
- Frontend: Next.js 16, React, TypeScript, Tailwind CSS
- Icons: Lucide React
- Backend API: Next.js API Routes (app/api/generate/route.ts)
- AI Integration: Gemini API (gemini-2.5-flash)
- Styling: Custom CSS variables, Monospace fonts (Google Fonts)

--- FILE: app/page.tsx ---
'use client';

import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface PlatformInfo {
  riskProfile: string;
}

export default function HomePage() {
  const [platform, setPlatform] = useState('');
  const [contentType, setContentType] = useState('');
  const [accountSize, setAccountSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<PlatformInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !contentType || !accountSize) {
      setError('All fields are required. Please fill them out.');
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);

    const prompt = `
      Platform: ${platform}
      Content Type: ${contentType}
      Account Size/Reach: ${accountSize}
    `;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch risk profile.');
      }

      const data = await res.json();
      setResponse({ riskProfile: data.result });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text: string) => {
    const sections: { [key: string]: string } = {};
    let currentSection = 'Risk Profile';
    let sectionContent = '';

    const lines = text.split('\n');
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('# ')) {
        if (currentSection && sectionContent) {
          sections[currentSection] = sectionContent.trim();
        }
        currentSection = trimmedLine.substring(2).trim();
        sectionContent = '';
      } else if (currentSection) {
        sectionContent += line + '\n';
      }
    });
    if (currentSection && sectionContent) {
      sections[currentSection] = sectionContent.trim();
    }

    return (
      <div>
        {Object.entries(sections).map(([title, content], index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-bold text-accent mb-2">{title}:</h3>
            <pre className="whitespace-pre-wrap text-primary-green">{content}</pre>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 flex items-center">
        <Terminal className="h-10 w-10 mr-4 text-accent" />
        <h1 className="text-4xl font-bold text-primary-green">PlatformSpy</h1>
      </header>
      <p className="text-dim-green mb-8 text-lg">Input any platform name — get its content theft risk profile</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center w-full max-w-xl">
          <label htmlFor="platform" className="w-48 text-primary-green mr-4">Platform:</label>
          <div className="flex-grow border-2 border-accent p-1 bg-black">
            <input
              type="text"
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g., YouTube, TikTok, Instagram"
              className="w-full bg-black text-primary-green p-2 focus:outline-none placeholder-dim-green"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center w-full max-w-xl">
          <label htmlFor="contentType" className="w-48 text-primary-green mr-4">Content Type:</label>
          <div className="flex-grow border-2 border-accent p-1 bg-black">
            <input
              type="text"
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              placeholder="e.g., Match highlights, Player interviews"
              className="w-full bg-black text-primary-green p-2 focus:outline-none placeholder-dim-green"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center w-full max-w-xl">
          <label htmlFor="accountSize" className="w-48 text-primary-green mr-4">Account Size/Reach:</label>
          <div className="flex-grow border-2 border-accent p-1 bg-black">
            <input
              type="text"
              id="accountSize"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              placeholder="e.g., Large (1M+ followers), Medium (100K-1M)"
              className="w-full bg-black text-primary-green p-2 focus:outline-none placeholder-dim-green"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center w-full max-w-xl">
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-2 border-2 border-accent text-accent bg-black hover:bg-dim-green disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'PROCESSING...' : '[> ANALYZE]'}
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <div className="mt-12 text-center">
          <p className="text-accent animate-pulse">Calculating risk profile...</p>
        </div>
      )}

      {error && (
        <div className="mt-12 text-center p-4 border-2 border-red-500 bg-red-900 text-white">
          <p>Error: {error}</p>
        </div>
      )}

      {response && !loading && (
        <div className="mt-12 p-6 border-2 border-accent bg-black text-primary-green">
          <h2 className="text-2xl font-bold text-accent mb-6">[> ANALYSIS RESULTS]</h2>
          {formatResponse(response.riskProfile)}
        </div>
      )}
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

const GEMINI_API_ENDPOINT = process.env.GEMINI_API_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not set.');
    return NextResponse.json({ error: 'Server configuration error: API key missing.' }, { status: 500 });
  }

  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 });
  }

  const systemPrompt = `You are a platform IP risk analyst. For this platform, generate a risk profile covering: IP enforcement reputation (A-F grade with reasoning), top 3 content theft vectors specific to this platform, exposure risk for this account size, and 4 platform-specific defensive tactics. Be specific to this platform's actual policies and culture.`;

  const fullPrompt = `${systemPrompt}\n\nUser Input:\n${prompt}`;

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
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
      console.error('Gemini API Error:', errorBody);
      throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      const geminiResponseText = data.candidates[0].content.parts.map((part: any) => part.text).join('');
      return NextResponse.json({ result: geminiResponseText });
    } else {
      console.error('Unexpected Gemini API response format:', data);
      throw new Error('Received an unexpected response format from Gemini API.');
    }

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');

:root {
  --background: #0a0f0a;
  --primary-green: #39ff14; /* Bright Green */
  --dim-green: #008f11;    /* Darker Green */
  --accent: #00ffff;       /* Bright Cyan */
  --white: #ffffff;
}

body {
  background-color: var(--background);
  color: var(--primary-green);
  font-family: 'Fira Code', monospace;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--primary-green);
  font-family: 'Fira Code', monospace;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.container {
  max-width: 960px;
}

/* Terminal specific styles */
.terminal-window {
  border: 2px solid var(--accent);
  box-shadow: 0 0 15px var(--accent);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
}

.terminal-input {
  background-color: var(--background);
  border: 1px dashed var(--dim-green);
  color: var(--primary-green);
  caret-color: var(--accent);
  padding: 8px 12px;
  font-family: 'Fira Code', monospace;
}

.terminal-input:focus {
  outline: none;
  border-color: var(--accent);
}

.terminal-button {
  background-color: var(--background);
  border: 2px solid var(--accent);
  color: var(--accent);
  padding: 8px 16px;
  font-family: 'Fira Code', monospace;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.terminal-button:hover {
  background-color: var(--dim-green);
  color: var(--primary-green);
}

.terminal-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-animation {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Override default Tailwind styles if necessary */
.bg-black {
  background-color: var(--background) !important;
}

.text-primary-green {
  color: var(--primary-green) !important;
}

.text-dim-green {
  color: var(--dim-green) !important;
}

.text-accent {
  color: var(--accent) !important;
}

.border-accent {
  border-color: var(--accent) !important;
}

.border-dim-green {
  border-color: var(--dim-green) !important;
}

/* Ensure monospace everywhere */
* {
  font-family: 'Fira Code', monospace !important;
}

pre {
  white-space: pre-wrap;       /* css-3 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4 to 6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
  font-family: 'Fira Code', monospace !important;
}

/* Specific overrides for form elements */
input[type="text"] {
  font-family: 'Fira Code', monospace !important;
  background-color: var(--background);
  color: var(--primary-green);
  caret-color: var(--accent);
  padding: 0.5rem 0.75rem;
  border: none;
  outline: none;
  width: 100%;
}

input[type="text"]:focus {
  outline: none;
}
--- END ---