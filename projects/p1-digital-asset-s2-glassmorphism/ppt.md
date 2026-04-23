# Brief
The proliferation of digital sports media across global platforms creates significant challenges for IP rights management, leading to widespread unauthorized redistribution and intellectual property violations. PropagationMap addresses this by providing an AI-driven solution for tracking, analyzing, and flagging the spread of proprietary content, enabling proactive protection of digital assets.

# Opportunities
## Differentiation
PropagationMap stands out through its specialized focus on digital sports media, leveraging an AI-powered propagation simulation engine. Its distinctive Glassmorphism UI offers a premium, intuitive user experience, while near real-time anomaly detection provides a critical advantage over traditional, reactive IP monitoring tools.
## Problem Solving Approach
The solution adopts a proactive approach, moving beyond reactive takedowns. By simulating propagation, it offers predictive analytics for risk assessment. It enables organizations to authenticate their assets upfront and provides comprehensive insights into likely unauthorized spread, allowing for targeted intervention and strategic IP defense.
## USP
The unique selling proposition of PropagationMap is its AI-driven predictive intelligence on media propagation, specifically tailored for the dynamic landscape of sports content. This, combined with an elegant and functional Glassmorphism interface, offers an unparalleled tool for digital asset security and IP rights enforcement.

# Features
- Interactive input form for detailing media assets (name, type, publish date, original platform).
- AI-generated propagation risk summary, detailing likely spread patterns.
- Identification of the top 3 high-risk platforms for unauthorized redistribution.
- Detection and flagging of specific anomaly signals indicative of misappropriation.
- A concise timeline narrative outlining the asset's expected spread and potential misuse.
- Visually stunning and responsive Glassmorphism UI with smooth animations.
- Robust loading and error handling for a seamless user experience.

# Technologies
- Next.js 16 (App Router) for a modern, performant web application.
- TypeScript for enhanced code quality and developer experience.
- Tailwind CSS combined with custom CSS for rapid, precise, and Glassmorphism-compliant styling.
- Lucide React for a comprehensive and lightweight icon set.
- Gemini 2.5 Flash API for advanced content propagation analysis and simulation.

--- FILE: app/page.tsx ---
'use client';

import { useState, FormEvent, Fragment } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

interface ResultSection {
  title: string;
  content: string;
}

export default function Home() {
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('video');
  const [publishDate, setPublishDate] = useState('');
  const [originalPlatform, setOriginalPlatform] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultSection[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const userInput = `Asset Name: ${assetName}\nAsset Type: ${assetType}\nOriginal Publish Date: ${publishDate}\nOriginal Platform: ${originalPlatform}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.result) {
        // Parse the Gemini markdown output into sections
        const sections: ResultSection[] = [];
        const rawSections = data.result.split('## ').filter(s => s.trim() !== '');

        rawSections.forEach((section: string) => {
          const firstNewline = section.indexOf('\n');
          if (firstNewline > -1) {
            const title = section.substring(0, firstNewline).trim();
            const content = section.substring(firstNewline + 1).trim();
            sections.push({ title, content });
          } else {
            // Handle cases where there's no newline after the title (e.g., just a title)
            sections.push({ title: section.trim(), content: '' });
          }
        });
        setResult(sections);
      } else {
        setError("No result found in the response.");
      }
    } catch (err: any) {
      console.error('API call failed:', err);
      setError(`Failed to analyze propagation: ${err.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden font-urbanist text-gold-100">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob transition-all duration-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-navy-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 transition-all duration-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-navy-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 transition-all duration-1000"></div>

      <div className="relative z-10 w-full max-w-2xl mt-8 mb-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gold-100 mb-6 text-center animate-fade-in-up">
          Propagation<span className="text-navy-300">Map</span>
        </h1>
        <p className="text-lg text-gold-200 text-center mb-10 animate-fade-in-up animation-delay-300">
          Describe a media asset — understand how it has likely spread across platforms.
        </p>

        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 sm:p-8 rounded-xl backdrop-blur-md shadow-2xl space-y-6 animate-fade-in-up animation-delay-600"
        >
          <h2 className="text-2xl font-semibold text-gold-100 mb-4">Asset Details</h2>
          <div>
            <label htmlFor="assetName" className="block text-gold-200 text-sm font-medium mb-2">
              Asset Name/Title
            </label>
            <input
              type="text"
              id="assetName"
              className="glass-input w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 placeholder-gold-300"
              placeholder="e.g., 'Champions League Final Highlights'"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
              disabled={isLoading}
              suppressHydrationWarning
            />
          </div>
          <div>
            <label htmlFor="assetType" className="block text-gold-200 text-sm font-medium mb-2">
              Asset Type
            </label>
            <select
              id="assetType"
              className="glass-input w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 appearance-none bg-right-arrow"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              required
              disabled={isLoading}
              suppressHydrationWarning
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="article">Article</option>
            </select>
          </div>
          <div>
            <label htmlFor="publishDate" className="block text-gold-200 text-sm font-medium mb-2">
              Original Publish Date
            </label>
            <input
              type="date"
              id="publishDate"
              className="glass-input w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 placeholder-gold-300"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              required
              disabled={isLoading}
              suppressHydrationWarning
            />
          </div>
          <div>
            <label htmlFor="originalPlatform" className="block text-gold-200 text-sm font-medium mb-2">
              Original Platform
            </label>
            <input
              type="text"
              id="originalPlatform"
              className="glass-input w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 placeholder-gold-300"
              placeholder="e.g., 'Official League Website' or 'ESPN'"
              value={originalPlatform}
              onChange={(e) => setOriginalPlatform(e.target.value)}
              required
              disabled={isLoading}
              suppressHydrationWarning
            />
          </div>
          <button
            type="submit"
            className="w-full glass-button bg-gold-600 hover:bg-gold-700 text-navy-900 font-bold py-3 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-105"
            disabled={isLoading}
            suppressHydrationWarning
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <ArrowRight className="mr-2" size={20} />
            )}
            {isLoading ? 'Analyzing...' : 'Analyze Propagation'}
          </button>
        </form>

        {error && (
          <div className="glass-card mt-8 p-6 text-red-400 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in-up">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="glass-card mt-8 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in-up animation-delay-900">
            <h2 className="text-3xl font-bold text-gold-100 mb-6 text-center">
              Propagation Risk Summary
            </h2>
            {result.map((section, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h3 className="text-xl sm:text-2xl font-semibold text-gold-200 mb-3 border-b border-gold-400/30 pb-2">
                  {section.title}
                </h3>
                <div className="prose prose-invert text-gold-100 max-w-none leading-relaxed">
                  {section.content.split('\n').map((line, lineIndex) => {
                    // Basic markdown parsing for lists
                    if (line.startsWith('1.') || line.startsWith('-')) {
                      return <p key={lineIndex} className="ml-4 flex items-start before:content-['•'] before:text-gold-400 before:mr-2 before:mt-1">{line.substring(line.indexOf(' ')).trim()}</p>;
                    }
                    return <p key={lineIndex} className="mb-2">{line}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt: userInput } = await req.json();

  if (!userInput) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
  }

  const geminiPrompt = `You are a content propagation analyst for sports media. Given the following asset description, provide a detailed analysis formatted with markdown headings.

**Asset Description:**
${userInput}

**Output Structure:**
## Propagation Pattern
Explain how this type of sports media typically propagates across social media, streaming sites, news aggregators, and other digital platforms.

## High-Risk Channels
Identify the top 3 platforms or channels that are highest risk for unauthorized redistribution of this specific asset type.
1. [Platform 1]
2. [Platform 2]
3. [Platform 3]

## Anomaly Signals
List specific anomaly patterns or indicators that would suggest unauthorized use or misappropriation.
- [Signal 1]
- [Signal 2]
- [Signal 3]

## Timeline Narrative
Provide a brief, speculative timeline describing the likely stages of this asset's spread and potential unauthorized activity over time.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: geminiPrompt }],
        }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: 'Failed to get response from Gemini API', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const geminiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated.';

    return NextResponse.json({ result: geminiResponseText });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-navy-50: #e0e9fa;
  --color-navy-100: #c6d9f7;
  --color-navy-200: #a5c3f2;
  --color-navy-300: #7b9fe7;
  --color-navy-400: #577edb;
  --color-navy-500: #3c5cd1;
  --color-navy-600: #2f49b9;
  --color-navy-700: #23378d;
  --color-navy-800: #192966;
  --color-navy-900: #0f1c3f;
  --color-gold-50: #fffce0;
  --color-gold-100: #fff9c0;
  --color-gold-200: #fff28f;
  --color-gold-300: #ffe95e;
  --color-gold-400: #ffd832;
  --color-gold-500: #ffc20a; /* Electric Gold */
  --color-gold-600: #e3a900;
  --color-gold-700: #c79000;
  --color-gold-800: #8f6600;
  --color-gold-900: #573d00;
}

@layer base {
  html {
    @apply scroll-smooth;
  }
  body {
    @apply bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-gold-100 font-urbanist leading-relaxed;
    min-height: 100vh;
  }
}

@layer components {
  .glass-card {
    @apply bg-white bg-opacity-10 border border-white border-opacity-20 shadow-lg relative;
    box-shadow: 0 8px 32px rgba(0,0,0,0.37);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .glass-input {
    @apply bg-white bg-opacity-5 border border-white border-opacity-10 text-gold-50 placeholder-gold-300;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all 0.2s ease-in-out;
  }

  .glass-input:focus {
    @apply bg-opacity-10 border-opacity-20;
  }

  .glass-button {
    @apply bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold py-3 px-6 rounded-lg shadow-md;
    @apply border border-gold-400 border-opacity-50;
    transition: all 0.3s ease;
  }

  .glass-button:hover {
    @apply from-gold-600 to-gold-700 scale-[1.02];
  }

  .glass-button:disabled {
    @apply opacity-50 cursor-not-allowed from-gray-500 to-gray-600;
  }
}

@layer utilities {
  .text-navy-900 {
    color: var(--color-navy-900);
  }
  .bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--color-navy-900), var(--color-navy-800), var(--color-navy-900));
  }
  .bg-gold-500 { background-color: var(--color-gold-500); }
  .bg-gold-600 { background-color: var(--color-gold-600); }
  .bg-gold-700 { background-color: var(--color-gold-700); }
  .bg-navy-500 { background-color: var(--color-navy-500); }
  .bg-navy-300 { background-color: var(--color-navy-300); }
  .text-gold-100 { color: var(--color-gold-100); }
  .text-gold-200 { color: var(--color-gold-200); }
  .text-gold-300 { color: var(--color-gold-300); }
  .text-gold-400 { color: var(--color-gold-400); }
  .text-navy-300 { color: var(--color-navy-300); }

  .bg-right-arrow {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23ffd832'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }
}

/* Custom Animations */
@keyframes fadeInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInFromBottom 0.6s ease-out forwards;
  opacity: 0; /* Ensures element is hidden before animation */
}

/* Animation delays for staggered effect */
.animation-delay-300 { animation-delay: 0.3s; }
.animation-delay-600 { animation-delay: 0.6s; }
.animation-delay-900 { animation-delay: 0.9s; }
/* Add more as needed */

/* Blob background animation */
@keyframes blob {
  0% { transform: scale(1) translate(0, 0); }
  33% { transform: scale(1.1) translate(20px, -30px); }
  66% { transform: scale(0.9) translate(-10px, 15px); }
  100% { transform: scale(1) translate(0, 0); }
}

.animate-blob {
  animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.3, 0.9);
}

.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
--- END ---