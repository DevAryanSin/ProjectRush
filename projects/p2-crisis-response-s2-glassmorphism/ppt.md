# Brief
CrisisSync provides a critical solution for hospitality venues to manage emergencies with speed and precision. Leveraging Gemini AI, it transforms chaotic incident reports into structured, actionable coordination plans, ensuring every team member knows their role and critical actions during a crisis.

# Opportunities
## Differentiation
CrisisSync differentiates itself by offering dynamic, AI-generated, role-specific checklists tailored to real-time incident parameters, rather than static protocols. Its intuitive Glassmorphism UI enhances user experience under pressure, providing clarity and focus.
## Problem Solving Approach
The solution centralizes crisis information and decentralizes action. By integrating user input on venue, crisis, status, and available teams, CrisisSync generates a live operational plan. This eliminates communication silos, enabling rapid, coordinated responses that protect lives and property more effectively.
## USP
The unique selling proposition of CrisisSync is its ability to deliver **dynamic, AI-powered, real-time crisis coordination checklists** that adapt to specific, evolving emergency scenarios in hospitality, ensuring immediate and precise team response.

# Features
- **AI-Powered Dynamic Checklists**: Generate immediate, short-term, and escalation actions based on live incident data.
- **Role Assignment & Urgency Flagging**: Clearly assign tasks to specific roles and highlight time-critical actions.
- **Intuitive Glassmorphism UI**: A visually distinct and user-friendly interface designed for high-stress environments.
- **Responsive Design**: Accessible and fully functional across mobile and desktop devices.
- **Seamless Gemini API Integration**: Leverages `gemini-2.5-flash` for intelligent crisis response generation.

# Technologies
- **Frontend Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons**: Lucide-React
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`)

Constraints:
- No fluff
- No repetition
- Keep concise
- Bullet points where appropriate

--- FILE: app/page.tsx ---
'use client';

import { useState, FormEvent, useRef } from 'react';
import { Zap, Loader2, MessageSquareWarning, XCircle } from 'lucide-react';

interface ResultSection {
  title: string;
  content: string;
  urgent?: boolean;
}

export default function CrisisSyncPage() {
  const [venueType, setVenueType] = useState<string>('');
  const [crisisType, setCrisisType] = useState<string>('');
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [teamsAvailable, setTeamsAvailable] = useState<string>('');
  const [timeElapsed, setTimeElapsed] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultSection[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const parseGeminiOutput = (text: string): ResultSection[] => {
    const sections: ResultSection[] = [];
    const rawSections = text.split(/(IMMEDIATE \(0-5 min\):|SHORT-TERM \(5-30 min\):|ESCALATION TRIGGERS:)/g);

    // Filter out empty strings and process
    for (let i = 1; i < rawSections.length; i += 2) {
      const title = rawSections[i].trim();
      const content = rawSections[i + 1]?.trim() || '';
      if (title && content) {
        sections.push({
          title: title.replace(':', ''),
          content: content,
          urgent: title.includes("IMMEDIATE") || title.includes("ESCALATION")
        });
      }
    }
    return sections;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const userInput = `Venue Type: ${venueType}, Crisis Type: ${crisisType}, Current Status: ${currentStatus}, Teams Available: ${teamsAvailable}, Time Elapsed: ${timeElapsed} minutes.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        setResult(parseGeminiOutput(data.result));
      } else {
        setError("No result found from AI. Please try again.");
      }
    } catch (err: any) {
      console.error('Failed to fetch:', err);
      setError(`Failed to generate crisis plan: ${err.message || 'Unknown error'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen p-4 flex flex-col items-center justify-center font-poppins text-white overflow-hidden">
      {/* Background orbs */}
      <div className="gradient-orb-1"></div>
      <div className="gradient-orb-2"></div>
      <div className="gradient-orb-3"></div>

      <div className="relative z-10 w-full max-w-4xl animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6 drop-shadow-lg leading-tight text-gradient-title">
          CrisisSync
        </h1>
        <p className="text-center text-xl md:text-2xl text-white/80 mb-10 tracking-wide">
          Accelerated Emergency Response and Crisis Coordination in Hospitality
        </p>

        {/* Input Form Card */}
        <div className="glass-card p-8 md:p-10 mb-8 w-full">
          <h2 className="text-3xl font-semibold mb-6 text-white text-center">Input Your Crisis Situation</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={formRef}>
            <div>
              <label htmlFor="venueType" className="block text-white/90 text-sm font-medium mb-2">Venue Type</label>
              <select
                id="venueType"
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                required
                className="glass-input w-full p-3 rounded-lg focus:ring-2 focus:ring-accent-red"
              >
                <option value="" disabled>Select venue type</option>
                <option value="Hotel">Hotel</option>
                <option value="Resort">Resort</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Event Venue">Event Venue</option>
                <option value="Cruise Ship">Cruise Ship</option>
                <option value="Bar/Club">Bar/Club</option>
                <option value="Theme Park">Theme Park</option>
                <option value="Casino">Casino</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="crisisType" className="block text-white/90 text-sm font-medium mb-2">Crisis Type</label>
              <select
                id="crisisType"
                value={crisisType}
                onChange={(e) => setCrisisType(e.target.value)}
                required
                className="glass-input w-full p-3 rounded-lg focus:ring-2 focus:ring-accent-red"
              >
                <option value="" disabled>Select crisis type</option>
                <option value="Fire">Fire</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Active Threat">Active Threat</option>
                <option value="Natural Disaster">Natural Disaster (e.g., Flood, Earthquake)</option>
                <option value="Power Outage">Power Outage</option>
                <option value="Security Breach">Security Breach</option>
                <option value="Guest Disturbance">Guest Disturbance</option>
                <option value="Terrorist Attack">Terrorist Attack</option>
                <option value="Chemical Spill">Chemical Spill</option>
                <option value="Utility Failure">Utility Failure (e.g., Water, HVAC)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="currentStatus" className="block text-white/90 text-sm font-medium mb-2">Current Status & Details</label>
              <textarea
                id="currentStatus"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                rows={3}
                placeholder="e.g., Small fire on 3rd floor, guests evacuating, 2 injuries reported."
                required
                className="glass-input w-full p-3 rounded-lg focus:ring-2 focus:ring-accent-red resize-y"
              ></textarea>
            </div>

            <div>
              <label htmlFor="teamsAvailable" className="block text-white/90 text-sm font-medium mb-2">Teams Available On-site</label>
              <input
                type="text"
                id="teamsAvailable"
                value={teamsAvailable}
                onChange={(e) => setTeamsAvailable(e.target.value)}
                placeholder="e.g., Security, Front Desk, Engineering, F&B"
                required
                className="glass-input w-full p-3 rounded-lg focus:ring-2 focus:ring-accent-red"
              />
            </div>

            <div>
              <label htmlFor="timeElapsed" className="block text-white/90 text-sm font-medium mb-2">Time Elapsed (minutes)</label>
              <input
                type="number"
                id="timeElapsed"
                value={timeElapsed}
                onChange={(e) => setTimeElapsed(e.target.value)}
                min="0"
                placeholder="e.g., 15"
                required
                className="glass-input w-full p-3 rounded-lg focus:ring-2 focus:ring-accent-red"
              />
            </div>

            <div className="md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                disabled={isLoading || !venueType || !crisisType || !currentStatus || !teamsAvailable || timeElapsed === ''}
                className="glass-button w-full md:w-auto px-8 py-3 rounded-full text-lg font-semibold flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                suppressHydrationWarning
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2" size={20} />
                    Generate Crisis Plan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="glass-card text-center p-8 md:p-10 mb-8 w-full flex flex-col items-center justify-center animate-fade-in">
            <Loader2 className="animate-spin text-accent-red mb-4" size={48} />
            <p className="text-xl text-white/90">Analyzing situation and generating immediate response plan...</p>
          </div>
        )}

        {error && (
          <div className="glass-card p-8 md:p-10 mb-8 w-full border-red-500 text-red-300 flex items-center justify-center animate-fade-in">
            <XCircle className="text-red-500 mr-4" size={32} />
            <p className="text-lg font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && !isLoading && (
          <div className="results-grid animate-fade-in mt-10">
            <h2 className="text-4xl font-bold text-center mb-8 text-gradient-title drop-shadow-lg">Coordination Checklist</h2>
            {result.map((section, index) => (
              <div key={index} className={`glass-card p-6 md:p-8 mb-6 ${section.urgent ? 'border-accent-red/40 shadow-red-glow' : ''}`}>
                <h3 className={`text-2xl font-bold mb-4 ${section.urgent ? 'text-accent-red' : 'text-white/95'}`}>
                  {section.title}
                </h3>
                <div className="prose prose-invert max-w-none text-white/80 leading-relaxed">
                  {section.content.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className="mb-2 last:mb-0 text-lg">
                      {line.startsWith('-') ? (
                        <>
                          <span className="text-accent-red mr-2">•</span>
                          {line.substring(1).trim()}
                        </>
                      ) : line.trim()}
                    </p>
                  ))}
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
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  try {
    const { prompt: userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const fullGeminiPrompt = `You are a hospitality crisis coordinator AI. For this situation: "${userInput}", generate a dynamic coordination checklist organized by: IMMEDIATE (0-5 min):, SHORT-TERM (5-30 min):, and ESCALATION TRIGGERS:. Assign each action to a specific role. Flag time-critical items with urgency markers. Ensure the output is easy to parse with clear headings for each section. Provide actions as bullet points under each heading.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullGeminiPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: `Gemini API error: ${errorData.error?.message || 'Unknown error'}` }, { status: response.status });
    }

    const data = await response.json();
    const geminiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';

    return NextResponse.json({ result: geminiResponseText });

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Poppins font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap');

:root {
  --background-start-rgb: 0, 0, 20;
  --background-end-rgb: 0, 0, 40;
  --glass-bg-color: rgba(255, 255, 255, 0.08);
  --glass-border-color: rgba(255, 255, 255, 0.18);
  --glass-shadow-color: rgba(0, 0, 0, 0.3);
  --accent-red: #ef4444; /* Tailwind red-500 */
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(135deg, rgb(var(--background-start-rgb)) 0%, rgb(var(--background-end-rgb)) 100%);
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Glassmorphism Card Style */
.glass-card {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: var(--glass-bg-color);
  border: 1px solid var(--glass-border-color);
  border-radius: 16px;
  box-shadow: 0 8px 32px var(--glass-shadow-color);
  animation: fadeIn 0.8s ease-out;
}

/* Glassmorphism Input Style */
.glass-input {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border-color);
  color: white;
  transition: all 0.3s ease;
}
.glass-input:focus {
  outline: none;
  border-color: var(--accent-red);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3); /* Softer red glow */
}
.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Glassmorphism Button Style */
.glass-button {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(255, 99, 71, 0.8) 100%); /* Red/Orange gradient */
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.glass-button:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 99, 71, 0.9) 0%, rgba(239, 68, 68, 0.9) 100%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.glass-button:disabled {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
  box-shadow: none;
}

/* Background gradient orbs */
.gradient-orb-1, .gradient-orb-2, .gradient-orb-3 {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px); /* Increased blur */
  opacity: 0.6;
  z-index: 0;
  animation: floatOrb 15s infinite ease-in-out;
}

.gradient-orb-1 {
  width: 300px;
  height: 300px;
  background: #6D28D9; /* Deep Purple */
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.gradient-orb-2 {
  width: 400px;
  height: 400px;
  background: #DC2626; /* Strong Red */
  bottom: 5%;
  right: 15%;
  animation-delay: 5s;
}

.gradient-orb-3 {
  width: 350px;
  height: 350px;
  background: #FACC15; /* Amber/Yellow */
  top: 25%;
  right: 5%;
  animation-delay: 10s;
}

@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, 30px) scale(1.05); }
  66% { transform: translate(-10px, -20px) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}


/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
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
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Text Gradients */
.text-gradient-title {
  background: linear-gradient(90deg, #FF6B6B 0%, #FFD700 50%, #FF6B6B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shimmer 3s infinite linear;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Responsive grid for results */
.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* Equivalent to gap-6 */
}

@media (min-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

/* Red glow for critical cards */
.shadow-red-glow {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4), 0 8px 32px var(--glass-shadow-color);
}
--- END ---