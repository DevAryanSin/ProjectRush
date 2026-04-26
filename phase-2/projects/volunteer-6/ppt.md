# Brief
EventPlanner is a Next.js 16 application that acts as a central hub for community needs assessment and volunteer coordination. It empowers local social groups and NGOs to transform scattered community data into actionable insights by generating detailed volunteer event plans. The application utilizes a visually engaging claymorphism UI and integrates with the Gemini API to provide comprehensive event strategies, from concept to success metrics.

# Opportunities
## Differentiation
The application differentiates itself through its specialized focus on volunteer event planning for community needs, its unique claymorphism UI that creates an inviting and playful user experience, and its seamless integration with a powerful AI model for generating detailed, ready-to-execute plans.

## Problem Solving Approach
The approach addresses the problem of scattered community data and inefficient volunteer matching by providing a single platform that:
1. **Gathers Inputs:** Collects community needs, volunteer availability, budget, location, and timeframe.
2. **Generates Plans:** Uses AI to create a structured event plan including concept, schedule, roles, materials, communication, and metrics.
3. **Visualizes Data:** Presents the generated plan in a clear, hierarchical, and aesthetically pleasing claymorphism UI.
4. **Facilitates Action:** Equips organizers with a complete blueprint to address community needs effectively.

## USP
The Unique Selling Proposition of EventPlanner is its ability to provide an AI-generated, comprehensive, and visually appealing volunteer event plan tailored to specific community needs, all within an intuitive and delightful claymorphism user interface.

# Features
- **Community Need Input:** A user-friendly form to describe the community's specific needs.
- **Resource Specification:** Fields for detailing available volunteers, budget, location, and timeframe.
- **AI-Powered Plan Generation:** Integration with Gemini API to create detailed event plans.
- **Claymorphism UI:** A visually distinct, playful, and modern interface with pastel colors, rounded elements, and soft shadows.
- **Loading & Error States:** Clear visual feedback during AI generation and graceful handling of errors.
- **Responsive Design:** Optimized for both mobile and desktop viewing.
- **Organized Output Display:** The generated event plan is parsed and presented with clear visual hierarchy.

# Technologies
- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom CSS variables
- **Icons:** lucide-react
- **AI Integration:** Gemini API (`gemini-2.5-flash`)
- **Deployment Domain:** eventplanner-sc

Constraints:
- No extra npm packages beyond core Next.js, React, ReactDOM, lucide-react, tailwindcss.
- Strict adherence to the specified output format and file structure.
- All UI elements must align with the claymorphism style guide.
- Gemini API calls are server-side only.
- `'use client'` directive applied to `app/page.tsx`.
- Build command: `next build --no-turbo`.
- Node.js version: 24.x.

--- FILE: app/page.tsx ---
'use client'

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [communityNeed, setCommunityNeed] = useState('');
  const [availableVolunteers, setAvailableVolunteers] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [eventPlan, setEventPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEventPlan(null);
    setError(null);

    const prompt = `
      Community need: ${communityNeed}
      Available volunteers: ${availableVolunteers}
      Budget: ${budget}
      Location/Area: ${location}
      Timeframe: ${timeframe}
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEventPlan(data.result);
    } catch (err: any) {
      console.error("Error fetching event plan:", err);
      setError(`Failed to generate event plan. Please try again. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to parse and display the event plan with better hierarchy
  const renderEventPlan = (plan: string) => {
    const sections = plan.split('\n\n');
    return (
      <div className="mt-8 space-y-6">
        {sections.map((section, index) => {
          if (!section.trim()) return null;
          const lines = section.split('\n');
          const title = lines[0];
          const content = lines.slice(1).join('\n');

          if (title.startsWith('(1)')) {
            return (
              <div key={index} className="bg-white/70 rounded-3xl p-6 shadow-clay-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-4">{title.replace('(1)','').trim()}</h3>
                <p className="text-gray-700">{content}</p>
              </div>
            );
          }
          if (title.startsWith('(2)')) {
            return (
              <div key={index} className="bg-white/70 rounded-3xl p-6 shadow-clay-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-4">{title.replace('(2)','').trim()}</h3>
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">{content}</pre>
              </div>
            );
          }
          if (title.startsWith('(3)')) {
            return (
              <div key={index} className="bg-white/70 rounded-3xl p-6 shadow-clay-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-4">{title.replace('(3)','').trim()}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.split('\n').map((roleLine, roleIndex) => {
                    if (!roleLine.trim()) return null;
                    const parts = roleLine.split(':');
                    if (parts.length >= 2) {
                      const roleName = parts[0].trim();
                      const roleDetails = parts.slice(1).join(':').trim();
                      return (
                        <div key={roleIndex} className="bg-purple-100/60 rounded-2xl p-4 shadow-clay-sm">
                          <h4 className="font-bold text-purple-700 mb-1">{roleName}</h4>
                          <p className="text-sm text-gray-700">{roleDetails}</p>
                        </div>
                      );
                    }
                    return <p key={roleIndex} className="text-sm text-gray-700">{roleLine}</p>;
                  })}
                </div>
              </div>
            );
          }
          if (title.startsWith('(4)')) {
            return (
              <div key={index} className="bg-white/70 rounded-3xl p-6 shadow-clay-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-4">{title.replace('(4)','').trim()}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {content.split('\n').map((item, itemIndex) => {
                    if (item.trim()) return <li key={itemIndex}>{item.trim()}</li>;
                    return null;
                  })}
                </ul>
              </div>
            );
          }
          if (title.startsWith('(5)')) {
            return (
              <div key={index} className="bg-white/70 rounded-3xl p-6 shadow-clay-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-4">{title.replace('(5)','').trim()}</h3>
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">{content}</pre>
              </div>
            );
          }
          if (title.startsWith('(6)')) {
            return (
              <div key={index} className="bg-white/70 rounded-3xl p-6 shadow-clay-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-4">{title.replace('(6)','').trim()}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {content.split('\n').map((metric, metricIndex) => {
                    if (metric.trim()) return <li key={metricIndex}>{metric.trim()}</li>;
                    return null;
                  })}
                </ul>
              </div>
            );
          }

          return (
            <div key={index} className="bg-white/70 rounded-3xl p-6 shadow-clay-lg">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">{title}</h3>
              <p className="text-gray-700">{content}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-purple-800 mb-2">EventPlanner</h1>
        <p className="text-xl text-center text-purple-600 mb-8">Describe a community need — generate a complete volunteer event plan</p>

        <div className="bg-white/80 rounded-3xl p-8 shadow-clay-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">Enter Your Event Details</h2>

            <div className="flex flex-col space-y-2">
              <label htmlFor="communityNeed" className="text-lg font-semibold text-purple-700">Community Need</label>
              <textarea
                id="communityNeed"
                value={communityNeed}
                onChange={(e) => setCommunityNeed(e.target.value)}
                placeholder="e.g., Organize a cleanup drive for the local park"
                className="rounded-2xl p-4 border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-clay-sm"
                rows={3}
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="availableVolunteers" className="text-lg font-semibold text-purple-700">Available Volunteers (e.g., number, skills)</label>
              <input
                type="text"
                id="availableVolunteers"
                value={availableVolunteers}
                onChange={(e) => setAvailableVolunteers(e.target.value)}
                placeholder="e.g., 20 people, some with gardening experience"
                className="rounded-2xl p-4 border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-clay-sm"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="budget" className="text-lg font-semibold text-purple-700">Budget (e.g., amount, source)</label>
              <input
                type="text"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., $500 from community fund"
                className="rounded-2xl p-4 border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-clay-sm"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="location" className="text-lg font-semibold text-purple-700">Location/Area</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Central Park, downtown district"
                className="rounded-2xl p-4 border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-clay-sm"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="timeframe" className="text-lg font-semibold text-purple-700">Timeframe (e.g., date, duration)</label>
              <input
                type="text"
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="e.g., Saturday, November 18th, 9 AM - 3 PM"
                className="rounded-2xl p-4 border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-clay-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-full shadow-clay-lg transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Generate Event Plan"
              )}
            </button>
          </form>
        </div>

        {isLoading && (
          <div className="mt-8 text-center p-6 bg-white/70 rounded-3xl shadow-clay-lg">
            <Loader2 className="mx-auto h-12 w-12 text-purple-500 animate-spin mb-4" />
            <p className="text-lg text-purple-700">Generating your event plan...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 text-center p-6 bg-red-100 border border-red-300 text-red-800 rounded-3xl shadow-clay-lg">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {eventPlan && !isLoading && (
          <div className="mt-8">
            <h2 className="text-4xl font-bold text-center text-purple-800 mb-6">Your Event Plan</h2>
            {renderEventPlan(eventPlan)}
          </div>
        )}
      </div>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/ NextResponse';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const systemPrompt = `You are a volunteer event planning AI. Create a complete event plan covering: (1) Event Concept and Name, (2) Full Day Schedule (hour by hour), (3) Volunteer Role Assignments (role name, responsibilities, count needed), (4) Materials and Resources List, (5) Pre-Event Communication Plan (what to send, when), (6) Success Metrics (how to measure impact). Make it ready to execute immediately.`;

  const fullPrompt = `${systemPrompt}\n\n${prompt}`;

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API returned status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const resultText = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ result: resultText });
    } else {
      console.error('Unexpected response format from Gemini API:', data);
      throw new Error('Unexpected response format from AI model.');
    }

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    // Use NextResponse for error responses in App Router
    return NextResponse.json({ error: `Failed to generate plan: ${error.message}` }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Font Import */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Fredoka+One&display=swap');

:root {
  --font-primary: 'Nunito', sans-serif;
  --font-display: 'Fredoka One', cursive;

  /* Claymorphism Colors */
  --color-background: #F0F4F8; /* Soft Lavender */
  --color-card-gradient-start: #FFFFFF;
  --color-card-gradient-end: #F8F9FA; /* Slightly off-white for subtle gradient */
  --color-primary: #8B5CF6; /* Deep Purple */
  --color-secondary: #EC4899; /* Hot Pink */
  --color-accent: #F59E0B; /* Cheerful Yellow */
  --color-accent-darker: #D97706; /* Darker Yellow */
  --color-text-primary: #374151; /* Dark Gray */
  --color-text-secondary: #6B7280; /* Medium Gray */
  --color-pastel-blue: #A7F3D0; /* Mint Green */
  --color-pastel-pink: #FECACA; /* Light Pink */
  --color-pastel-peach: #FFDDC1; /* Soft Peach */
}

body {
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  color: var(--color-primary);
}

/* Claymorphism Shadow Utility */
.shadow-clay-lg {
  box-shadow: 0 25px 60px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.08);
}

.shadow-clay-md {
  box-shadow: 0 15px 40px rgba(0,0,0,0.10), 0 6px 15px rgba(0,0,0,0.07);
}

.shadow-clay-sm {
  box-shadow: 0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05);
}

/* Claymorphism Card Styling */
.card-clay {
  background: linear-gradient(135deg, var(--color-card-gradient-start), var(--color-card-gradient-end));
  border-radius: 25px; /* Generous rounding */
}

/* Claymorphism Input/Button Styling */
input, textarea, button {
  font-family: var(--font-primary);
  border-radius: 20px; /* Rounded inputs and buttons */
  border: 2px solid transparent; /* Default transparent border, Tailwind handles focus */
  transition: all 0.3s ease-in-out;
}

button {
  padding: 0.8rem 1.5rem;
  font-weight: 700;
  box-shadow: 0 15px 40px rgba(0,0,0,0.10), 0 6px 15px rgba(0,0,0,0.07); /* Button specific shadow */
}

button:hover {
  box-shadow: 0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05);
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary); /* Example focus color */
  ring-width: 2px;
  ring-color: var(--color-accent);
}

/* Specific overrides for Tailwind focus styles to match claymorphism */
.focus\:ring-2:focus {
  --tw-ring-offset-color: var(--color-background); /* Match background */
}

/* Adjusting text selection color for better contrast */
::selection {
  background-color: var(--color-accent);
  color: var(--color-text-primary);
}

/* Custom scrollbar styles for a smoother feel */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 10px;
  border: 2px solid var(--color-background); /* Creates a padded effect */
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-secondary);
}

/* Example for the generated plan sections */
.plan-section {
  background: linear-gradient(135deg, var(--color-card-gradient-start), var(--color-card-gradient-end));
  border-radius: 25px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08);
  padding: 24px;
  margin-bottom: 24px;
}

.plan-section h3 {
  font-size: 28px;
  margin-bottom: 16px;
  font-weight: 700;
  color: var(--color-primary);
}

.plan-section ul,
.plan-section pre {
  color: var(--color-text-secondary);
  font-size: 16px;
}

.plan-section pre {
  white-space: pre-wrap; /* Ensures wrapped text is displayed */
  word-wrap: break-word; /* Breaks long words */
}

.plan-section li {
  margin-bottom: 8px;
}

/* Role assignment cards */
.role-card {
  background-color: var(--color-pastel-blue); /* Using a pastel for variety */
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05);
  padding: 16px;
}

.role-card h4 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.role-card p {
  font-size: 14px;
  color: var(--color-text-secondary);
}
--- END ---