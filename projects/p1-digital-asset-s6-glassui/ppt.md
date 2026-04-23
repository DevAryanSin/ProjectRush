# Brief
RightsDesk addresses the critical problem of widespread digital misappropriation and intellectual property violations faced by sports organizations due to the vast and untracked dissemination of their high-value digital media. It aims to provide a proactive solution for identifying, tracking, and flagging unauthorized content usage.

# Opportunities
## Differentiation
RightsDesk differentiates itself through its innovative use of AI as a 'digital rights advisor' for sports media, offering near real-time insights and actionable recommendations, which is a significant advancement over traditional, reactive IP management systems.
## Problem Solving Approach
The solution centralizes IP rights management by enabling organizations to register assets and query rights status through a natural language interface. Gemini AI processes these queries and asset details, providing comprehensive assessments and protection strategies, thus closing the visibility gap and empowering proactive defense against misappropriation.
## USP
The unique selling proposition is its intelligent, AI-powered "digital rights advisor" capability, providing immediate, context-aware legal and strategic guidance for sports media assets within a sleek, intuitive Glass UI.

# Features
- **AI-Powered Rights Consultation**: Users can submit asset details or natural language questions to receive immediate rights assessments and strategic recommendations from a Gemini AI advisor.
- **Glass UI Design**: A premium, dark-mode interface with translucent glass cards, defined borders, and glowing accents, providing a modern and professional user experience.
- **Structured Output Display**: Gemini AI responses are parsed and presented with a clear visual hierarchy, breaking down complex information into digestible sections like ownership, protections, licensing, and recommended actions.
- **Responsive Design**: The application is fully responsive, ensuring optimal usability across desktop and mobile devices.

# Technologies
- **Frontend Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS (Glass UI, variables)
- **Icons**: Lucide-React
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`)

--- FILE: app/page.tsx ---
'use client';

import { useState, FormEvent, useRef } from 'react';
import { Rocket, MessageSquareText, ClipboardCheck, Lightbulb, Loader2, Bot, Info, Shield, Scale } from 'lucide-react';

interface ResultSection {
  title: string;
  icon: React.ElementType;
  content: string;
}

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const parseGeminiResult = (rawResult: string): ResultSection[] => {
    const sections: ResultSection[] = [];
    const keywords = [
      { key: "Ownership Status:", title: "Ownership Status", icon: Scale },
      { key: "Applicable Protections:", title: "Applicable Protections", icon: Shield },
      { key: "Licensing Options:", title: "Licensing Options", icon: Lightbulb },
      { key: "Recommended Actions:", title: "Recommended Actions", icon: ClipboardCheck },
    ];

    let remainingText = rawResult;
    keywords.forEach(({ key, title, icon }) => {
      const startIndex = remainingText.indexOf(key);
      if (startIndex !== -1) {
        const contentStart = startIndex + key.length;
        let nextKeywordIndex = rawResult.length;

        // Find the start of the next keyword in the original rawResult
        // to correctly delimit the current section's content
        let minNextIndex = rawResult.length;
        keywords.forEach(nextK => {
          if (nextK.key !== key) { // Don't compare with itself
            const index = rawResult.indexOf(nextK.key, contentStart);
            if (index !== -1 && index < minNextIndex) {
              minNextIndex = index;
            }
          }
        });
        
        const sectionContent = rawResult.substring(contentStart, minNextIndex).trim();
        if (sectionContent) {
          sections.push({ title, icon, content: sectionContent });
        }
        remainingText = remainingText.substring(minNextIndex - rawResult.indexOf(remainingText)).trim(); // Update remaining text for subsequent searches
      }
    });

    // If there's any initial text before the first recognized keyword, treat it as a general overview
    if (sections.length > 0 && rawResult.startsWith(sections[0].content)) {
      // This case means the first section's content *is* the beginning of the rawResult.
      // Need to refine this to capture preamble.
      // For simplicity, if we found structured sections, we assume the initial text is handled by the first section.
      // If we want a separate 'Overview' before the first found keyword, we'd need another pass.
    } else if (rawResult.trim() && sections.length === 0) {
      // If no structured keywords found but there's content, show it as general info
      sections.push({ title: "Rights Assessment", icon: Info, content: rawResult.trim() });
    } else if (sections.length === 0 && rawResult.trim()) {
      // Fallback for any content not caught by specific keywords
      sections.push({ title: "General Information", icon: Info, content: rawResult.trim() });
    }

    return sections;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong during the API call.');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
      console.error('API call failed:', err);
      setError(err.message || 'Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parsedResults = result ? parseGeminiResult(result) : [];

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col items-center p-4 font-body">
      <header className="w-full max-w-4xl py-6 mb-8 flex justify-between items-center z-10 relative">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-accent drop-shadow-lg flex items-center gap-3">
          <Rocket className="w-9 h-9 md:w-11 md:h-11 text-accent animate-pulse-slow" /> RightsDesk
        </h1>
        <nav>
          {/* Optional nav items could go here */}
        </nav>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-8 z-10 relative">
        {/* Input Card */}
        <section className="glass-card p-6 md:p-8 relative overflow-hidden">
          <h2 className="text-2xl font-display font-semibold mb-6 text-text-primary flex items-center gap-3">
            <MessageSquareText className="text-accent w-7 h-7" /> What asset details or rights question do you have?
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <textarea
              ref={inputRef}
              className="glass-input w-full p-4 h-32 md:h-40 resize-y text-lg"
              placeholder="E.g., Register the '2024 Championship Highlights' video. Or, 'What are the licensing rights for using NBA game footage in a documentary?'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              suppressHydrationWarning
            ></textarea>
            <button
              type="submit"
              className="glass-button w-full py-3 text-lg font-semibold flex items-center justify-center gap-2"
              disabled={isLoading || !input.trim()}
              suppressHydrationWarning
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Bot className="w-6 h-6" /> Analyze Rights
                </>
              )}
            </button>
          </form>
        </section>

        {/* Results / Error Display */}
        {error && (
          <div className="glass-card bg-red-900/10 border-red-800 p-6 md:p-8 text-red-300">
            <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <Info className="text-red-400" /> Error
            </h3>
            <p className="font-body text-red-300">{error}</p>
          </div>
        )}

        {parsedResults.length > 0 && (
          <section className="glass-card p-6 md:p-8 relative overflow-hidden">
            <h2 className="text-2xl font-display font-semibold mb-6 text-text-primary flex items-center gap-3">
              <Bot className="text-accent w-7 h-7" /> RightsDesk AI Analysis
            </h2>
            <div className="flex flex-col gap-6">
              {parsedResults.map((section, index) => (
                <div key={index} className="glass-panel p-4 md:p-6 transition-all duration-300 hover:border-accent hover:shadow-glow-sm">
                  <h3 className="text-xl font-display font-semibold mb-3 text-accent flex items-center gap-2">
                    <section.icon className="w-5 h-5" /> {section.title}
                  </h3>
                  <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed font-body" dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }}></div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Subtle background gradient for aesthetic */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-blob-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500 opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-blob-slow animation-delay-2000" />
      </div>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
  }

  try {
    const { prompt: userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = "You are a sports media rights advisor. Answer this rights question or analyze this asset registration clearly and practically. Cover: ownership status, applicable protections, licensing options, and top 3 recommended actions. Use plain language alongside precise legal terms.";
    const fullPrompt = `${systemPrompt}\n\nUser Input: ${userInput}`;

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: errorData.error?.message || 'Gemini API call failed' }, { status: geminiResponse.status });
    }

    const data = await geminiResponse.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';

    return NextResponse.json({ result: resultText });

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-background: #0A0D14; /* Deep Navy */
    --color-accent: #FFD700;   /* Electric Gold */
    --color-text-primary: #E0E0E0;
    --color-text-secondary: #B0B0B0;
    --color-card-bg-rgb: 255, 255, 255; /* For rgba */
    --color-border-rgb: 255, 255, 255; /* For rgba */
    --color-glow: rgba(255, 215, 0, 0.4); /* Gold glow */
    --font-display: 'Exo 2', sans-serif;
    --font-body: 'Exo 2', sans-serif;
  }

  body {
    @apply antialiased;
    background-color: var(--color-background);
    color: var(--color-text-primary);
    font-family: var(--font-body);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
  }

  /* Custom Glow for Focus/Hover */
  .shadow-glow {
    box-shadow: 0 0 15px var(--color-glow);
  }
  .shadow-glow-sm {
    box-shadow: 0 0 8px var(--color-glow);
  }
}

@layer components {
  .glass-card {
    background: rgba(var(--color-card-bg-rgb), 0.05); /* 5% white */
    backdrop-filter: blur(8px);
    border: 1px solid rgba(var(--color-border-rgb), 0.1); /* 10% white */
    @apply rounded-xl shadow-lg transition-all duration-300;
  }

  .glass-input {
    background: rgba(var(--color-card-bg-rgb), 0.03); /* Slightly darker glass for input */
    backdrop-filter: blur(5px);
    border: 1px solid rgba(var(--color-border-rgb), 0.08);
    @apply rounded-lg text-text-primary placeholder-text-secondary outline-none transition-all duration-300;

    &:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px var(--color-accent), 0 0 10px var(--color-glow);
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      border-color: rgba(var(--color-border-rgb), 0.05);
      box-shadow: none;
    }
  }

  .glass-button {
    background: linear-gradient(90deg, #ffc800 0%, #ff8c00 100%); /* Electric gold gradient */
    color: var(--color-background); /* Dark text on gold button */
    @apply rounded-lg px-6 py-3 font-semibold transition-all duration-300 relative overflow-hidden;
    
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transition: width 0.4s ease-out, height 0.4s ease-out, top 0.4s ease-out, left 0.4s ease-out;
      transform: translate(-50%, -50%);
      opacity: 0;
    }

    &:hover:before {
      width: 300%;
      height: 300%;
      opacity: 1;
    }
    
    &:hover {
      box-shadow: 0 0 15px var(--color-glow);
      transform: translateY(-2px);
    }
    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
    &:disabled {
      background: rgba(var(--color-card-bg-rgb), 0.15);
      color: var(--color-text-secondary);
      cursor: not-allowed;
      opacity: 0.7;
      box-shadow: none;
      transform: none;
    }
    &:disabled:before {
      width: 0;
      height: 0;
      opacity: 0;
    }
  }

  .glass-panel {
    background: rgba(var(--color-card-bg-rgb), 0.03);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(var(--color-border-rgb), 0.08);
    @apply rounded-lg transition-all duration-300;
  }
}

/* Keyframe animations */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes blob {
  0% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s infinite ease-in-out;
}

.animate-blob-slow {
  animation: blob 10s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.prose {
  color: var(--color-text-secondary);
}

.prose ul li::marker {
  color: var(--color-accent); /* Style list markers */
}

.prose strong {
  color: var(--color-text-primary);
}
--- END ---