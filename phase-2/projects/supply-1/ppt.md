# Brief
A Next.js 16 MVP application for predicting and mitigating weather-based supply chain disruptions. Features a Brutalist UI and Gemini API integration to provide users with real-time route risk analysis and actionable recommendations.

# Opportunities
- Differentiation: Unique Brutalist UI style that stands out in the logistics tech space.
- Problem Solving Approach: Proactive identification and mitigation of weather-related transit delays through data analysis.
- USP: Real-time, AI-powered weather risk assessment for supply chain routes with actionable insights.

# Features
- Intuitive input form for route details (origin, destination, transport mode, departure).
- Dynamic weather risk score and detailed threat analysis per route segment.
- Estimated impact on Estimated Time of Arrival (ETA).
- Practical weather-proofing recommendations.
- Loading state for AI processing.
- Error handling for graceful failure.
- Responsive design for all devices.
- Striking Brutalist UI with high contrast and bold typography.

# Technologies
- Frontend: Next.js 16 (App Router), TypeScript, Tailwind CSS
- Icons: Lucide React
- AI Integration: Gemini API (`gemini-2.5-flash`)
- Deployment Domain: weathershield-sc

Constraints:
- No markdown like ** or ##
- No code
- Clean bullet points only
- Keep concise
--- FILE: app/page.tsx ---
import React, { useState } from 'react';
import Head from 'next/head';

interface WeatherData {
  riskScore: string;
  threats: string;
  etaImpact: string;
  recommendations: string;
}

export default function Home() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [transportMode, setTransportMode] = useState('truck');
  const [departureDate, setDepartureDate] = useState('');
  const [weatherConditions, setWeatherConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setWeatherData(null);
    setError(null);

    const prompt = `Analyze this route for weather-based delay risk:
    Origin: ${origin}
    Destination: ${destination}
    Transport Mode: ${transportMode}
    Departure Date: ${departureDate}
    Known Weather Conditions: ${weatherConditions}

    Provide the output in a structured format including:
    - Overall Weather Delay Risk Score (0-100%)
    - Specific Weather Threats per Route Segment (e.g., heavy rain, strong winds, fog, snow, storms)
    - Estimated ETA Impact in Hours
    - 3 Weather-Proofing Recommendations

    Base reasoning on typical seasonal patterns for the region and transport mode.`;

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
      if (data.result) {
        const parsedData = parseGeminiResponse(data.result);
        setWeatherData(parsedData);
      } else {
        throw new Error('No result received from AI.');
      }
    } catch (err: any) {
      console.error("API call failed:", err);
      setError('Failed to get weather analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseGeminiResponse = (text: string): WeatherData => {
    let riskScore = 'N/A';
    let threats = 'N/A';
    let etaImpact = 'N/A';
    let recommendations = 'N/A';

    const lines = text.split('\n');
    let currentSection: 'threats' | 'recommendations' | null = null;

    lines.forEach(line => {
      if (line.toLowerCase().includes('overall weather delay risk score')) {
        riskScore = line.replace(/.*:\s*/, '').trim();
      } else if (line.toLowerCase().includes('specific weather threats per route segment')) {
        currentSection = 'threats';
      } else if (line.toLowerCase().includes('estimated eta impact')) {
        etaImpact = line.replace(/.*:\s*/, '').trim();
        currentSection = null;
      } else if (line.toLowerCase().includes('weather-proofing recommendations')) {
        currentSection = 'recommendations';
      } else if (currentSection === 'threats' && line.trim() !== '' && !line.startsWith('-')) {
        threats += `\n- ${line.trim()}`;
      } else if (currentSection === 'recommendations' && line.trim() !== '' && !line.startsWith('-')) {
        recommendations += `\n- ${line.trim()}`;
      }
    });

    // Clean up initial N/A placeholders if actual data was found
    if (threats === 'N/A' && text.includes('Specific Weather Threats')) {
        threats = 'See details below.';
    }
     if (recommendations === 'N/A' && text.includes('Weather-Proofing Recommendations')) {
        recommendations = 'See details below.';
    }


    return {
      riskScore,
      threats: threats.replace('N/A\n- ', '').trim(),
      etaImpact,
      recommendations: recommendations.replace('N/A\n- ', '').trim(),
    };
  };

  const accentColor = '#FFD700'; // Electric Yellow
  const borderColor = '#000000';
  const shadowColor = '#000000';

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <Head>
        <title>WeatherShield</title>
      </Head>

      <header className="text-center mb-16">
        <h1 className="text-6xl font-black uppercase text-black mb-4 tracking-tight">WEATHER<span style={{ color: accentColor }}>SHIELD</span></h1>
        <p className="text-2xl font-bold text-gray-800">Input your route and forecast — predict weather-based delay risk</p>
      </header>

      <main className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section className="bg-white p-8 border-8 border-solid border-black shadow-lg-black" style={{ boxShadow: `8px 8px 0 ${shadowColor}` }}>
          <h2 className="text-4xl font-black uppercase text-black mb-8 text-center">ROUTE INPUT</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-2xl font-black uppercase text-black mb-2">ORIGIN</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                className="w-full p-4 text-2xl font-bold border-8 border-solid border-black shadow-lg-lg-black focus:outline-none"
                style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
              />
            </div>
            <div>
              <label className="block text-2xl font-black uppercase text-black mb-2">DESTINATION</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full p-4 text-2xl font-bold border-8 border-solid border-black shadow-lg-lg-black focus:outline-none"
                style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
              />
            </div>
            <div>
              <label className="block text-2xl font-black uppercase text-black mb-2">TRANSPORT MODE</label>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                className="w-full p-4 text-2xl font-bold border-8 border-solid border-black shadow-lg-lg-black appearance-none focus:outline-none bg-white"
                style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
              >
                <option value="truck">TRUCK</option>
                <option value="ship">SHIP</option>
                <option value="train">TRAIN</option>
                <option value="plane">PLANE</option>
              </select>
            </div>
            <div>
              <label className="block text-2xl font-black uppercase text-black mb-2">DEPARTURE DATE</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
                className="w-full p-4 text-2xl font-bold border-8 border-solid border-black shadow-lg-lg-black focus:outline-none"
                style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
              />
            </div>
            <div>
              <label className="block text-2xl font-black uppercase text-black mb-2">KNOWN WEATHER CONDITIONS (Optional)</label>
              <textarea
                value={weatherConditions}
                onChange={(e) => setWeatherConditions(e.target.value)}
                rows={3}
                className="w-full p-4 text-2xl font-bold border-8 border-solid border-black shadow-lg-lg-black focus:outline-none"
                style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full p-4 text-3xl font-black uppercase text-black bg-white border-8 border-solid border-black transition-all duration-200 ease-in-out"
              style={{ boxShadow: `8px 8px 0 ${shadowColor}` }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `2px 2px 0 ${shadowColor}`;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translate(6px, 6px)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `8px 8px 0 ${shadowColor}`;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translate(0, 0)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `8px 8px 0 ${shadowColor}`;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translate(0, 0)';
              }}
            >
              {loading ? 'ANALYZING...' : 'ANALYZE ROUTE'}
            </button>
          </form>
        </section>

        <section className="bg-white p-8 border-8 border-solid border-black shadow-lg-black" style={{ boxShadow: `8px 8px 0 ${shadowColor}` }}>
          <h2 className="text-4xl font-black uppercase text-black mb-8 text-center">ANALYSIS RESULTS</h2>
          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mb-4" style={{borderColor: accentColor}}></div>
                <p className="text-3xl font-black uppercase">Processing...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center text-red-600">
              <p className="text-3xl font-black uppercase">{error}</p>
            </div>
          )}
          {weatherData && !loading && (
            <div>
              <div className="mb-8 p-6 border-8 border-solid border-black bg-yellow-100 shadow-lg-black" style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}>
                <h3 className="text-4xl font-black uppercase text-black mb-3">RISK SCORE</h3>
                <p className="text-6xl font-black text-red-600">{weatherData.riskScore}</p>
              </div>
              <div className="mb-8 p-6 border-8 border-solid border-black bg-yellow-100 shadow-lg-black" style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}>
                <h3 className="text-4xl font-black uppercase text-black mb-3">ETA IMPACT</h3>
                <p className="text-5xl font-black text-blue-700">{weatherData.etaImpact}</p>
              </div>
              <div className="mb-8 p-6 border-8 border-solid border-black bg-yellow-100 shadow-lg-black" style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}>
                <h3 className="text-4xl font-black uppercase text-black mb-3">WEATHER THREATS</h3>
                <pre className="text-xl font-bold whitespace-pre-wrap text-gray-800">{weatherData.threats}</pre>
              </div>
              <div className="p-6 border-8 border-solid border-black bg-yellow-100 shadow-lg-black" style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}>
                <h3 className="text-4xl font-black uppercase text-black mb-3">RECOMMENDATIONS</h3>
                <pre className="text-xl font-bold whitespace-pre-wrap text-gray-800">{weatherData.recommendations}</pre>
              </div>
            </div>
          )}
          {!weatherData && !loading && !error && (
            <div className="text-center text-gray-600">
              <p className="text-2xl font-bold uppercase">Enter route details and click ANALYZE ROUTE.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return NextResponse.json({ error: 'Server configuration error: Gemini API key missing.' }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const systemPrompt = "You are a logistics weather risk AI. Analyze this route for weather-based delay risk: overall risk score (0-100%), specific weather threats per segment (rain/snow/fog/wind/storm), estimated ETA impact in hours, and 3 weather-proofing recommendations. Base reasoning on typical seasonal patterns for the region and transport mode.";

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorBody}`);
      return NextResponse.json({ error: `Gemini API request failed: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const geminiResponseText = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ result: geminiResponseText });
    } else {
      console.error('Unexpected Gemini API response format:', data);
      return NextResponse.json({ error: 'Received an unexpected response from the AI.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json({ error: `An internal server error occurred: ${error.message}` }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800;900&family=Impact&display=swap');

:root {
  /* Custom CSS Variables for Brutalism */
  --border-width: 5px;
  --border-color: #000000;
  --shadow-offset: 8px;
  --shadow-color: #000000;
  --accent-color-primary: #FFD700; /* Electric Yellow */
  --accent-color-secondary: #0000FF; /* Electric Blue */
  --background-color: #FFF8DC; /* Pale Yellow */
  --text-color-primary: #000000; /* Black */
  --text-color-secondary: #333333; /* Dark Grey */

  --font-heading: 'Impact', sans-serif;
  --font-body: 'Space Grotesk', sans-serif;
}

body {
  background-color: var(--background-color);
  font-family: var(--font-body);
  color: var(--text-color-primary);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--text-color-primary);
}

h1 {
  font-size: 4rem; /* Oversized */
}

h2 {
  font-size: 3rem;
}

h3 {
  font-size: 2.5rem;
}

input[type="text"],
input[type="date"],
select,
textarea {
  font-family: var(--font-body);
  font-weight: 900;
  text-transform: uppercase;
  background-color: white;
  border: var(--border-width) solid var(--border-color);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
  padding: 1rem;
  color: var(--text-color-primary);
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  /* Placeholder for focus effect if needed, but brutalism often avoids subtle highlights */
}

button {
  font-family: var(--font-heading);
  font-weight: 900;
  text-transform: uppercase;
  background-color: white;
  border: var(--border-width) solid var(--border-color);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
  padding: 1rem 2rem;
  color: var(--text-color-primary);
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
}

button:active {
  box-shadow: 2px 2px 0 var(--shadow-color);
  transform: translate(6px, 6px);
}

/* Specific styles for page elements */
.shadow-lg-black {
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
}
.shadow-lg-lg-black {
  box-shadow: 6px 6px 0 var(--shadow-color);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  h1 {
    font-size: 3rem;
  }
  h2 {
    font-size: 2.5rem;
  }
  h3 {
    font-size: 2rem;
  }
  button, input, select, textarea {
    padding: 0.8rem 1.5rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  .container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  section {
    padding: 1rem;
  }
}

/* Tailwind custom configuration can be done here if needed */
/* For example, adding custom spacing or colors */
/*
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'lg-black': '8px 8px 0 #000000',
        'lg-lg-black': '6px 6px 0 #000000',
      },
      spacing: {
        '128': '32rem',
      }
    }
  }
}
*/
--- END ---