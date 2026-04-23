# Brief
CargoDebrief is a specialized tool for supply chain managers to conduct deep-dive post-mortems on logistics delays. Users input incident details, and Gemini AI provides structured analysis, actionable prevention plans, and identifies systemic vulnerabilities, enhancing operational resilience.

# Opportunities
## Differentiation
CargoDebrief stands out by offering an AI-powered, forensic analysis of supply chain incidents, moving beyond mere incident logging to generate proactive prevention strategies. Its "Glass UI" provides a premium, intuitive user experience, distinct from typical enterprise tools.
## Problem Solving Approach
The tool addresses the chronic issue of reactive responses to supply chain disruptions by providing an objective, AI-driven root cause analysis and a concrete, prioritized prevention checklist. It translates complex incident data into clear, actionable intelligence, fostering continuous improvement.
## USP
Its Unique Selling Proposition is the combination of an advanced AI post-mortem engine with a modern, high-fidelity Glass UI, delivering both deep analytical insight and an exceptional user experience for critical supply chain incident management.

# Features
- AI-powered forensic post-mortem analysis of supply chain incidents.
- Structured output including timeline, 5-Why root cause analysis, and systemic weaknesses.
- Generates key lessons learned and a prioritized, actionable prevention checklist.
- Intuitive and responsive Glass UI design with dark mode and accent glows.
- Real-time loading states and graceful error handling.

# Technologies
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS with custom Glass UI variables, Google Fonts
- **Icons:** Lucide React
- **Backend:** Next.js API Routes (server-side)
- **AI Integration:** Google Gemini 2.5 Flash

--- FILE: app/page.tsx ---
'use client';

import { useState, useCallback, useRef } from 'react';
import { Lightbulb, AlertTriangle, Hourglass, CheckCircle, TrendingUp, Users, SendHorizonal, ClipboardList, Clock, Info, XCircle } from 'lucide-react';

interface ResultSectionProps {
  title: string;
  content: string | string[];
  icon: React.ElementType;
  colorClass: string;
}

const ResultSection: React.FC<ResultSectionProps> = ({ title, content, icon: Icon, colorClass }) => {
  if (!content || (Array.isArray(content) && content.length === 0)) return null;

  const displayContent = Array.isArray(content) ? (
    <ul className="list-disc pl-5 space-y-1">
      {content.map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ul>
  ) : (
    <p className="text-light-grey leading-relaxed">{content.trim()}</p>
  );

  return (
    <div className="relative p-5 rounded-lg glass-card border border-border-color shadow-lg flex flex-col gap-3">
      <div className={`absolute -inset-0.5 rounded-lg animate-gradient-border opacity-75 blur-sm ${colorClass}`} style={{ zIndex: -1 }}></div>
      <div className="flex items-center gap-3 text-lg font-semibold text-text-light">
        <Icon className={`w-6 h-6 ${colorClass.replace('from-', 'text-')}`} />
        {title}
      </div>
      <div className="text-sm">
        {displayContent}
      </div>
    </div>
  );
};

export default function HomePage() {
  const [whatHappened, setWhatHappened] = useState('');
  const [timelineEvents, setTimelineEvents] = useState('');
  const [rootCauseKnown, setRootCauseKnown] = useState('');
  const [businessImpact, setBusinessImpact] = useState('');
  const [teamsInvolved, setTeamsInvolved] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const promptText = `
    Incident Description: ${whatHappened}
    Timeline of Events: ${timelineEvents}
    Known Root Cause (if any): ${rootCauseKnown}
    Business Impact: ${businessImpact}
    Teams Involved: ${teamsInvolved}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong during analysis.');
      }

      const data = await response.json();
      const rawResult = data.result;

      // Basic parsing of the Gemini response based on expected headings
      const parsedResult = {
        timeline: extractSection(rawResult, 'Structured Timeline of Failure:', 'Root Cause Analysis (5-Why Format):'),
        rootCause: extractSection(rawResult, 'Root Cause Analysis (5-Why Format):', 'Systemic Weaknesses Identified:'),
        weaknesses: extractSectionAsList(rawResult, 'Systemic Weaknesses Identified:', 'Key Lessons Learned:'),
        lessons: extractSectionAsList(rawResult, 'Key Lessons Learned:', 'Prioritized Prevention Checklist:'),
        prevention: extractSectionAsList(rawResult, 'Prioritized Prevention Checklist:', null),
      };

      setResult(parsedResult);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to analyze incident. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [whatHappened, timelineEvents, rootCauseKnown, businessImpact, teamsInvolved]);

  const extractSection = (text: string, startMarker: string, endMarker: string | null): string => {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return '';

    let endIndex = text.length;
    if (endMarker) {
      const tempEndIndex = text.indexOf(endMarker, startIndex + startMarker.length);
      if (tempEndIndex !== -1) {
        endIndex = tempEndIndex;
      }
    }

    let section = text.substring(startIndex + startMarker.length, endIndex).trim();
    // Remove markdown list markers if present at the beginning of lines
    section = section.split('\n').map(line => line.replace(/^[*-]\s*/, '')).join('\n').trim();
    return section;
  };

  const extractSectionAsList = (text: string, startMarker: string, endMarker: string | null): string[] => {
    const sectionText = extractSection(text, startMarker, endMarker);
    if (!sectionText) return [];
    // Split by newlines and filter out empty lines, then trim each item.
    return sectionText.split('\n').map(item => item.trim()).filter(item => item.length > 0);
  };


  return (
    <div className="min-h-screen background-gradient text-text-light font-inter">
      <header className="py-4 border-b border-border-color px-6 md:px-12 flex items-center justify-between z-10 relative">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-text-light tracking-wide gradient-text">
          CargoDebrief
        </h1>
        <p className="hidden md:block text-sm text-text-light opacity-75 ml-4">
          After a delay, describe what happened — get a full post-mortem and prevention plan.
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-0">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="relative glass-card p-6 md:p-8 rounded-lg border border-border-color shadow-lg">
            <div className="absolute -inset-0.5 rounded-lg animate-gradient-border opacity-75 blur-sm from-accent-teal to-accent-amber" style={{ zIndex: -1 }}></div>
            <h2 className="text-2xl font-orbitron font-semibold mb-6 text-text-light flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-accent-teal" /> Incident Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
              <div>
                <label htmlFor="whatHappened" className="block text-sm font-medium text-text-light mb-2">
                  What happened? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="whatHappened"
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  rows={4}
                  className="input-glass"
                  placeholder="Describe the incident in detail..."
                  required
                  disabled={isLoading}
                  suppressHydrationWarning
                ></textarea>
              </div>

              <div>
                <label htmlFor="timelineEvents" className="block text-sm font-medium text-text-light mb-2">
                  Timeline of events <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="timelineEvents"
                  value={timelineEvents}
                  onChange={(e) => setTimelineEvents(e.target.value)}
                  rows={4}
                  className="input-glass"
                  placeholder="e.g., Nov 1: Shipment departed. Nov 3: Weather delay in Chicago. Nov 5: Cargo arrived damaged..."
                  required
                  disabled={isLoading}
                  suppressHydrationWarning
                ></textarea>
              </div>

              <div>
                <label htmlFor="rootCauseKnown" className="block text-sm font-medium text-text-light mb-2">
                  Root cause (if known)
                </label>
                <textarea
                  id="rootCauseKnown"
                  value={rootCauseKnown}
                  onChange={(e) => setRootCauseKnown(e.target.value)}
                  rows={3}
                  className="input-glass"
                  placeholder="If already identified, describe the root cause..."
                  disabled={isLoading}
                  suppressHydrationWarning
                ></textarea>
              </div>

              <div>
                <label htmlFor="businessImpact" className="block text-sm font-medium text-text-light mb-2">
                  Business impact <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="businessImpact"
                  value={businessImpact}
                  onChange={(e) => setBusinessImpact(e.target.value)}
                  rows={3}
                  className="input-glass"
                  placeholder="e.g., $50,000 lost revenue, 20 customer complaints, production line halted..."
                  required
                  disabled={isLoading}
                  suppressHydrationWarning
                ></textarea>
              </div>

              <div>
                <label htmlFor="teamsInvolved" className="block text-sm font-medium text-text-light mb-2">
                  Teams involved
                </label>
                <textarea
                  id="teamsInvolved"
                  value={teamsInvolved}
                  onChange={(e) => setTeamsInvolved(e.target.value)}
                  rows={2}
                  className="input-glass"
                  placeholder="e.g., Logistics, Operations, Sales, Customer Service..."
                  disabled={isLoading}
                  suppressHydrationWarning
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                  suppressHydrationWarning
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Hourglass className="animate-spin" size={20} /> Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SendHorizonal size={20} /> Get Post-Mortem Report
                    </div>
                  )}
                </button>
              </div>
            </form>
          </section>

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-t-4 border-transparent border-t-accent-teal animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-b-4 border-transparent border-b-accent-amber animate-spin-reverse"></div>
                <div className="absolute inset-0 flex items-center justify-center text-accent-teal">
                  <Lightbulb className="w-8 h-8 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="relative glass-card p-6 rounded-lg border border-red-500/30 shadow-lg text-red-400">
              <div className="absolute -inset-0.5 rounded-lg animate-gradient-border opacity-75 blur-sm from-red-500 to-red-700" style={{ zIndex: -1 }}></div>
              <h3 className="text-xl font-orbitron font-semibold mb-4 flex items-center gap-2">
                <XCircle className="w-6 h-6" /> Error
              </h3>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {result && (
            <section ref={resultRef} className="space-y-6">
              <h2 className="text-3xl font-orbitron font-semibold text-text-light mt-8 mb-6 text-center">
                AI-Powered Post-Mortem Report
              </h2>

              <ResultSection
                title="Structured Timeline of Failure"
                content={result.timeline}
                icon={Clock}
                colorClass="from-cyan-500 to-sky-500"
              />
              <ResultSection
                title="Root Cause Analysis (5-Why Format)"
                content={result.rootCause}
                icon={Info}
                colorClass="from-emerald-500 to-green-500"
              />
              <ResultSection
                title="Systemic Weaknesses Identified"
                content={result.weaknesses}
                icon={AlertTriangle}
                colorClass="from-orange-500 to-amber-500"
              />
              <ResultSection
                title="Key Lessons Learned"
                content={result.lessons}
                icon={Lightbulb}
                colorClass="from-purple-500 to-fuchsia-500"
              />
              <ResultSection
                title="Prioritized Prevention Checklist"
                content={result.prevention}
                icon={CheckCircle}
                colorClass="from-teal-500 to-emerald-500"
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
  }

  const { prompt: userInput } = await req.json();

  if (!userInput) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const systemPrompt = "You are a supply chain post-mortem analyst. Analyze this incident and produce: structured timeline of failure, root cause analysis (5-Why format), 3 systemic weaknesses identified, key lessons learned, and a prioritized prevention checklist (5 items, ordered by impact). Be forensic and constructive.";

  const fullPrompt = `${systemPrompt}\n\nUser Input:\n${userInput}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: fullPrompt },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: errorData.error?.message || 'Failed to get response from Gemini API' }, { status: response.status });
    }

    const data = await response.json();
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!geminiText) {
      return NextResponse.json({ error: 'No text content received from Gemini API' }, { status: 500 });
    }

    return NextResponse.json({ result: geminiText });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap');

:root {
  --background: #0d1117; /* Very dark GitHub-like background */
  --card-bg: rgba(255, 255, 255, 0.06); /* Slightly more opaque glass */
  --border-color: rgba(255, 255, 255, 0.1); /* Subtle white border */
  --text-color: #e0e0e0; /* Light grey for general text */
  --text-light: #f8f8f8; /* Lighter grey for headings/important text */

  /* Industrial Teal and Amber accents */
  --accent-teal: #00ADB5; /* Example: Cyan-500-ish */
  --accent-amber: #FFC107; /* Example: Amber-500-ish */

  --focus-glow-color: var(--accent-teal); /* Default focus glow */
}

html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
  background-color: var(--background);
}

.background-gradient {
  background: radial-gradient(at 20% 40%, rgba(0, 173, 181, 0.08) 0%, transparent 50%),
              radial-gradient(at 80% 60%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
              var(--background);
  min-height: 100vh;
}

.gradient-text {
  background: linear-gradient(90deg, var(--accent-teal), var(--accent-amber));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); /* Safari support */
}

/* Input Fields */
.input-glass {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.04); /* Slightly darker glass for inputs */
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  color: var(--text-light);
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  resize: vertical;
}

.input-glass::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input-glass:focus {
  outline: none;
  border-color: var(--focus-glow-color);
  box-shadow: 0 0 0 3px rgba(0, 173, 181, 0.3), /* Teal glow */
              inset 0 0 0 1px var(--focus-glow-color);
}

.input-glass:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.08);
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, var(--accent-teal), var(--accent-amber));
  color: #0d1117; /* Dark text for contrast */
  cursor: pointer;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-position 0.3s ease;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.btn-primary:hover::before {
  opacity: 1;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 173, 181, 0.4), 0 2px 5px rgba(255, 193, 7, 0.3);
}

.btn-primary:disabled {
  background: linear-gradient(90deg, #00ADB550, #FFC10750);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-primary:disabled::before {
  opacity: 0;
}


/* Animated Gradient Border */
@keyframes gradient-border-animation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-border {
  background: linear-gradient(to right,
    var(--tw-gradient-from, #00ADB5) 0%,
    #00ADB5 25%,
    #FFC107 50%,
    #00ADB5 75%,
    var(--tw-gradient-to, #FFC107) 100%
  );
  background-size: 200% 200%;
  animation: gradient-border-animation 6s ease infinite;
}

/* Utility for Lucide Icons Color */
.text-accent-teal { color: var(--accent-teal); }
.text-accent-amber { color: var(--accent-amber); }

/* Custom colors for result sections */
.from-cyan-500 { --tw-gradient-from: #06B6D4; } /* Tailwind cyan-500 */
.to-sky-500 { --tw-gradient-to: #0EA5E9; }     /* Tailwind sky-500 */
.from-emerald-500 { --tw-gradient-from: #10B981; } /* Tailwind emerald-500 */
.to-green-500 { --tw-gradient-to: #22C55E; }   /* Tailwind green-500 */
.from-orange-500 { --tw-gradient-from: #F97316; } /* Tailwind orange-500 */
.to-amber-500 { --tw-gradient-to: #F59E0B; }   /* Tailwind amber-500 */
.from-purple-500 { --tw-gradient-from: #A855F7; } /* Tailwind purple-500 */
.to-fuchsia-500 { --tw-gradient-to: #D946EF; }  /* Tailwind fuchsia-500 */
.from-teal-500 { --tw-gradient-from: #14B8A6; } /* Tailwind teal-500 */
/* .to-emerald-500 is defined above */

/* Animation for loading spinner (if needed) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 1.5s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

--- END ---