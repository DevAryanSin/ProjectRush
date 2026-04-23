# Brief
AlertBridge tackles critical communication gaps during hospitality emergencies. It empowers staff to quickly submit incident details, which are then transformed by AI into concise, actionable alerts tailored for different responder roles, ensuring swift and coordinated crisis management.

# Opportunities
## Differentiation
- AI-powered, role-specific alert generation for maximum clarity.
- Bento Box UI for dense, hierarchical information display.
- Seamless integration for immediate use in high-stakes environments.

## Problem Solving Approach
The solution employs a client-side form for user input, a server-side API route for secure Gemini AI integration, and a dynamic, grid-based UI to present both input and output information effectively. Tailwind CSS and custom variables ensure a polished, consistent visual style.

## USP
Instantaneous, AI-curated emergency alerts delivered in a structured, role-specific format, drastically reducing response time and improving coordination during hospitality crises.

# Features
- Crisis reporting form with fields for type, location, affected individuals, severity, and description.
- Dynamic loading state indicator.
- AI-generated, structured alert output with distinct summaries for Security, Medical, Management, and Guest Comms.
- Responsive Bento Box Grid UI design.
- Prominent display of "AlertBridge" branding.

# Technologies
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Gemini 2.5 Flash API
- Lucide React Icons

Constraints:
- No additional npm packages beyond specified core dependencies.
- Strict adherence to the Bento Box UI style guide.
- Server-side API key management.
- Hydration error mitigation for dynamic button states.

--- FILE: app/page.tsx ---
'use client'

import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, ShieldAlert, Stethoscope, UserCog, Users, X } from 'lucide-react'

interface AlertData {
  security: string
  medical: string
  management: string
  guestComms: string
}

export default function HomePage() {
  const [crisisType, setCrisisType] = useState('')
  const [location, setLocation] = useState('')
  const [peopleAffected, setPeopleAffected] = useState('')
  const [severity, setSeverity] = useState('1')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [alertResult, setAlertResult] = useState<AlertData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const alertContainerRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAlertResult(null)
    setError(null)

    const prompt = `Crisis type: ${crisisType}\nLocation: ${location}\nNumber of people affected: ${peopleAffected}\nSeverity: ${severity}\nDescription: ${description}`

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      // Basic parsing for demonstration, assuming AI returns structured JSON or text that can be parsed
      // In a real scenario, you'd refine this parsing based on AI output format
      const parsedResult = parseGeminiResponse(data.result)
      setAlertResult(parsedResult)

      // Scroll to the results after they are set
      setTimeout(() => {
        alertContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)

    } catch (err: any) {
      console.error('Failed to generate alert:', err)
      setError(err.message || 'An unknown error occurred.')
      setAlertResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const parseGeminiResponse = (text: string): AlertData => {
    const sections = text.split('\n\n')
    let security = '', medical = '', management = '', guestComms = ''

    sections.forEach(section => {
      if (section.toLowerCase().startsWith('security team:')) {
        security = section.replace('Security Team:', '').trim()
      } else if (section.toLowerCase().startsWith('medical response:')) {
        medical = section.replace('Medical Response:', '').trim()
      } else if (section.toLowerCase().startsWith('management:')) {
        management = section.replace('Management:', '').trim()
      } else if (section.toLowerCase().startsWith('guest communication:')) {
        guestComms = section.replace('Guest Communication:', '').trim()
      }
    })

    // Fallback if parsing fails or structure is different
    if (!security && !medical && !management && !guestComms) {
      return {
        security: text, // Display raw text if parsing fails
        medical: '',
        management: '',
        guestComms: ''
      }
    }

    return { security, medical, management, guestComms }
  }

  const isFormInvalid = !crisisType || !location || !peopleAffected || !description

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans p-8">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-red-500 mb-4 animate-pulse">AlertBridge</h1>
        <p className="text-2xl text-neutral-400">Rapid Crisis Response</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-neutral-900 p-8 rounded-xl border border-neutral-700 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-shadow duration-300">
          <h2 className="text-4xl font-bold text-red-500 mb-6 flex items-center gap-3">
            <AlertTriangle size={36} /> Submit Crisis Report
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="crisisType" className="block text-lg font-semibold mb-2 text-neutral-300">Crisis Type</label>
              <input
                id="crisisType"
                type="text"
                value={crisisType}
                onChange={(e) => setCrisisType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Fire, Medical Emergency, Security Threat"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-lg font-semibold mb-2 text-neutral-300">Location</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Ballroom A, Room 305, West Entrance"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="peopleAffected" className="block text-lg font-semibold mb-2 text-neutral-300">People Affected</label>
                <input
                  id="peopleAffected"
                  type="number"
                  value={peopleAffected}
                  onChange={(e) => setPeopleAffected(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Number of individuals"
                  min="0"
                  required
                  suppressHydrationWarning={isLoading}
                />
              </div>
              <div>
                <label htmlFor="severity" className="block text-lg font-semibold mb-2 text-neutral-300">Severity Level</label>
                <select
                  id="severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="1">1 - Minor</option>
                  <option value="2">2 - Moderate</option>
                  <option value="3">3 - Serious</option>
                  <option value="4">4 - Critical</option>
                  <option value="5">5 - Catastrophic</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-lg font-semibold mb-2 text-neutral-300">Detailed Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Provide details about the situation..."
                required
              ></textarea>
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={isFormInvalid || isLoading}
                className={`px-8 py-3 font-bold rounded-lg transition-all duration-300 ${isFormInvalid || isLoading
                  ? 'bg-red-700 text-neutral-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/40 text-white'
                  }`}
                suppressHydrationWarning={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Generate Alert'}
              </button>
            </div>
          </form>
        </section>

        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/30 p-6 rounded-xl border border-blue-500/30 shadow-lg h-full flex items-center justify-center text-center">
            <div>
              <h3 className="text-3xl font-bold mb-3 text-blue-400">Severity Key</h3>
              <p className="text-lg text-neutral-400">1 (Minor) to 5 (Catastrophic)</p>
            </div>
          </div>
           <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 p-6 rounded-xl border border-yellow-500/30 shadow-lg h-full flex items-center justify-center text-center">
            <div>
              <h3 className="text-3xl font-bold mb-3 text-yellow-400">AlertBridge</h3>
              <p className="text-lg text-neutral-400">Your direct line to rapid crisis coordination.</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Results Section */}
      <section ref={alertContainerRef} className={`mt-12 ${alertResult || error ? '' : 'hidden'}`}>
        <h2 className="text-4xl font-bold text-red-500 mb-6 text-center">Emergency Alert</h2>

        {isLoading && (
          <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-700 shadow-lg animate-pulse">
            <p className="text-2xl text-neutral-400">Generating structured alert...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-red-900 bg-opacity-30 rounded-xl border border-red-600 shadow-lg">
            <p className="text-2xl text-red-400 flex items-center justify-center gap-3"><X size={28} /> Error: {error}</p>
          </div>
        )}

        {alertResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-700/20 p-6 rounded-xl border border-red-500/30 shadow-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-3 flex items-center gap-2"><ShieldAlert size={28} /> Security</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">{alertResult.security || 'No specific security instructions.'}</p>
            </div>
            <div className="bg-blue-700/20 p-6 rounded-xl border border-blue-500/30 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-400 mb-3 flex items-center gap-2"><Stethoscope size={28} /> Medical</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">{alertResult.medical || 'No specific medical instructions.'}</p>
            </div>
            <div className="bg-green-700/20 p-6 rounded-xl border border-green-500/30 shadow-lg">
              <h3 className="text-2xl font-bold text-green-400 mb-3 flex items-center gap-2"><UserCog size={28} /> Management</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">{alertResult.management || 'No specific management instructions.'}</p>
            </div>
            <div className="bg-purple-700/20 p-6 rounded-xl border border-purple-500/30 shadow-lg">
              <h3 className="text-2xl font-bold text-purple-400 mb-3 flex items-center gap-2"><Users size={28} /> Guest Comms</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">{alertResult.guestComms || 'No specific guest communication instructions.'}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse, NextRequest } from 'next/server'

// IMPORTANT: Ensure your Gemini API key is set as an environment variable named GEMINI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set. Please set it in your environment variables.')
  // In a real app, you might want to handle this more gracefully,
  // perhaps by returning an error response immediately.
}

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Server configuration error: Gemini API key not set.' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { prompt: userInput } = body

    if (!userInput) {
      return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 })
    }

    const systemPrompt = `You are a crisis communications AI for a hospitality venue. Convert this incident report into a structured emergency alert with 4 separate role-specific summaries: (1) Security Team, (2) Medical Response, (3) Management, (4) Guest Communication. Each should be 2-3 sentences, clear and action-focused.`

    const fullPrompt = `${systemPrompt}\n\n${userInput}`

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.3, // Lower temperature for more deterministic, focused output
          maxOutputTokens: 500,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error Response:', errorData)
      throw new Error(`Gemini API returned an error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const geminiResult = data.candidates[0].content.parts[0].text
      return NextResponse.json({ result: geminiResult })
    } else {
      console.error('Unexpected Gemini API response format:', data)
      throw new Error('Received an unexpected response format from Gemini API.')
    }

  } catch (error: any) {
    console.error('Error in /api/generate:', error)
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 })
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

:root {
  /* Color Palette */
  --color-primary-urgent: #f87171; /* Red-500 */
  --color-primary-calm: #22d3ee; /* Cyan-400 */
  --color-background: #0a0a0a; /* Near Black */
  --color-card-background-dark: #1f1f1f; /* Dark Gray */
  --color-card-background-accent-red: rgba(248, 113, 113, 0.15); /* Subtle Red Tint */
  --color-card-background-accent-blue: rgba(34, 211, 238, 0.15); /* Subtle Blue Tint */
  --color-card-background-accent-green: rgba(16, 185, 129, 0.15); /* Subtle Green Tint */
  --color-card-background-accent-purple: rgba(168, 85, 247, 0.15); /* Subtle Purple Tint */
  --color-text-primary: #e2e8f0; /* Neutral-200 */
  --color-text-secondary: #94a3b8; /* Neutral-400 */
  --color-text-highlight: #f8fafc; /* Neutral-50 */

  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Space Mono', monospace;

  /* Borders & Spacing */
  --border-radius-card: 10px;
  --spacing-card-padding: 24px;
}

body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--color-text-highlight);
}

.btn-primary {
  background-color: var(--color-primary-urgent);
  color: var(--color-text-highlight);
  font-weight: 700;
  border-radius: var(--border-radius-card);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(248, 113, 113, 0.2);
}

.btn-primary:hover {
  background-color: #fca5a3; /* Lighter red */
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.4);
}

.btn-primary:disabled {
  background-color: #3f3f46; /* Darker gray */
  color: #6b7280; /* Gray-400 */
  box-shadow: none;
  cursor: not-allowed;
}

/* Bento Card Styling */
.bento-card {
  background-color: var(--color-card-background-dark);
  border-radius: var(--border-radius-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-card-padding);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden; /* Ensures gradients don't spill */
}

.bento-card:hover {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
}

.bento-card-accent-red {
  border-left: 4px solid var(--color-primary-urgent);
  background-color: var(--color-card-background-accent-red);
}
.bento-card-accent-red:hover {
  box-shadow: 0 0 20px rgba(248, 113, 113, 0.3);
}

.bento-card-accent-blue {
  border-left: 4px solid var(--color-primary-calm);
  background-color: var(--color-card-background-accent-blue);
}
.bento-card-accent-blue:hover {
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
}

.bento-card-accent-green {
  border-left: 4px solid #10b981; /* Emerald-500 */
  background-color: var(--color-card-background-accent-green);
}
.bento-card-accent-green:hover {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.bento-card-accent-purple {
  border-left: 4px solid #a855f7; /* Purple-600 */
  background-color: var(--color-card-background-accent-purple);
}
.bento-card-accent-purple:hover {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}


/* Form Elements */
input[type="text"],
input[type="number"],
textarea,
select {
  font-family: var(--font-body);
  color: var(--color-text-primary);
  background-color: var(--color-card-background-dark);
  border: 1px solid var(--color-text-secondary);
  border-radius: var(--border-radius-card);
  padding: 16px; /* Slightly larger padding */
  transition: all 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
textarea:focus,
select:focus {
  outline: none;
  ring-2: var(--color-primary-urgent);
  ring-offset-2: var(--color-background); /* Subtle offset */
  border-color: transparent; /* Let ring handle focus indication */
}

select {
    background-image: url("data:image/svg+xml,%3csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.00001 5.375L0.666675 0.9375L9.33334 0.9375L5.00001 5.375Z' fill='%2394a3b8'/%3e%3c/svg%3e");
    background-position: right 16px top 50%;
    background-repeat: no-repeat;
    background-size: 10px 6px;
    padding-right: 32px; /* Space for the dropdown arrow */
}


/* Utility Classes for Responsiveness (if needed beyond Tailwind) */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr); /* Example: 4 columns on large screens */
  }
}

/* Ensure custom scrollbar styles are minimal and unobtrusive */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-card-background-dark);
}
::-webkit-scrollbar-thumb {
  background: var(--color-text-secondary);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-primary);
}
--- END ---