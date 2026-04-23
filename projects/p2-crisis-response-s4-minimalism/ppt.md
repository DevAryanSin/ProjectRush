# Brief
FirstContact is a critical tool for hospitality emergency management, offering an accelerated emergency response and crisis coordination system. It empowers distressed guests with immediate, AI-powered safety guidance, while simultaneously alerting and synchronizing efforts between staff and emergency responders.

# Opportunities
## Differentiation
FirstContact differentiates itself by focusing on the immediate needs of a distressed guest, providing AI-driven, calming, step-by-step guidance directly at the point of crisis, a feature often missing in traditional staff-centric emergency systems.
## Problem Solving Approach
The solution tackles fragmented communication by creating a central, intelligent hub where guest-reported emergencies are instantly processed by AI for immediate guidance and simultaneously dispatched to human responders, ensuring a unified and swift reaction.
## USP
FirstContact's unique selling proposition is its ability to provide instantaneous, personalized, and calming first-response guidance directly to individuals in high-stress situations, making it the essential "first contact" point that bridges the gap until human help arrives.

# Features
- AI-powered immediate safety instructions tailored to the reported emergency.
- Real-time guest reporting of emergency type, location, and immediate dangers.
- Generation of clear, numbered steps for "what to do RIGHT NOW" and "what NOT to do".
- Reassurance messaging confirming help is being dispatched.
- Minimalist, intuitive UI for ease of use under pressure.

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini API (gemini-2.5-flash)
- Lucide React (for minimal iconography)

--- FILE: app/page.tsx ---
'use client';

import React, { useState, FormEvent, useMemo } from 'react';
import { Loader2 } from 'lucide-react'; // Using Loader2 for a minimalist loading spinner

interface Section {
  type: 'steps' | 'notToDo' | 'reassurance' | 'general';
  content: string[];
}

// Helper function to parse Gemini's response into structured sections
const parseGeminiResponse = (text: string): Section[] => {
  const sections: Section[] = [];
  let currentText = text.replace(/(\n\s*){3,}/g, '\n\n').trim(); // Normalize multiple newlines

  // Try to extract reassurance first (often at the end)
  const reassurancePattern = /(?:Rest assured|Stay calm|Help is on the way|Emergency services have been notified|Assistance is being dispatched|We are here to help)\b.*$/is;
  const reassuranceMatch = currentText.match(reassurancePattern);
  let reassuranceContent = '';
  if (reassuranceMatch) {
    reassuranceContent = reassuranceMatch[0].trim();
    currentText = currentText.replace(reassurancePattern, '').trim();
  }

  // Try to extract "What NOT to do"
  const notToDoPattern = /(?:What NOT to do:|Things to AVOID:|Do NOT:)\s*(\n(?:-|\*|\d+\.)\s*.*)+/is;
  const notToDoMatch = currentText.match(notToDoPattern);
  if (notToDoMatch) {
    const content = notToDoMatch[1]
      .split('\n')
      .map(line => line.replace(/^(-|\*|\d+\.\s*)/, '').trim())
      .filter(line => line.length > 0);
    if (content.length > 0) {
      sections.push({ type: 'notToDo', content });
    }
    currentText = currentText.replace(notToDoPattern, '').trim();
  }

  // Extract numbered steps (What to do RIGHT NOW)
  const stepsPattern = /(\d+\.\s*.*?)(?=\n\d+\.|\n\n|$)/gs;
  const stepMatches = [...currentText.matchAll(stepsPattern)];
  if (stepMatches.length > 0) {
    const content = stepMatches.map(match => match[1].replace(/^\d+\.\s*/, '').trim());
    sections.push({ type: 'steps', content });
    currentText = currentText.replace(stepsPattern, '').trim();
  } else if (currentText.length > 0) {
    // If no numbered steps, treat remaining text as general guidance
    sections.push({ type: 'general', content: currentText.split('\n').filter(line => line.trim().length > 0) });
  }

  // Add reassurance at the end if found
  if (reassuranceContent) {
    sections.push({ type: 'reassurance', content: [reassuranceContent] });
  }

  return sections;
};


export default function HomePage() {
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [dangers, setDangers] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedResponse = useMemo(() => response ? parseGeminiResponse(response) : [], [response]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const prompt = `Emergency type: ${emergencyType}. My current location: ${location}. Number of people with me: ${peopleCount}. Immediate dangers: ${dangers}.`;

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
        throw new Error(errorData.error || 'Something went wrong with the API.');
      }

      const data = await res.json();
      setResponse(data.result);
    } catch (err: any) {
      setError(err.message || 'Failed to get guidance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light text-dark-text py-16 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-5xl font-outfit font-bold text-center mb-4 leading-tight text-primary-accent">
          FirstContact
        </h1>
        <p className="text-xl text-center mb-12 font-inter font-light">
          Describe your emergency — get immediate calm guidance while help is on the way.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="emergencyType" className="block text-lg font-outfit font-medium mb-2">
              Type of Emergency
            </label>
            <input
              type="text"
              id="emergencyType"
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              placeholder="e.g., Fire, Medical Emergency, Security Threat"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-lg font-outfit font-medium mb-2">
              Your Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Room 305, Lobby near reception, Poolside"
              required
            />
          </div>

          <div>
            <label htmlFor="peopleCount" className="block text-lg font-outfit font-medium mb-2">
              Number of People with You (approx.)
            </label>
            <input
              type="number"
              id="peopleCount"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              placeholder="e.g., 2 adults, 1 child"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="dangers" className="block text-lg font-outfit font-medium mb-2">
              Any Immediate Dangers? (Be specific but concise)
            </label>
            <textarea
              id="dangers"
              value={dangers}
              onChange={(e) => setDangers(e.target.value)}
              placeholder="e.g., Smoke visible, person unconscious, active shooter"
              rows={3}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            suppressHydrationWarning // CRITICAL: Fix hydration error
            className="w-full mt-6 bg-primary-accent text-white py-4 px-6 text-xl font-outfit font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Sending Request...
              </>
            ) : (
              'Get Immediate Guidance'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-12 p-6 bg-red-50 border border-red-200 text-red-700 text-lg rounded-none text-center font-inter">
            <p>Error: {error}</p>
          </div>
        )}

        {response && (
          <div className="response-section mt-12 pt-8 border-t border-light-grey">
            <h2 className="text-3xl font-outfit font-bold mb-8 leading-tight text-primary-accent">Immediate Guidance</h2>
            {parsedResponse.map((section, index) => (
              <div key={index} className="mb-8">
                {section.type === 'steps' && (
                  <>
                    <h3 className="text-2xl font-outfit font-semibold mb-4 text-dark-text">What to do RIGHT NOW:</h3>
                    <ol className="list-decimal pl-6 space-y-3 text-xl leading-relaxed text-dark-text">
                      {section.content.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </>
                )}
                {section.type === 'notToDo' && section.content.length > 0 && (
                  <>
                    <h3 className="text-2xl font-outfit font-semibold mt-8 mb-4 text-dark-text">What NOT to do:</h3>
                    <ul className="list-disc pl-6 space-y-3 text-xl leading-relaxed text-dark-text">
                      {section.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
                {section.type === 'reassurance' && (
                  <p className="mt-8 text-2xl font-outfit font-semibold text-primary-accent leading-relaxed">
                    {section.content[0]}
                  </p>
                )}
                {section.type === 'general' && (
                  <div className="text-xl space-y-3 leading-relaxed text-dark-text">
                    {section.content.map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                )}
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
  try {
    const { prompt: userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
    }

    const systemPrompt = "You are a calm emergency response AI helping a distressed hotel or venue guest. Provide: (1) 3-5 immediate safety steps in simple numbered language, (2) 2-3 things NOT to do, (3) a reassuring closing statement confirming help is on the way. Keep language simple, clear, and calming. No jargon.";
    const fullPrompt = `${systemPrompt}\n\nGuest's emergency details:\n${userInput}`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
      cache: 'no-store', // Crucial for dynamic server-side content
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from Gemini API', details: errorData.error?.message || 'Unknown error' },
        { status: geminiResponse.status }
      );
    }

    const data = await geminiResponse.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No guidance received. Please try again or contact direct emergency services.';

    return NextResponse.json({ result: resultText });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts for a distinctive, professional look */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

/* Define custom CSS variables for our color palette and typography */
:root {
  --primary-accent: #E11C2B; /* Urgent Red */
  --bg-light: #fafafa; /* Off-white background */
  --dark-text: #1a1a1a; /* Near-black text */
  --light-grey: #e0e0e0; /* Fine hairline borders */
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-light);
  color: var(--dark-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', sans-serif;
  color: var(--dark-text);
  line-height: 1.2;
}

/* Custom styles for minimalist inputs */
input[type="text"],
input[type="number"],
textarea {
  @apply w-full p-4 bg-transparent border-b border-light-grey focus:outline-none focus:border-primary-accent transition-colors duration-200;
  font-size: 1.125rem; /* Large text size for readability */
  line-height: 1.5;
  color: var(--dark-text);
}

textarea {
    resize: vertical; /* Allow vertical resizing */
    min-height: 120px;
}

/* Placeholder styling */
input::placeholder,
textarea::placeholder {
  color: #a0a0a0; /* Slightly lighter grey for placeholders */
  opacity: 1; /* Ensure full opacity in Firefox */
  font-family: 'Inter', sans-serif;
  font-weight: 300;
}

/* Focus styles for inputs - remove default rings */
input:focus,
textarea:focus {
  outline: none;
  box-shadow: none;
}

/* Base button styling */
button {
  @apply text-white py-3 px-6 text-lg font-semibold transition-colors duration-200;
  background-color: var(--primary-accent);
  border-radius: 0; /* Sharp edges for minimalism */
  border: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
}

button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .max-w-xl {
    @apply max-w-full px-4;
  }

  h1 {
    font-size: 3rem; /* Adjust for smaller screens */
  }

  .text-xl {
    font-size: 1.125rem;
  }

  input[type="text"],
  input[type="number"],
  textarea {
    font-size: 1rem;
    padding: 12px;
  }

  button {
    font-size: 1.125rem;
    padding: 14px;
  }
}
--- END ---