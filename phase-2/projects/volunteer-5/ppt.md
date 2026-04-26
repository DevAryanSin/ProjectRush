# Brief
SkillGapFinder is a Next.js 16 application designed to empower local social groups and NGOs. It addresses the challenge of understanding community needs from scattered data and efficiently matching volunteers to critical tasks. By analyzing project requirements against available volunteer skills, it pinpoints crucial skill gaps, quantifies their impact, and provides actionable recruitment briefs and interim solutions.

# Opportunities
## Differentiation
The application differentiates itself through its unique "Paper/Editorial" UI style, fostering a sense of trust and readability akin to professional publications. Its focused AI-driven analysis of NGO skill gaps provides a clear, actionable roadmap for volunteer recruitment and project success.

## Problem Solving Approach
The solution tackles the problem by centralizing NGO project and volunteer data, then employing AI to identify critical skill deficiencies. It prioritizes these gaps, articulates their impact, and generates tailored resources (recruitment briefs, workarounds) to bridge them, thereby enhancing operational efficiency and social impact.

## USP
The core Unique Selling Proposition (USP) lies in its sophisticated AI-powered skill gap analysis presented through a sophisticated, editorial-style interface, offering NGOs precise insights into their talent needs and actionable strategies for volunteer recruitment and project completion.

# Features
- **Skill Gap Analysis:** Identifies and ranks missing skills based on criticality.
- **Impact Quantification:** Assesses the effect of each skill gap on project outcomes.
- **Targeted Recruitment Briefs:** Generates compelling 3-sentence briefs for each missing skill.
- **Interim Workarounds:** Provides practical solutions for gaps while recruiting.
- **Intuitive Input Form:** Collects NGO project details and volunteer skill information.
- **Loading State:** Visually indicates when the AI is processing.
- **Error Handling:** Displays user-friendly messages for issues.
- **Responsive Design:** Adapts seamlessly to various screen sizes.

# Technologies
- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom CSS variables
- **Icons:** lucide-react
- **AI Integration:** Gemini API (`gemini-2.5-flash`)
- **Deployment Domain:** `skillgapfinder-sc` (assumed for backend API calls)

--- FILE: app/page.tsx ---
'use client';

import { useState, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [projectDetails, setProjectDetails] = useState('');
  const [volunteerSkills, setVolunteerSkills] = useState('');
  const [projectChallenges, setProjectChallenges] = useState('');
  const [upcomingInitiatives, setUpcomingInitiatives] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeminiResponse(null);
    setError(null);

    const prompt = `
      Current NGO projects: ${projectDetails}
      Current volunteer skills available: ${volunteerSkills}
      Project challenges faced: ${projectChallenges}
      Upcoming initiatives: ${upcomingInitiatives}
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
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeminiResponse(data.result);
    } catch (err: any) {
      console.error("Failed to fetch from API:", err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResponse = () => {
    if (!geminiResponse) return null;

    // Basic parsing for demonstration. A more robust parser might be needed.
    const sections = geminiResponse.split(/\n{2,}/); // Split by double or more newlines

    return (
      <div className="mt-8 p-6 border-t border-ink-secondary pt-6">
        <h2 className="text-3xl font-serif mb-4 text-ink-primary">Analysis Results</h2>
        {sections.map((section, index) => {
          const lines = section.split('\n');
          if (lines.length === 0) return null;

          const headingMatch = lines[0].match(/^(\d+\.\s+)?(Top \d+|Impact|Recruitment Brief|Interim Workaround)/);
          const isHeading = headingMatch && headingMatch[2];

          if (isHeading) {
            return (
              <div key={index} className="mb-6">
                <h3 className={`text-2xl font-serif mb-2 ${index === 0 ? 'text-ink-primary' : 'text-ink-secondary'}`}>{lines[0]}</h3>
                <p className="font-serif text-ink-primary leading-relaxed">{lines.slice(1).join(' ')}</p>
              </div>
            );
          } else {
            // Treat as body text if no clear heading match, or part of a preceding section
            return (
              <p key={index} className="font-serif text-ink-primary leading-relaxed mb-3">
                {section.trim()}
              </p>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 font-serif">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-bold text-ink-primary mb-2">SkillGapFinder</h1>
        <p className="text-xl text-ink-secondary">Describe your NGO projects — find the volunteer skill gaps holding you back</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="bg-paper p-8 border-2 border-ink-secondary shadow-form rounded-lg">
          <div className="mb-6">
            <label htmlFor="projectDetails" className="block text-lg font-semibold text-ink-primary mb-2">
              Current NGO Projects
            </label>
            <textarea
              id="projectDetails"
              rows={4}
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              className="w-full p-3 border-2 border-ink-secondary rounded-md font-serif text-ink-primary focus:ring-ink-primary focus:border-ink-primary shadow-input"
              required
              placeholder="Describe your current projects, their goals, and activities..."
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="volunteerSkills" className="block text-lg font-semibold text-ink-primary mb-2">
              Current Volunteer Skills Available
            </label>
            <textarea
              id="volunteerSkills"
              rows={4}
              value={volunteerSkills}
              onChange={(e) => setVolunteerSkills(e.target.value)}
              className="w-full p-3 border-2 border-ink-secondary rounded-md font-serif text-ink-primary focus:ring-ink-primary focus:border-ink-primary shadow-input"
              required
              placeholder="List the skills and expertise your current volunteers possess..."
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="projectChallenges" className="block text-lg font-semibold text-ink-primary mb-2">
              Project Challenges Faced
            </label>
            <textarea
              id="projectChallenges"
              rows={4}
              value={projectChallenges}
              onChange={(e) => setProjectChallenges(e.target.value)}
              className="w-full p-3 border-2 border-ink-secondary rounded-md font-serif text-ink-primary focus:ring-ink-primary focus:border-ink-primary shadow-input"
              required
              placeholder="What are the main obstacles hindering your projects?"
            ></textarea>
          </div>

          <div className="mb-8">
            <label htmlFor="upcomingInitiatives" className="block text-lg font-semibold text-ink-primary mb-2">
              Upcoming Initiatives
            </label>
            <textarea
              id="upcomingInitiatives"
              rows={4}
              value={upcomingInitiatives}
              onChange={(e) => setUpcomingInitiatives(e.target.value)}
              className="w-full p-3 border-2 border-ink-secondary rounded-md font-serif text-ink-primary focus:ring-ink-primary focus:border-ink-primary shadow-input"
              required
              placeholder="Outline your plans and new projects for the near future..."
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-ink-accent font-serif font-bold text-lg text-ink-accent bg-paper hover:bg-ink-accent hover:text-paper transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Find Skill Gaps'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-8 p-6 border-t border-red-500 pt-6 text-center">
            <p className="text-xl font-serif text-red-600">Error: {error}</p>
            <p className="font-serif text-ink-secondary mt-2">Please check your inputs and try again, or contact support if the problem persists.</p>
          </div>
        )}

        {!isLoading && geminiResponse && renderResponse()}
      </main>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse, type NextRequest } from 'next/server';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error. Please contact administrator.' }, { status: 500 });
  }

  const systemPrompt = `You are an NGO talent strategy AI. Analyze this skill gap and provide: (1) Top 5 missing skills ranked by criticality to mission, (2) Impact of each gap on project outcomes, (3) A 3-sentence volunteer recruitment brief for each missing skill, (4) An interim workaround for each gap while recruiting. Make recruitment briefs compelling for potential volunteers.`;

  const fullPrompt = `${systemPrompt}\n\n${prompt}`;

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        // generationConfig: { maxOutputTokens: 1000 } // Optional: control output length
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error response:', errorData);
      throw new Error(`Gemini API returned status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      const geminiResult = data.candidates[0].content.parts.map((part: any) => part.text).join('');
      return NextResponse.json({ result: geminiResult });
    } else {
      console.error('Unexpected Gemini API response format:', data);
      throw new Error('Received an unexpected response from the AI.');
    }

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Serif+4:wght@400;700&display=swap');

:root {
  --font-serif-heading: 'Playfair Display', serif;
  --font-serif-body: 'Source Serif 4', serif;

  /* Color Palette: Warm Ivory & Deep Teal */
  --color-background: #f5f0e8; /* Warm off-white */
  --color-ink-primary: #1a1a1a; /* Near-black */
  --color-ink-secondary: #555555; /* Dark grey for subtext */
  --color-ink-accent: #008080; /* Deep Teal */

  --color-border-primary: var(--color-ink-primary);
  --color-border-secondary: var(--color-ink-secondary);

  --color-button-text: var(--color-ink-accent);
  --color-button-bg: var(--color-background);
  --color-button-bg-hover: var(--color-ink-accent);
  --color-button-text-hover: var(--color-background);

  --color-input-border: var(--color-ink-secondary);
  --color-input-focus-ring: var(--color-ink-accent);
  --color-input-focus-border: var(--color-ink-accent);
}

body {
  background-color: var(--color-background);
  color: var(--color-ink-primary);
  font-family: var(--font-serif-body);
  line-height: 1.7;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif-heading);
  color: var(--color-ink-primary);
}

h1 {
  font-size: 4rem; /* 64px */
  line-height: 1.1;
}

h2 {
  font-size: 2.5rem; /* 40px */
  line-height: 1.2;
}

h3 {
  font-size: 2rem; /* 32px */
  line-height: 1.3;
}

p {
  margin-bottom: 1.25em; /* 20px for base font size 16px */
}

/* Custom Shadows for Paper/Editorial Style */
.shadow-form {
  box-shadow: 1px 1px 0px 0px var(--color-ink-secondary);
}

.shadow-input {
  box-shadow: 0px 0px 0px 1px var(--color-input-border);
}

.shadow-button {
  box-shadow: 2px 2px 0px 0px var(--color-ink-accent);
}

/* Tailwind specific adjustments */
.bg-paper {
  background-color: var(--color-background);
}

.text-ink-primary {
  color: var(--color-ink-primary);
}

.text-ink-secondary {
  color: var(--color-ink-secondary);
}

.text-ink-accent {
  color: var(--color-ink-accent);
}

.border-ink-primary {
  border-color: var(--color-ink-primary);
}

.border-ink-secondary {
  border-color: var(--color-ink-secondary);
}

.border-ink-accent {
  border-color: var(--color-ink-accent);
}

.focus-ring-ink-primary {
  --tw-ring-color: var(--color-ink-primary);
}

.focus-border-ink-primary {
  border-color: var(--color-ink-primary);
}

/* Apply font families */
.font-serif {
  font-family: var(--font-serif-body);
}

.font-serif-heading {
  font-family: var(--font-serif-heading);
}

/* Container for page layout */
.container {
  max-width: 1024px; /* Standard newspaper column width */
}

/* Button styling */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem; /* Example padding */
  border-width: 2px;
  font-weight: 700;
  font-size: 1.125rem; /* 18px */
  transition: background-color 0.2s, color 0.2s;
  font-family: var(--font-serif-heading); /* Headings use serif, so buttons could too */
}

.btn-primary {
  border-color: var(--color-ink-accent);
  color: var(--color-button-text);
  background-color: var(--color-button-bg);
}

.btn-primary:hover {
  background-color: var(--color-button-bg-hover);
  color: var(--color-button-text-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Specific overrides for Tailwind */
textarea.w-full {
    min-height: 100px; /* Ensure textareas have a reasonable initial height */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  h1 {
    font-size: 3rem; /* 48px */
  }
  h2 {
    font-size: 2rem; /* 32px */
  }
  h3 {
    font-size: 1.75rem; /* 28px */
  }
}
@media (max-width: 480px) {
  h1 {
    font-size: 2.5rem; /* 40px */
  }
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
--- END ---