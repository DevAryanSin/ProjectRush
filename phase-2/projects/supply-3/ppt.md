# Brief

The ShipmentNarrator is a Next.js 16 application designed to combat critical transit disruptions in global supply chains. It ingests raw shipment tracking data and leverages Gemini AI to generate a clear, chronological narrative. This narrative highlights shipment progress, pinpoints the causes and locations of delays, and provides insights into expected next steps, enabling proactive management of supply chain volatility.

# Opportunities

## Differentiation

The ShipmentNarrator differentiates itself through its specialized focus on translating complex, raw logistics data into accessible, actionable plain-language insights. Its Aurora UI provides a premium, immersive user experience, while the AI-driven narrative offers immediate clarity and predictive value, unlike traditional, often fragmented tracking systems.

## Problem Solving Approach

The solution addresses the problem of delayed disruption identification by employing a two-pronged approach:

1.  **Data Translation:** A user-friendly interface allows for easy submission of raw tracking data.
2.  **AI-Powered Narrative:** Gemini 2.5 Flash translates this data into a coherent, easy-to-understand story, identifying delays, their root causes, and future implications. This empowers stakeholders to react quickly and optimize routes before issues escalate.

## USP

Translate raw tracking data into an instantly understandable, AI-generated shipment story with predictive insights and a premium, immersive Aurora UI.

# Features

- **AI-Powered Shipment Narrative:** Converts raw logistics logs into chronological, plain-language stories.
- **Delay Analysis:** Identifies and explains the reasons and locations of transit delays.
- **Predictive Insights:** Offers simple explanations of what to expect next for a shipment.
- **Immersive Aurora UI:** Features a dark, gradient-filled interface with dynamic elements for a premium user experience.
- **Responsive Design:** Fully functional and visually appealing on both desktop and mobile devices.
- **Loading & Error Handling:** Provides clear visual feedback during data processing and displays user-friendly error messages.
- **Client-Side API Fetching:** Efficiently retrieves AI-generated content from a dedicated API route.

# Technologies

- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Icons:** Lucide React
- **AI Integration:** Gemini API (gemini-2.5-flash)
- **Deployment:** Node.js 24.x compatible
- **Build Tool:** Next.js build (`next build `)

--- FILE: app/page.tsx ---
'use client';

import React, { useState, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';

interface GenerationResponse {
result: string;
}

export default function HomePage() {
const [trackingData, setTrackingData] = useState<string>('');
const [shipmentStory, setShipmentStory] = useState<string>('');
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
setTrackingData(event.target.value);
setError(null); // Clear error when user starts typing
};

const handleSubmit = async (event: React.FormEvent) => {
event.preventDefault();
if (!trackingData.trim()) {
setError('Please paste your shipment tracking data.');
return;
}

    setIsLoading(true);
    setShipmentStory('');
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: trackingData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate shipment story.');
      }

      const data: GenerationResponse = await response.json();
      setShipmentStory(data.result);
    } catch (err: any) {
      console.error('Error generating story:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }

};

// Effect to add aurora background elements and animations
useEffect(() => {
const auroraContainer = document.getElementById('aurora-container');
if (!auroraContainer) return;

    const orbColors = ['#00d4aa', '#7c3aed', '#2563eb', '#db2777']; // Teal, Purple, Blue, Pink

    for (let i = 0; i < 4; i++) {
      const orb = document.createElement('div');
      orb.className = 'absolute blur-3xl opacity-50 -z-10 animate-aurora-move';
      orb.style.width = '300px';
      orb.style.height = '300px';
      orb.style.borderRadius = '9999px';
      orb.style.backgroundColor = orbColors[i];

      // Position orbs dynamically
      orb.style.left = `${Math.random() * 90}%`;
      orb.style.top = `${Math.random() * 80}%`;
      if (i === 1) orb.style.top = `${Math.random() * 80}%`;
      if (i === 2) orb.style.left = `${Math.random() * 90}%`;
      if (i === 3) orb.style.top = `${Math.random() * 80}%`;


      auroraContainer.appendChild(orb);
    }

}, []);

return (
<div className="relative min-h-screen overflow-hidden font-sans text-white bg-gray-900" id="aurora-container">
{/_ Aurora background elements will be appended here by useEffect _/}

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            ShipmentNarrator
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            Paste raw tracking data — get a plain-language shipment story
          </p>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="mb-12 max-w-4xl mx-auto">
            <div className="backdrop-blur-lg bg-white/5 rounded-lg shadow-xl p-6 md:p-8 border border-white/10">
              <label htmlFor="tracking-data" className="block text-xl font-semibold mb-4 text-cyan-300">
                Shipment Tracking Data
              </label>
              <textarea
                id="tracking-data"
                rows={10}
                className="w-full p-4 rounded-lg border border-white/10 bg-black/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:outline-none resize-none shadow-inner"
                placeholder="Enter raw shipment logs, status updates, or any tracking information here..."
                value={trackingData}
                onChange={handleInputChange}
                aria-label="Shipment Tracking Data Input"
              />
              {error && (
                <p className="mt-4 text-red-400 text-center">{error}</p>
              )}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className={`relative px-8 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out
                    ${isLoading ? 'cursor-not-allowed bg-gray-600 text-gray-400' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-xl'}
                  `}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 8l3-3.709z"></path>
                      </svg>
                      Generating Story...
                    </span>
                  ) : (
                    'Generate Story'
                  )}
                </button>
              </div>
            </div>
          </form>

          {shipmentStory && (
            <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/5 rounded-lg shadow-xl p-6 md:p-8 border border-white/10 mt-12">
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                Shipment Story
              </h2>
              <div className="prose max-w-none text-gray-300 space-y-4 leading-relaxed">
                {/* Basic parsing for headings and paragraphs, can be enhanced */}
                {shipmentStory.split('\n\n').map((paragraph, index) => {
                  if (paragraph.trim().startsWith('#')) {
                    // Assume markdown headings for simplicity
                    const level = paragraph.match(/^#+/)?.[0].length || 1;
                    const text = paragraph.replace(/^#+\s*/, '');
                    if (level === 1) return <h3 key={index} className="text-2xl font-semibold mt-6 text-purple-400">{text}</h3>;
                    if (level === 2) return <h4 key={index} className="text-xl font-semibold mt-4 text-blue-400">{text}</h4>;
                    return <h5 key={index} className="text-lg font-semibold mt-2 text-pink-400">{text}</h5>;
                  } else if (paragraph.trim()) {
                    return <p key={index}>{paragraph}</p>;
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </main>

        <footer className="text-center mt-20 text-gray-500 text-sm">
          © {new Date().getFullYear()} ShipmentNarrator. All rights reserved.
        </footer>
      </div>
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
return NextResponse.json({ error: 'Internal server error: API key not configured.' }, { status: 500 });
}

try {
const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid input: prompt is required and must be a string.' }, { status: 400 });
    }

    const systemPrompt = "You are a logistics translator AI. Convert this raw tracking data into a plain-language shipment story covering: what happened chronologically, where and why delays occurred, current status explained simply, and what to expect next. Write for a non-technical business owner. Be specific about times and locations.";

    const fullPrompt = `${systemPrompt}\n\nRaw Data:\n${prompt}`;

    const geminiResponse = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.json();
      console.error('Gemini API error:', geminiResponse.status, errorBody);
      return NextResponse.json({ error: `Gemini API error: ${geminiResponse.statusText}` }, { status: geminiResponse.status });
    }

    const data = await geminiResponse.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      const resultText = data.candidates[0].content.parts.map((part: any) => part.text).join('');
      return NextResponse.json({ result: resultText });
    } else {
      console.error('Unexpected Gemini response structure:', data);
      return NextResponse.json({ error: 'Failed to parse Gemini response.' }, { status: 500 });
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

/_ Google Fonts Import _/
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
--background-dark: #050810; /_ Very dark, deep blue-black _/
--card-background-transparent: rgba(255, 255, 255, 0.05);
--gradient-teal: #00d4aa;
--gradient-purple: #7c3aed;
--gradient-blue: #2563eb;
--gradient-pink: #db2777;
--text-primary: #ffffff;
--text-secondary: #b0b0b0;
}

body {
font-family: 'Inter', sans-serif;
background-color: var(--background-dark);
color: var(--text-primary);
line-height: 1.6;
}

/_ Custom Animations _/
@keyframes aurora-move {
0% {
transform: translate(0, 0) rotate(0deg);
filter: blur(100px) opacity(0.5);
}
25% {
transform: translate(10%, 5%) rotate(5deg);
filter: blur(120px) opacity(0.6);
}
50% {
transform: translate(-5%, 10%) rotate(-3deg);
filter: blur(110px) opacity(0.5);
}
75% {
transform: translate(8%, -5%) rotate(2deg);
filter: blur(130px) opacity(0.4);
}
100% {
transform: translate(0, 0) rotate(0deg);
filter: blur(100px) opacity(0.5);
}
}

.animate-aurora-move {
animation: aurora-move 10s ease-in-out infinite alternate;
}

/_ Tailwind overrides and custom utilities _/
.bg-gray-900 {
background-color: var(--background-dark);
}

.text-white {
color: var(--text-primary);
}

.text-gray-300 {
color: var(--text-secondary);
}

.text-gray-400 {
color: var(--text-secondary);
}

.text-gray-500 {
color: var(--text-secondary);
}

/_ Card Styling _/
.backdrop-blur-lg.bg-white\/5 {
background-color: var(--card-background-transparent);
backdrop-filter: blur(10px); /_ Adjust blur as needed _/
-webkit-backdrop-filter: blur(10px); /_ For Safari _/
border: 1px solid rgba(255, 255, 255, 0.1); /_ Subtle border _/
}

/_ Input Field Styling _/
.dark textarea.focus\:ring-cyan-500,
.dark input.focus\:ring-cyan-500 {
box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.5); /_ Tailwind's focus:ring-cyan-500 with alpha for gradient feel _/
}

.dark textarea,
.dark input {
background-color: rgba(0, 0, 0, 0.3); /_ Dark glass-like background _/
border: 1px solid rgba(255, 255, 255, 0.15); /_ Subtle border _/
}

.dark textarea::placeholder,
.dark input::placeholder {
color: var(--text-secondary);
}

/_ Gradient Text/Borders for Accents _/
.bg-gradient-to-r.from-cyan-400.via-purple-500.to-pink-500 {
background-image: linear-gradient(to right, var(--gradient-teal), var(--gradient-purple), var(--gradient-pink));
}

.bg-gradient-to-r.from-teal-400.to-cyan-400 {
background-image: linear-gradient(to right, var(--gradient-teal), var(--gradient-blue));
}

.bg-gradient-to-r.from-cyan-500.to-blue-600 {
background-image: linear-gradient(to right, var(--gradient-teal), var(--gradient-blue));
}
.hover\:from-cyan-400.hover\:to-blue-500 {
background-image: linear-gradient(to right, var(--gradient-teal), var(--gradient-blue));
}

/_ Prose Mirroring Aurora _/
.prose {
color: var(--text-secondary);
}
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
color: var(--text-primary);
margin-top: 1.5em;
margin-bottom: 0.8em;
font-weight: 700;
}
.prose h3 { color: var(--gradient-purple); }
.prose h4 { color: var(--gradient-blue); }
.prose p {
margin-bottom: 1em;
color: var(--text-secondary);
}
.prose a {
color: var(--gradient-teal);
text-decoration: underline;
}
.prose strong {
color: var(--text-primary);
}

/_ Specific Overrides for button _/
.shadow-lg {
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
}
.hover\:shadow-xl {
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -2px rgba(0, 0, 0, 0.3);
}

/_ Placeholder for any global overrides _/
--- END ---
