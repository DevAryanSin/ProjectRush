# Brief
TaskNarrator is a functional MVP web application built with Next.js 16, TypeScript, and Tailwind CSS. It provides a unique terminal-inspired user interface for non-profit organizations to generate emotionally resonant impact stories from completed task data, enhancing donor engagement and support.

# Opportunities
## Differentiation
- **Unique UI/UX:** Adopts a nostalgic 90s hacker terminal aesthetic, setting it apart from conventional web applications.
- **AI-Powered Storytelling:** Leverages Gemini AI to craft compelling narratives, not just present data.
- **Focused Utility:** Specifically targets the need for clear, motivational communication in the non-profit sector.

## Problem Solving Approach
The system addresses the challenge of fragmented community data by:
1.  **Data Aggregation:** Providing a single interface to input detailed task completion information.
2.  **AI Transformation:** Using Gemini to convert this data into engaging donor narratives.
3.  **Impact Communication:** Presenting results in a structured, visually hierarchical format that emphasizes emotional impact and calls to action.

## USP
Generates humanized, donor-motivating impact stories from raw task data, using a distinctive terminal UI and advanced AI to clearly demonstrate the tangible social good achieved by non-profit efforts.

# Features
- **Terminal UI:** Full command-line interface aesthetic (green-on-black, monospace fonts, styled inputs/buttons).
- **AI-Driven Story Generation:** Input task details (volunteer, beneficiaries, resources, outcomes, location) to generate a donor-facing story.
- **Dynamic Form:** User-friendly input fields styled to match the terminal theme.
- **Loading States:** Visually engaging loading animations while waiting for AI response.
- **Hierarchical Results Display:** Parsed AI output presented with clear sections, headlines, metrics, and calls to action.
- **Error Handling:** Graceful display of user-friendly error messages.
- **Responsive Design:** Fully functional and styled across mobile and desktop devices.
- **Page Title & Heading:** Prominently displays "TaskNarrator" as required.

# Technologies
- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Custom CSS Variables (`globals.css`)
- **Icons:** `lucide-react`
- **AI Integration:** Gemini API (`gemini-2.5-flash`)
- **Deployment Domain:** `tasknarrator-sc` (as per prompt, though actual deployment isn't part of the code generation)

Constraints:
- No external npm packages beyond Next.js, React, ReactDOM, lucide-react, Tailwind CSS.
- All code generated in a single response with exact delimiters.
- Strict adherence to the specified UI style and color palette.
- Gemini API calls handled server-side only.
- `'use client'` directive applied to `app/page.tsx`.
- Build command: `next build --no-turbo`.
- Node version: 24.x.
```

--- FILE: app/page.tsx ---
'use client';

import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface GeneratedStory {
    headline: string;
    narrative: string;
    metrics: string;
    quote: string;
    callToAction: string;
}

export default function HomePage() {
    const [taskDetails, setTaskDetails] = useState({
        taskCompleted: '',
        volunteerDetails: '',
        beneficiariesHelped: '',
        resourcesUsed: '',
        outcomesAchieved: '',
        location: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [story, setStory] = useState<GeneratedStory | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [typingIndicator, setTypingIndicator] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setTaskDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setStory(null);
        setError(null);

        const prompt = `
        Task Completed: ${taskDetails.taskCompleted}
        Volunteer Details: ${taskDetails.volunteerDetails}
        Beneficiaries Helped: ${taskDetails.beneficiariesHelped}
        Resources Used: ${taskDetails.resourcesUsed}
        Outcomes Achieved: ${taskDetails.outcomesAchieved}
        Location: ${taskDetails.location}
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
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate story. Please try again.');
            }

            const data = await response.json();
            const rawStory = data.result;

            // Basic parsing - Gemini response might need more robust parsing based on its output structure
            const parsedStory: GeneratedStory = {
                headline: rawStory.split('Headline:')[1]?.split('\n')[0].trim() || 'Impact Story',
                narrative: rawStory.split('Narrative:')[1]?.split('Key Metrics:')[0].trim() || rawStory,
                metrics: rawStory.split('Key Metrics:')[1]?.split('Quote:')[0].trim() || 'N/A',
                quote: rawStory.split('Quote:')[1]?.split('Call to Action:')[0].trim() || 'A dedicated volunteer.',
                callToAction: rawStory.split('Call to Action:')[1]?.trim() || 'Support our mission today!',
            };

            setStory(parsedStory);

        } catch (err: any) {
            setError(err.message);
            console.error('Error generating story:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setTypingIndicator((prev) => {
                    if (prev.length < 3) return prev + '.';
                    return '';
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-bold flex items-center text-green-400">
                    <Terminal className="mr-2" size={32} /> TaskNarrator
                </h1>
                <p className="text-dim-green text-lg mt-2">
                    Completed task details — generate a donor-motivating impact story
                </p>
            </header>

            <main>
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-green-400 mb-4 border-b-2 border-dim-green pb-2">INPUT DATA STREAM</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: 'taskCompleted', label: 'TASK COMPLETION', placeholder: 'Briefly describe the task performed...' },
                            { name: 'volunteerDetails', label: 'VOLUNTEER(S)', placeholder: 'Name(s), skills, time contributed...' },
                            { name: 'beneficiariesHelped', label: 'BENEFICIARIES', placeholder: 'Who was helped? Demographics, number...' },
                            { name: 'resourcesUsed', label: 'RESOURCES', placeholder: 'Materials, funds, equipment used...' },
                            { name: 'outcomesAchieved', label: 'OUTCOMES', placeholder: 'Tangible results and impact...' },
                            { name: 'location', label: 'LOCATION', placeholder: 'Community/area served...' },
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label htmlFor={field.name} className="text-dim-green font-mono mb-1 text-sm uppercase">{field.label}</label>
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    value={taskDetails[field.name as keyof typeof taskDetails]}
                                    onChange={handleInputChange}
                                    placeholder={`> ${field.placeholder}`}
                                    className="bg-black text-bright-green font-mono p-2 border border-dim-green focus:outline-none focus:border-white w-full resize-none min-h-[80px] placeholder-dim-green"
                                    rows={3}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-4 py-2 text-bright-green bg-black border border-green-500 hover:bg-dim-green disabled:opacity-50 disabled:cursor-not-allowed font-mono
                                   transition duration-300 ease-in-out
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                                   shadow-lg shadow-green-500/20
                                   hover:shadow-xl hover:shadow-green-500/40
                                   [> SUBMIT DATA]"
                    >
                        {isLoading ? `PROCESSING${typingIndicator}` : '> SUBMIT DATA'}
                    </button>
                </section>

                {isLoading && (
                    <section className="mt-8">
                        <p className="text-dim-green font-mono animate-pulse">Awaiting AI analysis...</p>
                    </section>
                )}

                {error && (
                    <section className="mt-8 p-4 border border-red-500 bg-black text-red-400 font-mono">
                        <p className="text-lg font-bold mb-2">ERROR:</p>
                        <p>{error}</p>
                    </section>
                )}

                {story && !isLoading && (
                    <section className="mt-8 p-4 border border-white bg-black text-white font-mono">
                        <h2 className="text-3xl font-bold text-green-400 mb-4 border-b border-dim-green pb-2">{story.headline}</h2>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">NARRATIVE:</h3>
                            <p className="text-bright-green leading-relaxed">{story.narrative}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">KEY METRICS:</h3>
                            <p className="text-bright-green leading-relaxed">{story.metrics}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">IMPACT QUOTE:</h3>
                            <p className="text-bright-green italic leading-relaxed">"{story.quote}"</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-dim-green">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">SUPPORT US:</h3>
                            <p className="text-bright-green leading-relaxed">{story.callToAction}</p>
                            <button className="mt-4 px-4 py-2 text-black bg-green-400 hover:bg-green-500 font-mono
                                               transition duration-300 ease-in-out
                                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                                               shadow-lg shadow-green-500/20
                                               hover:shadow-xl hover:shadow-green-500/40
                                               [> DONATE NOW]"
                                               onClick={() => window.open('https://example.com/donate', '_blank')} // Placeholder donate link
                            >
                                [> DONATE NOW]
                            </button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse, type NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
    }

    try {
        const { prompt } = await request.json();

        const systemPrompt = `You are a nonprofit storytelling AI. Transform this task data into a donor impact story with: (1) Compelling headline, (2) Human narrative (who helped who, what changed), (3) Key impact metrics made emotional (not just numbers), (4) Quote from the experience (fabricate plausibly), (5) Call to action for continued support. Make donors feel the difference their money made.
        `;

        const fullPrompt = systemPrompt + "\n\nUser Input:\n" + prompt;

        const response = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.9,
                    maxOutputTokens: 500,
                },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Gemini API Error Response:", errorBody);
            throw new Error(`Gemini API responded with status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
            throw new Error('Invalid response from Gemini API: No content generated.');
        }

        const geminiResponseText = data.candidates[0].content.parts[0].text;

        return NextResponse.json({ result: geminiResponseText });

    } catch (error: any) {
        console.error('Error in /api/generate:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');

:root {
  --background-dark: #0a0f0a;
  --primary-green: #00ff41; /* Bright Green */
  --dim-green: #008f11;   /* Darker, dimmer green */
  --accent-cyan: #00ffff;   /* Bright Cyan */
  --white-text: #ffffff;
}

body {
  background-color: var(--background-dark);
  color: var(--primary-green);
  font-family: 'Fira Code', monospace;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Fira Code', monospace;
  color: var(--primary-green);
}

a {
  color: var(--accent-cyan);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

input[type="text"],
textarea {
  font-family: 'Fira Code', monospace;
  background-color: #000000; /* Pure Black for input fields */
  color: var(--primary-green);
  border: 1px solid var(--dim-green);
  padding: 0.5rem 0.75rem;
  caret-color: var(--primary-green);
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  border-color: var(--white-text);
  box-shadow: 0 0 0 2px var(--accent-cyan);
}

button {
  font-family: 'Fira Code', monospace;
  background-color: #000000;
  color: var(--primary-green);
  border: 1px solid var(--primary-green);
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

button:hover {
  background-color: var(--dim-green);
  border-color: var(--white-text);
  box-shadow: 0 0 10px var(--accent-cyan);
  color: var(--white-text);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  border-color: var(--dim-green);
  background-color: #000000;
  color: var(--dim-green);
}

/* Custom Class for dim green text */
.text-dim-green {
    color: var(--dim-green);
}

/* Fake typing/loading animation */
.animate-pulse {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* Optional Scanline Effect (add to body or a wrapper div) */
/*
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 65, 0.03),
    rgba(0, 255, 65, 0.03) 1px,
    transparent 1px,
    transparent 2px
  );
  z-index: 9999;
  pointer-events: none;
  opacity: 0.8;
}
*/
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');

:root {
  --background-dark: #0a0f0a;
  --primary-green: #00ff41; /* Bright Green */
  --dim-green: #008f11;   /* Darker, dimmer green */
  --accent-cyan: #00ffff;   /* Bright Cyan */
  --white-text: #ffffff;
}

body {
  background-color: var(--background-dark);
  color: var(--primary-green);
  font-family: 'Fira Code', monospace;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Fira Code', monospace;
  color: var(--primary-green);
}

a {
  color: var(--accent-cyan);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

input[type="text"],
textarea {
  font-family: 'Fira Code', monospace;
  background-color: #000000; /* Pure Black for input fields */
  color: var(--primary-green);
  border: 1px solid var(--dim-green);
  padding: 0.5rem 0.75rem;
  caret-color: var(--primary-green);
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  border-color: var(--white-text);
  box-shadow: 0 0 0 2px var(--accent-cyan);
}

button {
  font-family: 'Fira Code', monospace;
  background-color: #000000;
  color: var(--primary-green);
  border: 1px solid var(--primary-green);
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

button:hover {
  background-color: var(--dim-green);
  border-color: var(--white-text);
  box-shadow: 0 0 10px var(--accent-cyan);
  color: var(--white-text);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  border-color: var(--dim-green);
  background-color: #000000;
  color: var(--dim-green);
}

/* Custom Class for dim green text */
.text-dim-green {
    color: var(--dim-green);
}

/* Fake typing/loading animation */
.animate-pulse {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* Optional Scanline Effect (add to body or a wrapper div) */
/*
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 65, 0.03),
    rgba(0, 255, 65, 0.03) 1px,
    transparent 1px,
    transparent 2px
  );
  z-index: 9999;
  pointer-events: none;
  opacity: 0.8;
}
*/
--- END ---
```