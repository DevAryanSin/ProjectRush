# Brief
VolunteerBio is a Next.js 16 web application that generates personalized impact biographies for volunteers. It streamlines the process of showcasing volunteer contributions for NGOs, donor reports, and recruitment efforts by transforming raw volunteer data into compelling, human-centered narratives.

# Opportunities
## Differentiation
The VolunteerBio application differentiates itself through its unique Neumorphism UI, creating a distinct and modern aesthetic. Its core value proposition lies in the AI-powered generation of high-quality, inspiring volunteer bios, moving beyond simple data aggregation to narrative storytelling.

## Problem Solving Approach
The application tackles the challenge of scattered community data and volunteer engagement by:
1. Providing a centralized input mechanism for volunteer details.
2. Leveraging Gemini AI to craft engaging impact narratives.
3. Presenting these narratives in a format suitable for multiple NGO needs (reporting, recognition, recruitment).

## USP
AI-generated, inspiring volunteer impact biographies with a distinctive Neumorphism UI, designed to enhance NGO storytelling and volunteer engagement.

# Features
- Neumorphism-styled input form for volunteer details (name, skills, hours, tasks, motivation).
- Real-time loading indicator upon submission.
- AI-powered generation of personalized volunteer impact biographies using Gemini.
- Display of generated biographies with clear visual hierarchy.
- Graceful error handling for user-friendly feedback.
- Fully responsive design for desktop and mobile.
- Prominent display of the VolunteerBio title and tagline.

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS (with custom variables and Google Fonts)
- Lucide-React for icons
- Gemini API (`gemini-2.5-flash`)

Constraints:
- No external npm packages beyond Next.js, React, React-DOM, Lucide-React, and Tailwind CSS.
- Server-side Gemini API integration only.
- Strict adherence to the Neumorphism UI style guide.
- Deployment to `volunteerbio-sc` domain.

--- FILE: app/page.tsx ---
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

interface BioData {
  name: string;
  skills: string;
  hours: string;
  tasks: string;
  motivation: string;
  communities: string;
}

export default function VolunteerBioPage() {
  const [formData, setFormData] = useState<BioData>({
    name: '',
    skills: '',
    hours: '',
    tasks: '',
    motivation: '',
    communities: '',
  });
  const [generatedBio, setGeneratedBio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
    setGeneratedBio(null); // Clear bio when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedBio(null);
    setError(null);

    const prompt = `
Volunteer Name: ${formData.name}
Skills: ${formData.skills}
Hours Contributed: ${formData.hours}
Tasks Completed: ${formData.tasks}
Personal Motivation: ${formData.motivation}
Communities Served: ${formData.communities}
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
        throw new Error(errorData.error || 'Failed to generate bio');
      }

      const data = await response.json();
      setGeneratedBio(data.result);
    } catch (err: any) {
      console.error('Error generating bio:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getShadows = (isActive: boolean = false) => {
    if (isActive) {
      return 'inset -3px -3px 7px #ffffff, inset 3px 3px 7px rgba(0,0,0,0.15)';
    }
    return '-5px -5px 10px #ffffff, 5px 5px 10px rgba(0,0,0,0.15)';
  };

  const getAccentColor = () => {
    return '#A7D7E4'; // Soft Blue Accent
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Head>
        <title>VolunteerBio</title>
      </Head>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary-text mb-2">VolunteerBio</h1>
        <p className="text-lg text-secondary-text">Volunteer fills in their details — get a compelling impact bio generated</p>
      </div>

      <div className="w-full max-w-3xl p-8 rounded-xl shadow-neumorph-outer bg-background">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="capitalize text-primary-text mb-2 font-medium text-lg">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              {key === 'motivation' || key === 'tasks' || key === 'skills' || key === 'communities' ? (
                <textarea
                  id={key}
                  name={key}
                  value={formData[key as keyof BioData]}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="p-4 rounded-lg bg-background text-primary-text focus:outline-none resize-none"
                  style={{ boxShadow: getShadows() }}
                />
              ) : (
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={formData[key as keyof BioData]}
                  onChange={handleChange}
                  required
                  className="p-4 rounded-lg bg-background text-primary-text focus:outline-none"
                  style={{ boxShadow: getShadows() }}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-lg font-semibold text-primary-text transition-all duration-300 ease-in-out flex items-center justify-center"
            style={{
              boxShadow: isLoading ? getShadows(true) : getShadows(),
              backgroundColor: isLoading ? getAccentColor() : 'transparent',
              color: isLoading ? '#ffffff' : '#333', // Text color for loading state
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              'Generate Bio'
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-8 p-4 rounded-lg bg-red-100 text-red-800 border border-red-300 max-w-3xl w-full text-center">
          Error: {error}
        </div>
      )}

      {generatedBio && !isLoading && (
        <div className="mt-12 p-8 rounded-xl shadow-neumorph-outer bg-background max-w-3xl w-full">
          <h2 className="text-3xl font-bold text-primary-text mb-6 text-center">Your Impact Bio</h2>
          <div className="text-primary-text leading-relaxed text-lg space-y-4">
            {generatedBio.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY environment variable not set.' },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const systemPrompt = `You are an NGO storytelling AI. Write a compelling volunteer impact bio (150-200 words) covering: who they are, what they did (specific tasks and hours), who they helped (concrete community impact), and what drives them. Make it inspiring for donor reports and volunteer recruitment. Use first-person voice.`;

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
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
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Gemini API error response:', errorBody);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}. Details: ${JSON.stringify(errorBody)}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ result: generatedText });
    } else {
      console.error('Unexpected Gemini API response format:', data);
      throw new Error('Received an unexpected response format from Gemini API.');
    }

  } catch (error: any) {
    console.error('Error in /api/generate route:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&family=Poppins:wght@600&display=swap');

:root {
  --background: #e0e5ec; /* Mid-tone flat color */
  --primary-text: #333333; /* Dark grey for primary text */
  --secondary-text: #555555; /* Lighter grey for secondary text */
  --accent-color: #A7D7E4; /* Soft Blue Accent */
  --shadow-light: #ffffff; /* White for light shadow */
  --shadow-dark: rgba(0, 0, 0, 0.15); /* Dark shadow for depth */
}

body {
  font-family: 'Nunito', sans-serif;
  background-color: var(--background);
  color: var(--primary-text);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
  color: var(--primary-text);
}

.shadow-neumorph-outer {
  box-shadow: -5px -5px 10px var(--shadow-light), 5px 5px 10px var(--shadow-dark);
}

.shadow-neumorph-inner {
  box-shadow: inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark);
}

/* Custom styling for input and textarea to match neumorphism */
input[type="text"],
textarea {
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  border: none;
  background-color: var(--background); /* Match background */
  color: var(--primary-text);
  padding: 1rem; /* Generous padding */
  border-radius: 12px; /* Rounded corners */
  transition: box-shadow 0.3s ease-in-out;
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  box-shadow: inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark); /* Inset for focus */
}

/* Button specific styling */
button {
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out;
  border-radius: 12px;
}

button:not(:disabled) {
  box-shadow: -5px -5px 10px var(--shadow-light), 5px 5px 10px var(--shadow-dark);
}

button:active {
  box-shadow: inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark);
}

button:disabled {
  box-shadow: inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark);
  cursor: not-allowed;
}

/* Specific adjustments for Tailwind classes to ensure overriding */
.bg-background {
  background-color: var(--background);
}

.text-primary-text {
  color: var(--primary-text);
}

.text-secondary-text {
  color: var(--secondary-text);
}

.shadow-neumorph-outer {
  box-shadow: -5px -5px 10px var(--shadow-light), 5px 5px 10px var(--shadow-dark);
}

/* Ensure focus styles for inputs within the form */
form div input:focus,
form div textarea:focus {
  box-shadow: inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark);
}

/* Specific styling for the button when loading */
button[disabled] {
  background-color: var(--accent-color);
  color: #ffffff !important; /* Ensure text is white in loading state */
}
--- END ---