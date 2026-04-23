# Brief
AuthentiProof is an MVP web application for digital sports media authentication. It leverages Gemini AI to analyze asset metadata provided by users, determining the authenticity and identifying potential misappropriation of valuable digital content. The UI adheres strictly to minimalist principles, focusing on clarity and functionality.

# Opportunities
## Differentiation
AuthentiProof offers a unique blend of AI-driven deep analysis for digital asset authentication specifically tailored for the high-volume, high-value sports media industry. Its minimalist UI distinguishes it from cluttered enterprise solutions, providing a clean, focused user experience.
## Problem Solving Approach
The solution tackles content misappropriation by creating a digital fingerprint from metadata and comparing it against known patterns of authenticity. By providing a quantifiable authenticity score and detailed reports, it empowers sports organizations to take immediate action against unauthorized use.
## USP
The core USP is the "Authenticity Confidence Score" combined with specific "Originality Signals" and "Suspicious Anomalies," all generated in near real-time through intelligent metadata reasoning by Gemini AI, presented in a highly intuitive, minimalist interface.

# Features
- **Metadata Input Form:** Users input key asset details (title, creator, date, format, platform, watermarks).
- **AI-Powered Authentication:** Gemini AI processes metadata to assess asset originality and integrity.
- **Authenticity Confidence Score:** A numerical score (0-100%) indicating the likelihood of authenticity.
- **Detailed Verification Report:** Includes lists of originality signals, suspicious anomalies, and a summary.
- **Minimalist, Responsive UI:** Clean design focusing on essential information and easy interaction across devices.
- **Real-time Feedback:** Provides immediate loading states and results display.

# Technologies
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables
- **AI Integration:** Google Gemini 2.5 Flash API
- **Icons:** Lucide-React

Constraints:
- No fluff
- No repetition
- Keep concise
- Bullet points where appropriate

--- FILE: app/page.tsx ---
'use client';

import { useState, FormEvent, Fragment } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface ApiResponse {
  result?: string;
  error?: string;
}

interface ParsedResult {
  score: string;
  originalitySignals: string[];
  suspiciousAnomalies: string[];
  summary: string;
}

export default function HomePage() {
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [fileFormat, setFileFormat] = useState('');
  const [firstPublishedPlatform, setFirstPublishedPlatform] = useState('');
  const [watermarkDetails, setWatermarkDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseGeminiOutput = (text: string): ParsedResult => {
    const scoreMatch = text.match(/Authenticity Score:\s*(\d+%)/i);
    const originalitySignalsMatch = text.match(/Originality Signals:[\s\S]*?(Suspicious Anomalies:|$)/i);
    const suspiciousAnomaliesMatch = text.match(/Suspicious Anomalies:[\s\S]*?(Verification Summary:|$)/i);
    const summaryMatch = text.match(/Verification Summary:([\s\S]*)/i);

    const parseList = (match: RegExpMatchArray | null): string[] => {
      if (!match || !match[0]) return [];
      const listContent = match[0]
        .split(/Originality Signals:|Suspicious Anomalies:|Verification Summary:/i)[1]
        ?.trim();
      return listContent
        ? listContent
            .split('\n')
            .map((item) => item.replace(/^- /, '').trim())
            .filter(Boolean)
        : [];
    };

    return {
      score: scoreMatch ? scoreMatch[1] : 'N/A',
      originalitySignals: parseList(originalitySignalsMatch),
      suspiciousAnomalies: parseList(suspiciousAnomaliesMatch),
      summary: summaryMatch ? summaryMatch[1].trim() : 'No summary provided.',
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const userInputs = `
      Asset Title: ${title}
      Creator: ${creator}
      Creation Date: ${creationDate}
      File Format: ${fileFormat}
      Platform First Published On: ${firstPublishedPlatform}
      Watermark/Signature Details: ${watermarkDetails || 'None'}
    `;

    const prompt = `You are a digital asset authentication specialist. Analyze these asset metadata signals and provide the following output in a structured, plain text format, using the exact headings below:

Authenticity Score:
[score (0-100)%]

Originality Signals:
- [signal 1]
- [signal 2]
...

Suspicious Anomalies:
- [anomaly 1]
- [anomaly 2]
...

Verification Summary:
[one-paragraph summary]

User Input:
${userInputs}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.result) {
        setResult(parseGeminiOutput(data.result));
      } else {
        setError(data.error || 'Failed to get a valid response from the API.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full py-3 px-0 border-b border-gray-300 focus:outline-none focus:border-navy text-text-primary bg-transparent text-lg font-light placeholder:text-gray-400";
  const labelClass = "block text-sm font-medium text-gray-600 mb-2 mt-6"; // Adjusted mt-6 for spacing
  const sectionDividerClass = "border-t border-gray-200 my-10";

  return (
    <div className="min-h-screen bg-background-light text-text-primary font-inter">
      <main className="max-w-xl mx-auto py-16 px-4">
        <header className="mb-12 text-center">
          <h1 className="font-serif text-5xl font-bold leading-tight mb-4 text-navy">
            AuthentiProof
          </h1>
          <p className="text-xl text-gray-700 font-light max-w-md mx-auto">
            Describe your asset&apos;s metadata — get an authenticity confidence score
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-8 text-navy">Authenticate Digital Sports Media</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className={labelClass}>Asset Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., '2023 World Cup Final Goal'"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="creator" className={labelClass}>Creator / Publisher</label>
              <input
                id="creator"
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="e.g., 'FIFA Official Media'"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="creationDate" className={labelClass}>Creation Date</label>
              <input
                id="creationDate"
                type="date"
                value={creationDate}
                onChange={(e) => setCreationDate(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="fileFormat" className={labelClass}>File Format</label>
              <input
                id="fileFormat"
                type="text"
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                placeholder="e.g., 'MP4, 4K HDR'"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="firstPublishedPlatform" className={labelClass}>Platform First Published On</label>
              <input
                id="firstPublishedPlatform"
                type="text"
                value={firstPublishedPlatform}
                onChange={(e) => setFirstPublishedPlatform(e.target.value)}
                placeholder="e.g., 'FIFA.com, YouTube Official Channel'"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="watermarkDetails" className={labelClass}>Watermark / Signature Details (Optional)</label>
              <input
                id="watermarkDetails"
                type="text"
                value={watermarkDetails}
                onChange={(e) => setWatermarkDetails(e.target.value)}
                placeholder="e.g., 'Small FIFA logo bottom-right, timestamp'"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning // CRITICAL: Fixes hydration error with dynamic `disabled` prop
              className="mt-12 w-full py-4 text-lg font-medium bg-navy text-white hover:bg-opacity-90 transition-colors duration-200
                         disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
              {isLoading ? 'Analyzing...' : 'Authenticate Asset'}
            </button>
          </form>
        </section>

        {error && (
          <div className="mt-12 text-red-600 bg-red-50 p-6 border border-red-200 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {result && (
          <section className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-8 text-navy">Verification Report</h2>

            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-lg text-gray-600 mb-2">Authenticity Confidence Score</p>
              <p className="text-5xl font-bold text-gold">{result.score}</p>
            </div>

            {result.originalitySignals.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-navy">Originality Signals</h3>
                <ul className="list-none space-y-3">
                  {result.originalitySignals.map((signal, index) => (
                    <li key={index} className="flex items-start text-lg font-light">
                      <span className="text-gold mr-3 transform -translate-y-1">●</span>
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suspiciousAnomalies.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-red-700">Suspicious Anomalies</h3>
                <ul className="list-none space-y-3">
                  {result.suspiciousAnomalies.map((anomaly, index) => (
                    <li key={index} className="flex items-start text-lg font-light text-red-700">
                      <span className="text-red-700 mr-3 transform -translate-y-1">●</span>
                      <span>{anomaly}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-navy">Verification Summary</h3>
              <p className="text-lg leading-relaxed font-light">{result.summary}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to get a response from Gemini API.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const geminiResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!geminiResult) {
      return NextResponse.json({ error: 'No content received from Gemini API.' }, { status: 500 });
    }

    return NextResponse.json({ result: geminiResult }, { status: 200 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600;700&display=swap');

@layer base {
  :root {
    /* Base colors */
    --background-light: #fafafa; /* Off-white background */
    --text-primary: #1c1c1e;    /* Near-black text */
    --gray-border: #e0e0e0;     /* Fine hairline borders */

    /* Accent colors: Deep Navy & Electric Gold */
    --navy: #1a237e; /* Deep Navy */
    --gold: #ffc107; /* Electric Gold - slightly softer than pure #FFD700 for better contrast on white, while maintaining vibrancy */
  }

  body {
    @apply bg-[var(--background-light)] text-[var(--text-primary)];
    font-family: 'Inter', sans-serif; /* Body font */
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'DM Serif Display', serif; /* Heading font */
    color: var(--navy); /* Default heading color to navy */
  }

  /* Specific styles for minimalist inputs */
  input[type="text"],
  input[type="date"],
  input[type="email"],
  input[type="number"],
  textarea {
    @apply border-b border-gray-300 focus:border-navy transition-colors duration-200;
  }

  /* Placeholder color */
  ::placeholder {
    color: theme('colors.gray.400');
    opacity: 1; /* Firefox fix */
  }
}
--- END ---