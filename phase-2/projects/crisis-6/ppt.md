# Brief
HazardMap provides an AI-powered solution for hospitality venues to proactively identify and manage safety hazards. By analyzing venue descriptions, it generates detailed hazard zone reports, risk assessments, and actionable mitigation strategies, enhancing emergency preparedness and response coordination.

# Opportunities
- Differentiation: Offers a unique, AI-driven approach to venue-specific hazard analysis in the hospitality sector.
- Problem Solving Approach: Addresses critical communication gaps and fragmented information during emergencies by centralizing hazard data and recommendations.
- USP: Instantaneous, AI-generated hazard zone mapping and tailored mitigation plans with a user-friendly, engaging interface.

# Features
- AI-Powered Hazard Analysis: Automatically detects and risk-ranks hazard zones based on venue descriptions.
- Detailed Hazard Reporting: Specifies hazard types, risk levels, and rationale for each zone.
- Actionable Mitigation: Provides targeted recommendations for hazard mitigation and emergency access.
- Claymorphism UI: Engaging, modern, and intuitive user interface with a playful 3D aesthetic.
- Responsive Design: Optimized for both mobile and desktop experiences.
- Client-Side Data Fetching: Efficiently retrieves AI analysis results.
- Integrated Loading & Error States: Provides clear feedback during processing and handles errors gracefully.

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS (with custom variables)
- Gemini API (gemini-2.5-flash)
- Lucide React for icons
- Google Fonts (Nunito, Fredoka One)

--- FILE: app/page.tsx ---
'use client'

import React, { useState, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

interface HazardZone {
    riskLevel: string;
    hazardType: string;
    whyRisky: string;
    mitigation: string[];
}

interface GeminiResponse {
    hazardZones: HazardZone[];
    emergencyAccess: string[];
}

export default function HomePage() {
    const [venueType, setVenueType] = useState<string>('');
    const [numFloors, setNumFloors] = useState<string>('');
    const [keyAreas, setKeyAreas] = useState<string>('');
    const [occupancy, setOccupancy] = useState<string>('');
    const [knownHazards, setKnownHazards] = useState<string>('');
    const [geminiResult, setGeminiResult] = useState<GeminiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setGeminiResult(null);
        setError(null);

        const prompt = `
            Venue Type: ${venueType}
            Number of Floors: ${numFloors}
            Key Areas: ${keyAreas}
            Occupancy: ${occupancy}
            Known Hazards: ${knownHazards}
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
            
            // Basic parsing - assuming a structured response from Gemini for now
            // In a real app, you'd use more robust parsing or a schema
            const parsedData = parseGeminiResponse(data.result);
            setGeminiResult(parsedData);

        } catch (err: any) {
            console.error("Error fetching from API:", err);
            setError(`Failed to get hazard analysis. ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const parseGeminiResponse = (text: string): GeminiResponse => {
        const hazardZones: HazardZone[] = [];
        let emergencyAccess: string[] = [];
        
        const lines = text.split('\n').filter(line => line.trim() !== '');

        let currentZone: HazardZone | null = null;
        let parsingAccess = false;

        lines.forEach(line => {
            if (line.startsWith('Hazard Zone:')) {
                if (currentZone) hazardZones.push(currentZone);
                currentZone = { riskLevel: '', hazardType: '', whyRisky: '', mitigation: [] };
                parsingAccess = false;
            } else if (line.startsWith('Risk Level:')) {
                if (currentZone) currentZone.riskLevel = line.replace('Risk Level:', '').trim();
            } else if (line.startsWith('Hazard Type:')) {
                if (currentZone) currentZone.hazardType = line.replace('Hazard Type:', '').trim();
            } else if (line.startsWith('Why Risky:')) {
                if (currentZone) currentZone.whyRisky = line.replace('Why Risky:', '').trim();
            } else if (line.startsWith('Mitigation Actions:')) {
                // Mitigation actions follow this header
            } else if (line.startsWith('Emergency Access Recommendations:')) {
                parsingAccess = true;
                if (currentZone) hazardZones.push(currentZone); // Push the last zone before starting access
                currentZone = null;
            } else if (parsingAccess) {
                emergencyAccess.push(line.trim());
            } else if (currentZone && line.trim().startsWith('- ')) {
                 // Assuming mitigation actions are listed with '-' prefix after the header
                 currentZone.mitigation.push(line.trim().replace('- ', ''));
            }
        });
        if (currentZone) hazardZones.push(currentZone); // Push the last zone

        return { hazardZones, emergencyAccess };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6 md:p-12 flex flex-col items-center font-sans">
            <h1 className="text-5xl font-extrabold text-indigo-800 mb-3 text-center">HazardMap</h1>
            <p className="text-lg text-indigo-600 mb-12 text-center">Describe your venue layout — identify hidden hazard zones automatically</p>

            <div className="w-full max-w-3xl clay-card p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Venue Analysis Input</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="venueType" className="mb-2 text-lg font-semibold text-indigo-700">Venue Type</label>
                        <input
                            id="venueType"
                            type="text"
                            value={venueType}
                            onChange={(e) => setVenueType(e.target.value)}
                            required
                            className="p-4 rounded-2xl border-2 border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 clay-input"
                            placeholder="e.g., Hotel, Restaurant, Convention Center"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="numFloors" className="mb-2 text-lg font-semibold text-indigo-700">Number of Floors</label>
                        <input
                            id="numFloors"
                            type="number"
                            value={numFloors}
                            onChange={(e) => setNumFloors(e.target.value)}
                            required
                            min="1"
                            className="p-4 rounded-2xl border-2 border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 clay-input"
                            placeholder="e.g., 5"
                        />
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                        <label htmlFor="keyAreas" className="mb-2 text-lg font-semibold text-indigo-700">Key Areas (Comma Separated)</label>
                        <input
                            id="keyAreas"
                            type="text"
                            value={keyAreas}
                            onChange={(e) => setKeyAreas(e.target.value)}
                            required
                            className="p-4 rounded-2xl border-2 border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 clay-input"
                            placeholder="e.g., Lobby, Kitchen, Ballroom, Spa, Gym, Rooftop Bar"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="occupancy" className="mb-2 text-lg font-semibold text-indigo-700">Max Occupancy</label>
                        <input
                            id="occupancy"
                            type="text" // Using text to allow ranges or descriptions like "up to 500"
                            value={occupancy}
                            onChange={(e) => setOccupancy(e.target.value)}
                            required
                            className="p-4 rounded-2xl border-2 border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 clay-input"
                            placeholder="e.g., 1000"
                        />
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                        <label htmlFor="knownHazards" className="mb-2 text-lg font-semibold text-indigo-700">Known Hazards (Optional)</label>
                        <textarea
                            id="knownHazards"
                            value={knownHazards}
                            onChange={(e) => setKnownHazards(e.target.value)}
                            rows={3}
                            className="p-4 rounded-2xl border-2 border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 clay-input"
                            placeholder="e.g., Flammable materials in kitchen storage, old wiring in basement"
                        ></textarea>
                    </div>
                    <div className="md:col-span-2 flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-1/2 py-4 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400 flex items-center justify-center clay-button"
                        >
                            {loading ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Analysis</>
                            ) : (
                                'Analyze My Venue'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="mt-12 w-full max-w-3xl clay-card p-8 shadow-lg bg-red-100 border border-red-400 text-red-800">
                    <h3 className="text-2xl font-bold mb-4">Error</h3>
                    <p>{error}</p>
                </div>
            )}

            {geminiResult && !loading && (
                <div className="mt-12 w-full max-w-3xl clay-card p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Hazard Analysis Report</h2>
                    
                    {geminiResult.hazardZones.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-indigo-700 mb-4">Hazard Zones</h3>
                            {geminiResult.hazardZones.map((zone, index) => (
                                <div key={index} className="mb-6 p-6 rounded-3xl bg-white shadow-inner border border-indigo-200">
                                    <div className={`flex items-center mb-3 px-4 py-2 rounded-xl text-white font-bold w-fit ${zone.riskLevel === 'HIGH' ? 'bg-red-500' : zone.riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                                        {zone.riskLevel} RISK
                                    </div>
                                    <h4 className="text-xl font-semibold text-indigo-700 mb-2">{zone.hazardType}</h4>
                                    <p className="text-gray-700 mb-3"><strong>Why it's risky:</strong> {zone.whyRisky}</p>
                                    <div className="mt-3">
                                        <p className="font-semibold text-indigo-700 mb-2">Mitigation Actions:</p>
                                        <ul className="list-disc list-inside text-gray-700 ml-4">
                                            {zone.mitigation.map((action, actionIndex) => (
                                                <li key={actionIndex}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {geminiResult.emergencyAccess.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold text-indigo-700 mb-4">Emergency Access Recommendations</h3>
                            <ul className="list-disc list-inside text-gray-700 ml-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                                {geminiResult.emergencyAccess.map((recommendation, index) => (
                                    <li key={index}>{recommendation}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { prompt } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set.");
        return NextResponse.json({ error: 'Server configuration error: Gemini API key not found.' }, { status: 500 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const model = 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const systemPrompt = "You are a venue safety AI. Analyze this venue layout and identify hazard zones. For each zone: risk level (HIGH/MEDIUM/LOW), specific hazard types, why it's risky, and 2 mitigation actions. Then list top 3 emergency access recommendations for first responders. Be spatial and specific.";

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: systemPrompt },
                            { text: `\n\nUser Input:\n${prompt}` }
                        ]
                    }
                ]
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gemini API Error: ${response.status} - ${errorText}`);
            // Attempt to parse JSON error, otherwise use raw text
            let errorMessage = `Gemini API responded with status ${response.status}.`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error?.message || errorText;
            } catch {
                errorMessage = errorText;
            }
            return NextResponse.json({ error: `Failed to generate content: ${errorMessage}` }, { status: response.status });
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            const geminiResponseText = data.candidates[0].content.parts[0].text;
            
            // Basic response structure from Gemini to help parsing on the client
            // Example format expected:
            // Hazard Zone: Kitchen Exhaust
            // Risk Level: HIGH
            // Hazard Type: Fire Hazard
            // Why Risky: Grease buildup can ignite easily.
            // Mitigation Actions:
            // - Regular professional cleaning of ducts.
            // - Install fire suppression system above cooking surfaces.
            // Hazard Zone: Storage Room
            // Risk Level: MEDIUM
            // Hazard Type: Chemical Spill / Fire
            // Why Risky: Improperly stored cleaning chemicals.
            // Mitigation Actions:
            // - Store chemicals in designated, ventilated area.
            // - Ensure all containers are properly sealed and labeled.
            // Emergency Access Recommendations:
            // - Main lobby entrance clear.
            // - Service entrance on west side accessible.
            // - Stairwell B access point.

            return NextResponse.json({ result: geminiResponseText });
        } else {
            console.error("Unexpected Gemini API response structure:", data);
            return NextResponse.json({ error: 'Unexpected response from Gemini API.' }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Fetch error:", error);
        return NextResponse.json({ error: `An unexpected error occurred: ${error.message}` }, { status: 500 });
    }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap');

/* Custom CSS Variables */
:root {
  --color-primary-light: #e0e7ff; /* Light Indigo */
  --color-primary: #6366f1;     /* Indigo */
  --color-primary-dark: #4338ca; /* Darker Indigo */
  --color-secondary-accent: #f472b6; /* Pink accent */
  --color-success: #10b981;     /* Emerald */
  --color-success-hover: #059669; /* Darker Emerald */
  --color-warning: #f59e0b;     /* Yellow */
  --color-danger: #ef4444;      /* Red */
  --color-background-gradient-start: #e0e7ff; /* Soft Lavender/Light Indigo */
  --color-background-gradient-end: #fbcfe8;   /* Light Pink */
  --color-card-gradient-start: #ffffff; /* White */
  --color-card-gradient-end: #f0f4ff; /* Very Light Blue/Purple */
  --shadow-card: 0 20px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08);
  --shadow-inner-card: inset 0 5px 15px rgba(0,0,0,0.05);
}

body {
  font-family: 'Nunito', sans-serif;
  background: linear-gradient(to bottom right, var(--color-background-gradient-start), var(--color-background-gradient-end));
  color: var(--color-primary-dark);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Fredoka One', cursive; /* Use Fredoka One for display headings */
  font-weight: 700;
}

/* Claymorphism Card Styling */
.clay-card {
  background: linear-gradient(135deg, var(--color-card-gradient-start), var(--color-card-gradient-end));
  border-radius: 30px;
  box-shadow: var(--shadow-card);
  border: 2px solid rgba(255, 255, 255, 0.5); /* Subtle border for puffy effect */
}

/* Claymorphism Input Styling */
.clay-input {
  border-radius: 25px;
  box-shadow: inset 0 4px 10px rgba(0,0,0,0.08);
  border: 2px solid rgba(255, 255, 255, 0.6); /* Lighter border for inputs */
  transition: all 0.3s ease-in-out;
}

.clay-input:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4), inset 0 4px 10px rgba(0,0,0,0.08); /* Indigo focus ring */
  border-color: var(--color-primary);
}

/* Claymorphism Button Styling */
.clay-button {
  border-radius: 50px; /* Pill shape */
  box-shadow: 0 8px 20px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06);
  transition: all 0.3s ease-in-out;
}

.clay-button:hover {
  box-shadow: 0 12px 24px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.clay-button:active {
  box-shadow: 0 4px 10px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.05);
  transform: translateY(1px);
}

/* Specific result card styling */
.result-card {
  border-radius: 25px;
  background: linear-gradient(135deg, var(--color-card-gradient-start), var(--color-card-gradient-end));
  box-shadow: var(--shadow-inner-card);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Add emphasis on specific UI elements if needed */
.risk-level-high { background-color: var(--color-danger); }
.risk-level-medium { background-color: var(--color-warning); }
.risk-level-low { background-color: var(--color-primary); }


/* Ensure text uses Nunito */
.font-sans {
  font-family: 'Nunito', sans-serif;
}

/* Override h1/h2/h3/h4/h5/h6 to use Fredoka One for headings */
h1, h2, h3, h4, h5, h6, .font-fredoka {
  font-family: 'Fredoka One', cursive;
}

/* Utilities for easier styling */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--color-background-gradient-start), var(--color-background-gradient-end));
}
.bg-card-gradient {
  background: linear-gradient(135deg, var(--color-card-gradient-start), var(--color-card-gradient-end));
}
.shadow-clay {
  box-shadow: var(--shadow-card);
}
.rounded-clay-input {
  border-radius: 25px;
}
.shadow-clay-input {
   box-shadow: inset 0 4px 10px rgba(0,0,0,0.08);
   border: 2px solid rgba(255, 255, 255, 0.6);
}
.rounded-clay-button {
  border-radius: 50px;
}
.shadow-clay-button {
  box-shadow: 0 8px 20px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06);
}
.rounded-clay-card {
  border-radius: 30px;
}
.shadow-clay-card {
  box-shadow: var(--shadow-card);
}
.border-clay {
  border: 2px solid rgba(255, 255, 255, 0.5);
}
.shadow-inner-clay {
  box-shadow: var(--shadow-inner-card);
}

--- END ---