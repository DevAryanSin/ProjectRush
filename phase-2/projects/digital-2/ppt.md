# Brief
CloneCourt automates the creation of legal case summaries for sports media copyright infringement. It provides a clear, evidence-based framework to address unauthorized content use swiftly and efficiently.

# Opportunities
- Differentiation: Offers a specialized, AI-driven solution for the unique challenges of digital sports media IP protection.
- Problem Solving Approach: Addresses the critical visibility gap in tracking scattered digital assets, turning a complex problem into a manageable legal process.
- USP: Near real-time detection and AI-generated, actionable legal summaries for rapid response to IP violations.

# Features
- Intuitive Neomorphism UI for a clean, professional user experience.
- AI-powered legal case summary generation via Gemini API.
- Structured output with case title, legal basis, evidence chain, estimated damages, and recommended actions.
- Input form for asset description, publish date, infringing URL, infringement type, and evidence.
- Loading states for a smooth user interaction during AI processing.
- Responsive design for accessibility across devices.

# Technologies
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- Gemini 2.5 Flash API
- Lucide React icons

=== FILE: app/page.tsx ===
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const HomePage: React.FC = () => {
  const [assetDescription, setAssetDescription] = useState('');
  const [originalPublishDate, setOriginalPublishDate] = useState('');
  const [infringingUrl, setInfringingUrl] = useState('');
  const [infringementType, setInfringementType] = useState('');
  const [evidenceAvailable, setEvidenceAvailable] = useState('');
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeminiResponse(null);
    setError(null);

    const prompt = `
      Asset Description: ${assetDescription}
      Original Publish Date: ${originalPublishDate}
      Infringing URL: ${infringingUrl}
      Type of Infringement: ${infringementType}
      Evidence Available: ${evidenceAvailable}
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
      setGeminiResponse(data.result);
    } catch (err: any) {
      console.error('Error fetching Gemini response:', err);
      setError('Failed to generate legal summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simple parsing for better display
  const parseResponse = (text: string) => {
    const lines = text.split('\n');
    let htmlOutput = '';
    let currentSection: string | null = null;

    lines.forEach((line) => {
      if (line.trim() === '') return;

      if (line.startsWith('Case Title:')) {
        htmlOutput += `<h2>${line}</h2>`;
        currentSection = null;
      } else if (line.startsWith('Legal Basis:')) {
        htmlOutput += `<h3>${line}</h3>`;
        currentSection = 'legal_basis';
      } else if (line.startsWith('Evidence Chain:')) {
        htmlOutput += `<h3>${line}</h3>`;
        currentSection = 'evidence_chain';
      } else if (line.startsWith('Estimated Damages:')) {
        htmlOutput += `<h3>${line}</h3>`;
        currentSection = 'estimated_damages';
      } else if (line.startsWith('Recommended Legal Actions:')) {
        htmlOutput += `<h3>${line}</h3>`;
        currentSection = 'legal_actions';
      } else {
        if (currentSection === 'legal_actions') {
          // Handle numbered lists for actions
          if (line.match(/^\d+\.\s/)) {
            htmlOutput += `<p>${line}</p>`;
          } else {
             htmlOutput += `<p><strong>${line.split(':')[0]}:</strong> ${line.split(':')[1] || ''}</p>`;
          }
        } else {
           htmlOutput += `<p>${line}</p>`;
        }
      }
    });
    return <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Head>
        <title>CloneCourt</title>
      </Head>

      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">CloneCourt</h1>
        <p className="text-xl text-gray-600">Build a legal case summary against a content thief in seconds</p>
      </header>

      <main className="neomorphism-card p-6 md:p-10 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-8">Report Infringement</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="assetDescription" className="block text-gray-700 mb-2 font-medium">Asset Description</label>
            <input
              type="text"
              id="assetDescription"
              value={assetDescription}
              onChange={(e) => setAssetDescription(e.target.value)}
              required
              className="neomorphism-input w-full"
              placeholder="e.g., Official NBA Finals Game Footage, 2023"
            />
          </div>

          <div>
            <label htmlFor="originalPublishDate" className="block text-gray-700 mb-2 font-medium">Original Publish Date</label>
            <input
              type="date"
              id="originalPublishDate"
              value={originalPublishDate}
              onChange={(e) => setOriginalPublishDate(e.target.value)}
              required
              className="neomorphism-input w-full"
            />
          </div>

          <div>
            <label htmlFor="infringingUrl" className="block text-gray-700 mb-2 font-medium">Infringing URL</label>
            <input
              type="url"
              id="infringingUrl"
              value={infringingUrl}
              onChange={(e) => setInfringingUrl(e.target.value)}
              required
              className="neomorphism-input w-full"
              placeholder="e.g., https://example.com/stolen-video"
            />
          </div>

          <div>
            <label htmlFor="infringementType" className="block text-gray-700 mb-2 font-medium">Type of Infringement</label>
            <select
              id="infringementType"
              value={infringementType}
              onChange={(e) => setInfringementType(e.target.value)}
              required
              className="neomorphism-input w-full"
            >
              <option value="">Select Type</option>
              <option value="Unauthorized Distribution">Unauthorized Distribution</option>
              <option value="Content Piracy">Content Piracy</option>
              <option value="IP Violation">IP Violation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="evidenceAvailable" className="block text-gray-700 mb-2 font-medium">Evidence Available</label>
            <textarea
              id="evidenceAvailable"
              value={evidenceAvailable}
              onChange={(e) => setEvidenceAvailable(e.target.value)}
              required
              rows={4}
              className="neomorphism-input w-full"
              placeholder="e.g., Screenshots of the infringing content, links to original asset"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className={`neomorphism-button ${loading ? 'neomorphism-button-disabled' : ''}`}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Case Summary'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center mt-8">
            <div className="loader ease-linear rounded-full border-4 border-blue-200 h-12 w-12 mx-auto"></div>
            <p className="mt-4 text-gray-600">Please wait while we build your case summary...</p>
          </div>
        )}

        {error && (
          <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {geminiResponse && !loading && (
          <div className="mt-10 p-6 neomorphism-card-result">
            <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Case Summary</h2>
            <div className="prose max-w-none">
               {parseResponse(geminiResponse)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
;
=== FILE: app/api/generate/route.ts ===
import { NextResponse, NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    return NextResponse.json({ error: 'Internal Server Error: API key not configured.' }, { status: 500 });
  }

  try {
    const { prompt: userInput } = await request.json();

    const systemPrompt = "You are an IP litigation AI. Build a legal case summary for this content theft incident. Include: case title, legal basis (DMCA/copyright law), evidence chain (what they have vs what they need), estimated damages range, and 5 recommended legal actions in priority order. Be precise and actionable.";

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${userInput}` }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API Error: ${response.status} - ${errorBody}`);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const geminiResponseText = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ result: geminiResponseText });
    } else {
      console.error("Unexpected Gemini API response format:", data);
      return NextResponse.json({ error: 'Failed to parse Gemini response.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in /api/generate route:', error);
    return NextResponse.json({ error: 'An error occurred while generating the case summary.' }, { status: 500 });
  }
}
;
=== FILE: app/globals.css ===
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Poppins:wght@400;600;700&display=swap');

:root {
  --background-color: #e0e5ec; /* Soft grey */
  --text-primary: #333;
  --accent-color: #4a90e2; /* Soft blue */
  --shadow-light: #ffffff;
  --shadow-dark: rgba(0, 0, 0, 0.15);
}

body {
  font-family: 'Nunito', sans-serif;
  background-color: var(--background-color);
  color: var(--text-primary);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #444;
}

.neomorphism-card {
  background: var(--background-color);
  border-radius: 16px;
  box-shadow:
    -8px -8px 20px var(--shadow-light),
    8px 8px 20px var(--shadow-dark);
}

.neomorphism-card-result {
  background: var(--background-color);
  border-radius: 16px;
  box-shadow: inset
    -5px -5px 10px var(--shadow-light), inset
    5px 5px 10px var(--shadow-dark);
}


.neomorphism-input {
  background: var(--background-color);
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  box-shadow: inset
    -3px -3px 7px var(--shadow-light), inset
    3px 3px 7px var(--shadow-dark);
  transition: box-shadow 0.3s ease-in-out;
}

.neomorphism-input:focus {
  outline: none;
  box-shadow: inset
    -5px -5px 12px var(--shadow-light), inset
    5px 5px 12px var(--shadow-dark);
  border-color: transparent;
}

.neomorphism-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  box-shadow:
    -4px -4px 10px var(--shadow-light),
    4px 4px 10px var(--shadow-dark);
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.neomorphism-button:hover {
  box-shadow:
    inset -2px -2px 5px var(--shadow-light),
    inset 2px 2px 5px var(--shadow-dark);
  transform: translateY(1px);
}

.neomorphism-button:active {
  box-shadow: inset
    -5px -5px 12px var(--shadow-light), inset
    5px 5px 12px var(--shadow-dark);
  transform: translateY(2px);
}

.neomorphism-button-disabled {
  background-color: #aaa; /* Lighter, less vibrant color for disabled */
  cursor: not-allowed;
  box-shadow: inset
    -3px -3px 7px #ccc, inset
    3px 3px 7px rgba(0,0,0,0.1);
}

/* Loader Styles */
.loader {
  border-top-color: var(--accent-color);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Prose overrides for the response display */
.prose h2,
.prose h3 {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  color: #444;
}

.prose h2 {
  font-size: 2rem;
}

.prose h3 {
  font-size: 1.5rem;
  color: #333;
}

.prose p {
  margin-bottom: 1em;
  font-size: 1rem;
  color: #555;
}

.prose p strong {
    font-weight: 700;
    color: #333;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  .neomorphism-card {
    padding: 1.5rem;
  }
  .neomorphism-button {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
  .prose h2 {
    font-size: 1.8rem;
  }
  .prose h3 {
    font-size: 1.3rem;
  }
}
=== END ===