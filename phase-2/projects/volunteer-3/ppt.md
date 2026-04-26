# Brief
CommunityPulse addresses the challenge of scattered community data by providing a centralized platform for NGOs. It transforms raw social media posts into actionable insights, highlighting urgent needs and suggesting targeted interventions. This empowers NGOs to efficiently allocate resources and connect volunteers with critical tasks, ultimately amplifying social impact.

# Opportunities
## Differentiation
- **AI-powered Social Listening:** Directly extracts insights from unstructured text data, going beyond manual analysis.
- **Actionable Intelligence:** Provides ranked needs, sentiment, affected demographics, and specific NGO interventions, not just raw data.
- **Aurora UI Style:** Offers a unique, premium, and immersive dark-themed interface, enhancing user engagement.
- **Seamless Volunteer Matching:** Facilitates targeted resource allocation by clearly defining needs and areas of impact.

## Problem Solving Approach
The solution employs a robust AI-driven approach combined with a user-centric design.
1.  **Data Ingestion:** Users paste community social media posts into a structured input form.
2.  **AI Analysis:** The Gemini API processes the input using a specialized system prompt to extract key community needs, urgency, sentiment, affected segments, and intervention recommendations.
3.  **Insight Visualization:** Results are presented in a clear, hierarchical, and visually appealing format, adhering to the Aurora UI style.
4.  **User Feedback:** The application handles loading states and errors gracefully, ensuring a smooth user experience.

## USP
CommunityPulse's Unique Selling Proposition lies in its **AI-driven ability to distill complex social media chatter into prioritized, actionable intelligence for NGOs, wrapped in a distinct and immersive Aurora UI.** This empowers immediate, informed decision-making for social impact initiatives.

# Features
- **AI-Powered Needs Extraction:** Analyzes social media posts to identify and rank unmet community needs.
- **Urgency Scoring & Sentiment Analysis:** Quantifies the urgency of needs and assesses the emotional tone within community feedback.
- **Affected Population Identification:** Pinpoints demographic segments most impacted by identified issues.
- **Actionable Intervention Recommendations:** Suggests specific steps NGOs can take based on the analysis.
- **Evidence Quoting:** Provides direct quotes from posts to support the extracted insights.
- **Engaging Aurora UI:** Features a dark, gradient-infused, and ethereal interface for a premium feel.
- **Real-time Loading & Error States:** Provides clear visual feedback during processing and for handling errors.
- **Fully Responsive Design:** Ensures optimal viewing and interaction across all devices.
- **Prominent Branding:** "CommunityPulse" title and tagline are clearly displayed.

# Technologies
- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Custom CSS variables, Google Fonts
- **Icons:** lucide-react
- **AI Integration:** Gemini API (`gemini-2.5-flash`)
- **API Route:** Next.js API Route (`app/api/generate/route.ts`)

--- FILE: app/page.tsx ---
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react'; // Using Search as a placeholder for an input-related icon

const HomePage = () => {
  const [inputText, setInputText] = useState('');
  const [geminiResponse, setGeminiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please enter some community posts.');
      return;
    }
    setIsLoading(true);
    setGeminiResponse(null);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeminiResponse(data.result);
    } catch (err: any) {
      console.error('Error fetching Gemini response:', err);
      setError(`Failed to fetch insights. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Basic parsing for demonstration. A more robust parser would be needed for complex Gemini outputs.
  const parseResponse = (response: string) => {
    const sections: { [key: string]: string } = {};
    let currentSection = 'Raw Output';
    let currentContent = '';

    const lines = response.split('\n');
    lines.forEach(line => {
      if (line.startsWith('(1) Top 5 unmet needs ranked by urgency')) {
        if (currentContent) sections[currentSection] = currentContent.trim();
        currentSection = 'Unmet Needs';
        currentContent = line.replace('(1) Top 5 unmet needs ranked by urgency', '').trim();
      } else if (line.startsWith('(2) Sentiment per need')) {
        if (currentContent) sections[currentSection] = currentContent.trim();
        currentSection = 'Sentiment';
        currentContent = line.replace('(2) Sentiment per need', '').trim();
      } else if (line.startsWith('(3) Population segments most affected')) {
        if (currentContent) sections[currentSection] = currentContent.trim();
        currentSection = 'Affected Segments';
        currentContent = line.replace('(3) Population segments most affected', '').trim();
      } else if (line.startsWith('(4) Hidden needs')) {
        if (currentContent) sections[currentSection] = currentContent.trim();
        currentSection = 'Hidden Needs';
        currentContent = line.replace('(4) Hidden needs', '').trim();
      } else if (line.startsWith('(5) 3 specific NGO interventions')) {
        if (currentContent) sections[currentSection] = currentContent.trim();
        currentSection = 'NGO Interventions';
        currentContent = line.replace('(5) 3 specific NGO interventions', '').trim();
      } else {
        currentContent += (currentContent ? '\n' : '') + line;
      }
    });
    if (currentContent) sections[currentSection] = currentContent.trim();
    return sections;
  };

  const parsedResult = geminiResponse ? parseResponse(geminiResponse) : null;

  return (
    <div className="min-h-screen bg-primary-dark p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text gradient-text-communitypulse mb-2">
            CommunityPulse
          </h1>
          <p className="text-xl text-secondary-light">
            Paste community social media posts — extract hidden needs for NGO action
          </p>
        </header>

        <main>
          <section className="mb-12">
            <div className="relative max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="flex flex-col gap-4">
                  <textarea
                    id="community-posts"
                    rows={8}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste community social media posts, forum comments, or messages here..."
                    className="w-full p-4 rounded-lg bg-input-dark border border-input-border text-white placeholder-secondary-light focus:outline-none focus:ring-2 focus:ring-accent-teal transition duration-300 resize-none"
                    required
                  />
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-accent-teal to-accent-purple relative overflow-hidden group hover:shadow-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-teal opacity-0 group-hover:opacity-20 transition duration-300"></span>
                      <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? (
                          'Analyzing...'
                        ) : (
                          <>
                            <Search size={20} />
                            Analyze Needs
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {isLoading && (
            <section className="mt-12 text-center">
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
              <p className="text-secondary-light mt-4">Analyzing your data...</p>
            </section>
          )}

          {error && (
            <section className="mt-12 text-center">
              <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-6 py-4 rounded-lg max-w-xl mx-auto">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            </section>
          )}

          {parsedResult && !isLoading && (
            <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {Object.entries(parsedResult).map(([sectionTitle, content]) => (
                <div
                  key={sectionTitle}
                  className="card-glass p-6 rounded-lg shadow-lg border border-card-border"
                >
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text gradient-text-section mb-4">
                    {sectionTitle}
                  </h3>
                  {sectionTitle === 'Unmet Needs' ? (
                    <ul className="list-decimal list-inside space-y-2">
                      {content.split('\n').map((item: string, index: number) => (
                        <li key={index} className="text-white">
                          {item.trim() || 'N/A'}
                        </li>
                      ))}
                    </ul>
                  ) : sectionTitle === 'NGO Interventions' ? (
                    <ul className="list-disc list-inside space-y-2">
                      {content.split('\n').map((item: string, index: number) => (
                        <li key={index} className="text-white">
                          {item.trim() || 'N/A'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-secondary-light whitespace-pre-wrap">
                      {content || 'No information available.'}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
      {/* Aurora Background Elements */}
      <div className="fixed inset-0 z-0 opacity-50">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-teal-500 blur-3xl animate-aurora-move-1"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-600 blur-3xl animate-aurora-move-2"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-500 blur-3xl animate-aurora-move-3"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-500 blur-3xl animate-aurora-move-4"></div>
      </div>
    </div>
  );
};

export default HomePage;
```
--- FILE: app/api/generate/route.ts ---
```typescript
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return NextResponse.json(
      { message: 'Server configuration error: Gemini API key is missing.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const userPrompt = body.prompt;

    if (!userPrompt) {
      return NextResponse.json(
        { message: 'Bad Request: "prompt" is required in the request body.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a community intelligence AI for NGOs. Analyze these social media posts and extract: (1) Top 5 unmet needs ranked by urgency (1-10 score), (2) Sentiment per need (frustrated/scared/resigned/hopeful), (3) Population segments most affected, (4) Hidden needs not stated explicitly but implied, (5) 3 specific NGO interventions recommended. Quote specific posts as evidence.
`;

    const fullPrompt = systemPrompt + "\nUser Input:\n" + userPrompt;

    const response = await fetch(GEMINI_ENDPOINT, {
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

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Gemini API Error:', response.status, errorBody);
      throw new Error(`Gemini API failed with status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
      const geminiResult = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ result: geminiResult });
    } else {
      console.error('Gemini API returned unexpected data format:', data);
      return NextResponse.json(
        { message: 'AI analysis returned no usable content.' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { message: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
```
--- FILE: app/globals.css ---
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

:root {
  /* Aurora UI Color Palette */
  --color-primary-dark: #0a0a1a; /* Deep, dark background */
  --color-secondary-light: #b0b0c0; /* Lighter grey for secondary text */
  --color-white-primary: #ffffff; /* Primary text */

  --color-accent-teal: #00d4aa;
  --color-accent-purple: #7c3aed;
  --color-accent-blue: #2563eb;
  --color-accent-pink: #db2777;

  --color-input-dark: rgba(255, 255, 255, 0.05);
  --color-input-border: rgba(255, 255, 255, 0.1);
  --color-card-border: rgba(255, 255, 255, 0.08);

  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'Plus Jakarta Sans', sans-serif;
}

body {
  background-color: var(--color-primary-dark);
  font-family: var(--font-primary);
  color: var(--color-white-primary);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-secondary);
  font-weight: 700;
}

p {
  color: var(--color-secondary-light);
  line-height: 1.6;
}

textarea, input {
  font-family: var(--font-primary);
}

/* Aurora Gradient Text */
.gradient-text-communitypulse {
  background: linear-gradient(to right, var(--color-accent-teal), var(--color-accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-text-section {
  background: linear-gradient(to right, var(--color-accent-teal), var(--color-accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glassmorphism Card Style */
.card-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid var(--color-card-border);
}

/* Input Field Style */
.bg-input-dark {
  background: var(--color-input-dark);
}
.border-input-border {
  border-color: var(--color-input-border);
}

/* Button Gradient Hover */
.button-gradient-hover {
  background: linear-gradient(to right, var(--color-accent-teal), var(--color-accent-purple));
  transition: background-position 0.3s ease-in-out;
}
.button-gradient-hover:hover {
  background: linear-gradient(to right, var(--color-accent-purple), var(--color-accent-teal));
}

/* Loading Spinner */
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px; /* Adjust height as needed */
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid var(--color-accent-teal);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Aurora Orb Animation */
@keyframes aurora-move-1 {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-20px, 30px); }
  100% { transform: translate(0, 0); }
}
.animate-aurora-move-1 {
  animation: aurora-move-1 10s ease-in-out infinite;
}

@keyframes aurora-move-2 {
  0% { transform: translate(0, 0); }
  50% { transform: translate(20px, -30px); }
  100% { transform: translate(0, 0); }
}
.animate-aurora-move-2 {
  animation: aurora-move-2 12s ease-in-out infinite;
}

@keyframes aurora-move-3 {
  0% { transform: translate(0, 0); }
  50% { transform: translate(15px, 15px); }
  100% { transform: translate(0, 0); }
}
.animate-aurora-move-3 {
  animation: aurora-move-3 8s ease-in-out infinite;
}

@keyframes aurora-move-4 {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-15px, -15px); }
  100% { transform: translate(0, 0); }
}
.animate-aurora-move-4 {
  animation: aurora-move-4 11s ease-in-out infinite;
}

/* Tailwind Responsive Adjustments (Example) */
@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
/* Add more responsive overrides as needed */
```
--- END ---