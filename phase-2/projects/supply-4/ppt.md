# Brief
CostLeakFinder is a web application designed to preemptively detect and flag potential supply chain disruptions and hidden cost inefficiencies. It analyzes user-provided supply chain descriptions to identify waste points, estimate financial impact, and prescribe targeted cost-saving interventions, all within a stylized terminal interface.

# Opportunities
## Differentiation
The core differentiator is the unique "hacker terminal" UI, which provides a novel and engaging user experience for a typically complex business problem. This retro-futuristic aesthetic appeals to a niche audience and makes the analytics feel more immediate and direct.

## Problem Solving Approach
The application utilizes a prompt-engineered Gemini API integration to perform sophisticated analysis of supply chain data. It focuses on uncovering non-obvious inefficiencies beyond user-stated pain points, offering data-driven insights and actionable recommendations for cost optimization and route adjustment.

## USP
"Describe your supply chain — find hidden cost inefficiencies instantly." The USP lies in the combination of advanced AI-powered supply chain analysis delivered through a distinct, immersive terminal UI, making complex optimization accessible and visually compelling.

# Features
- **Supply Chain Input Form:** User-friendly terminal-style input for describing supply chain stages, vendors, transport modes, and pain points.
- **AI-Powered Analysis:** Gemini API integration for identifying and prioritizing supply chain cost leaks.
- **Cost Leak Reporting:** Clear presentation of identified inefficiencies, estimated waste magnitude (low/medium/high $), and ranked savings potential.
- **Actionable Interventions:** Specific, prescribed fixes for each identified cost leak.
- **Hacker Terminal UI:** Immersive green-on-black, monospace font, terminal-like interface.
- **Loading & Error States:** Visually distinct loading animations and user-friendly error handling.
- **Responsive Design:** Optimized for both desktop and mobile viewing.

# Technologies
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide React
- **Backend:** Next.js API Routes (`app/api/generate/route.ts`)
- **AI Integration:** Gemini API (`gemini-2.5-flash`)
- **Styling:** Custom CSS variables, Google Fonts (imported)
- **Build Tool:** `next build --no-turbo`
- **Node.js:** 24.x

--- FILE: app/page.tsx ---
```tsx
'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [supplyChainDescription, setSupplyChainDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "CostLeakFinder";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeminiResponse(null);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: supplyChainDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeminiResponse(data.result);
    } catch (err: any) {
      setError(`Error processing request: ${err.message}`);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 font-mono text-green-500">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">CostLeakFinder</h1>
        <p className="text-lg text-green-400">Describe your supply chain — find hidden cost inefficiencies instantly</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center mb-4">
            <span className="mr-4 text-cyan-400">_supplyChainDesc:</span>
            <input
              type="text"
              value={supplyChainDescription}
              onChange={(e) => setSupplyChainDescription(e.target.value)}
              className="bg-transparent border-b-2 border-green-500 focus:outline-none focus:border-cyan-400 w-full py-1 px-2"
              placeholder="e.g., multi-modal freight, raw materials sourcing, warehousing, last-mile delivery..."
              required
            />
          </div>
          <button
            type="submit"
            className={`px-4 py-2 border-2 border-cyan-400 transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-500 hover:text-black'}`}
            disabled={isLoading}
          >
            {isLoading ? '> PROCESSING...' : '[> ANALYZE]'}
          </button>
        </form>

        <section>
          {isLoading && (
            <div className="animate-pulse">
              <p className="text-cyan-400">Analyzing...</p>
              <div className="mt-2 w-48 h-3 bg-green-700 rounded animate-blink-loading"></div>
            </div>
          )}

          {error && (
            <div className="border border-red-500 p-4 text-red-400">
              <p>ERROR:</p>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {geminiResponse && (
            <div className="border-t-2 border-green-500 pt-4">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Analysis Results:</h2>
              <pre className="whitespace-pre-wrap text-green-400 leading-relaxed">{geminiResponse}</pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
```
--- FILE: app/api/generate/route.ts ---
```typescript
import { NextResponse } from 'next/server';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY environment variable not set.' }, { status: 500 });
  }

  const systemPrompt = "You are a supply chain cost optimization AI. Analyze this supply chain for cost leaks: identify top 5 inefficiency points, estimate waste magnitude for each (low/medium/high $), rank by savings potential, and prescribe 1 specific fix per issue. Focus on non-obvious inefficiencies beyond the stated pain points.";

  const fullPrompt = `${systemPrompt}\n\nUser Input:\n${prompt}`;

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Gemini API Error Response:", errorBody);
      throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Check for content and extract text
    let geminiResult = "No analysis generated.";
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      geminiResult = data.candidates[0].content.parts.map((part: any) => part.text).join('');
    }

    return NextResponse.json({ result: geminiResult });

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: `Failed to generate content: ${error.message}` }, { status: 500 });
  }
}
```
--- FILE: app/globals.css ---
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');

:root {
  --terminal-bg: #0a0f0a; /* Very dark green-black */
  --terminal-text-primary: #00ff41; /* Bright green */
  --terminal-text-secondary: #008f11; /* Dim green */
  --terminal-accent: #39ff14; /* Alternative bright green for highlights */
  --terminal-cyan: #00ffff; /* Bright Cyan */
  --terminal-border: 1px solid #00ff41;
  --terminal-border-dashed: 2px dashed #00ff41;
}

body {
  background-color: var(--terminal-bg);
  color: var(--terminal-text-primary);
  font-family: 'Fira Code', monospace;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  color: var(--terminal-accent);
}

input[type="text"],
textarea {
  font-family: 'Fira Code', monospace;
  color: var(--terminal-text-primary);
  caret-color: var(--terminal-cyan);
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--terminal-cyan) !important; /* Override default focus */
}

button {
  font-family: 'Fira Code', monospace;
  background-color: transparent;
  border: var(--terminal-border);
  color: var(--terminal-text-primary);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: var(--terminal-cyan);
  color: var(--terminal-bg);
  border-color: var(--terminal-cyan);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Custom loading animation */
.animate-pulse {
  animation: pulse 1.5s infinite ease-in-out;
}

.animate-blink-loading {
  animation: blink-loading 0.7s infinite steps(1);
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes blink-loading {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

/* Scanline effect - Optional, uncomment to enable */
/*
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 65, 0.05),
    rgba(0, 255, 65, 0.1) 1px,
    transparent 1px,
    transparent 100%
  );
  pointer-events: none;
  z-index: 9999;
}
*/

/* Tailwind base styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Explicitly set monospace for all elements that should inherit */
body, input, button, pre {
  font-family: 'Fira Code', monospace !important;
}

/* Ensure no rounded corners sneak in */
* {
  border-radius: 0 !important;
}

/* Specific overrides for clarity */
.border-green-500 {
  border-color: var(--terminal-text-primary) !important;
}

.border-cyan-400 {
  border-color: var(--terminal-cyan) !important;
}

.text-green-400 {
  color: var(--terminal-text-secondary) !important;
}

.text-cyan-400 {
  color: var(--terminal-cyan) !important;
}

.hover\:bg-cyan-500:hover {
  background-color: var(--terminal-cyan) !important;
  color: var(--terminal-bg) !important;
}

.hover\:text-black:hover {
  color: var(--terminal-bg) !important;
}

.focus\:border-cyan-400:focus {
  border-color: var(--terminal-cyan) !important;
}

.bg-transparent {
  background-color: transparent !important;
}

.leading-relaxed {
  line-height: 1.75 !important; /* Slightly more spacing for readability */
}

.whitespace-pre-wrap {
  white-space: pre-wrap !important; /* Preserve whitespace and wrap lines */
}

.whitespace-pre {
  white-space: pre !important;
}

.font-bold {
  font-weight: 700 !important;
}
```
--- END ---