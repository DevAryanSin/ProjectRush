# Brief
A sophisticated platform for sports organizations to identify, track, and flag unauthorized use of their digital media assets, providing a clear vulnerability ranking and actionable protection strategies.

# Opportunities
- Differentiation: Specializes in high-value digital sports media, a niche with significant IP risk.
- Problem Solving Approach: Leverages AI for automated risk assessment and provides tailored security recommendations.
- USP: Real-time threat identification and proactive IP protection for sports media.

# Features
- Interactive Input Form: Intuitive interface for describing media assets, platforms, access levels, and commercial value.
- AI-Powered Vulnerability Ranking: Gemini analyzes input to score and rank asset types by theft risk.
- Detailed Risk Analysis: Explains why assets are at risk, identifies exposure platforms, and suggests specific protection actions.
- Aurora UI Style: Immersive dark theme with ethereal gradient overlays for a premium, secure feel.
- Responsive Design: Fully functional and visually appealing on all devices.
- Loading & Error States: Clear visual feedback during processing and user-friendly error messaging.

# Technologies
- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Icons: Lucide React
- AI Integration: Gemini API (gemini-2.5-flash)

Constraints:
- No markdown like ** or ##
- No code
- Clean bullet points only
- Keep concise
--- FILE: app/page.tsx ---
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

interface VulnerabilityData {
  assetType: string;
  riskScore: number;
  reason: string;
  platforms: string;
  protectionActions: string[];
}

export default function HomePage() {
  const [assetDescription, setAssetDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [parsedVulnerabilities, setParsedVulnerabilities] = useState<VulnerabilityData[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAssetDescription(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeminiResponse(null);
    setParsedVulnerabilities([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: assetDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analysis from Gemini.');
      }

      const data = await response.json();
      setGeminiResponse(data.result);
      parseGeminiResponse(data.result);

    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseGeminiResponse = (response: string) => {
    const vulnerabilities: VulnerabilityData[] = [];
    const lines = response.split('\n').filter(line => line.trim() !== '');

    let currentAsset: VulnerabilityData | null = null;

    lines.forEach(line => {
      const riskMatch = line.match(/Risk Score: (\d+)\/10/i);
      const platformMatch = line.match(/Exposed on Platforms: (.*)/i);
      const actionMatch = line.match(/- (\d+\.|-) (Protect by|Use|Implement): (.*)/i); // More robust action matching

      if (line.startsWith('- ') && !line.startsWith('- Risk Score') && !line.startsWith('- Exposed on Platforms')) {
        if (currentAsset) {
          vulnerabilities.push(currentAsset);
        }
        currentAsset = {
          assetType: line.replace('- ', '').split(' (')[0].trim(),
          riskScore: 0,
          reason: '',
          platforms: '',
          protectionActions: []
        };
      } else if (currentAsset) {
        if (riskMatch) {
          currentAsset.riskScore = parseInt(riskMatch[1], 10);
        } else if (platformMatch) {
          currentAsset.platforms = platformMatch[1].trim();
        } else if (actionMatch) {
          currentAsset.protectionActions.push(actionMatch[3].trim());
        } else if (!line.match(/Risk Score:|Exposed on Platforms:/i)) {
          // Assuming remaining lines are part of the reason if it's not a structured field
          if (currentAsset.reason) {
            currentAsset.reason += ' ' + line.trim();
          } else {
            currentAsset.reason = line.trim();
          }
        }
      }
    });

    if (currentAsset) {
      vulnerabilities.push(currentAsset);
    }
    setParsedVulnerabilities(vulnerabilities);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050810] to-[#0a0a1a] text-white p-8 lg:p-16 relative overflow-hidden font-sans">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-[-200px] -left-[200px] w-[600px] h-[600px] bg-gradient-to-br from-cyan-400/30 to-purple-600/30 rounded-full blur-[120px] opacity-50"
        animate={{
          y: [-20, 20, -20],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      ></motion.div>
      <motion.div
        className="absolute bottom-[-150px] -right-[150px] w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 to-pink-500/30 rounded-full blur-[110px] opacity-50"
        animate={{
          y: [15, -15, 15],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      ></motion.div>

      <div className="relative z-10 container mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-purple-500 mb-2">
            AssetVault
          </h1>
          <p className="text-lg lg:text-xl text-gray-300">Describe your media library — get a theft vulnerability ranking</p>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-16">
            <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-lg">
              <label htmlFor="asset-description" className="block text-2xl font-semibold mb-4 text-cyan-400">
                Describe Your Media Library
              </label>
              <textarea
                id="asset-description"
                rows={8}
                className="w-full p-4 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-300 resize-none"
                placeholder="e.g., 'We have thousands of high-resolution photos of athletes, game footage from major league games, short promotional videos for team merchandise, and player interviews. Most are stored on internal servers but shared via cloud platforms like Dropbox and Google Drive for marketing teams. Player interviews are also on YouTube and TikTok.'"
                value={assetDescription}
                onChange={handleInputChange}
                required
              ></textarea>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="px-10 py-3 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || assetDescription.length === 0}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    'Get Vulnerability Ranking'
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-red-900 bg-opacity-50 border border-red-600 rounded-xl flex items-center">
              <AlertCircle className="h-6 w-6 text-red-400 mr-4" />
              <p className="text-lg text-red-200">Error: {error}</p>
            </div>
          )}

          {geminiResponse && !isLoading && !error && parsedVulnerabilities.length > 0 && (
            <div className="max-w-3xl mx-auto mt-16">
              <h2 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-purple-500">
                Vulnerability Analysis Results
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {parsedVulnerabilities.map((vuln, index) => (
                  <motion.div
                    key={index}
                    className="bg-black bg-opacity-30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-purple-400">
                        {vuln.assetType}
                      </h3>
                      <span className="text-2xl font-bold text-yellow-400 px-4 py-1 rounded-full border border-yellow-500 bg-yellow-900 bg-opacity-30">
                        Score: {vuln.riskScore}/10
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4 text-lg">{vuln.reason}</p>
                    <div className="mb-4">
                      <p className="text-gray-400 font-semibold mb-2">Exposed On Platforms:</p>
                      <p className="text-white text-lg">{vuln.platforms || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold mb-2">Protection Recommendations:</p>
                      <ul className="list-disc list-inside text-white text-lg space-y-1">
                        {vuln.protectionActions.map((action, actionIndex) => (
                          <li key={actionIndex}>{action}</li>
                        ))}
                        {vuln.protectionActions.length === 0 && <li>No specific recommendations provided.</li>}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not found in environment variables.');
    return NextResponse.json({ error: 'Gemini API key is missing.' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const systemPrompt = "You are a digital asset security analyst. Analyze this media library and rank each asset type by theft vulnerability (1-10 score). For each: explain why it's at risk, which platforms expose it most, and give 2 specific protection actions. Output as a prioritized ranked list.";

  const fullPrompt = `${systemPrompt}\n\nUser Input:\n${prompt}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Basic check for empty or error response from Gemini
    if (!text || text.toLowerCase().includes('error') || text.trim().length === 0) {
        throw new Error('Gemini returned an empty or error response.');
    }

    return NextResponse.json({ result: text });

  } catch (error: any) {
    console.error('Error generating content from Gemini:', error);
    let errorMessage = 'Failed to get analysis from AI.';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');

:root {
  --color-background-dark: #0a0a1a;
  --color-background-deep: #050810;
  --color-card-bg: rgba(255, 255, 255, 0.05);
  --color-primary-text: #ffffff;
  --color-secondary-text: #cccccc;
  --color-accent-teal: #00d4aa;
  --color-accent-purple: #7c3aed;
  --color-accent-blue: #2563eb;
  --color-accent-pink: #db2777;
  --color-gradient-start: var(--color-accent-teal);
  --color-gradient-end: var(--color-accent-purple);
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--color-background-deep);
  color: var(--color-primary-text);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--color-primary-text);
}

.font-sans {
  font-family: 'Inter', sans-serif;
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--color-gradient-start), var(--color-gradient-end));
}

.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.card {
  background-color: var(--color-card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Aurora Orb Animations */
.aurora-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  animation: moveOrb 10s infinite ease-in-out alternate;
}

@keyframes moveOrb {
  0% {
    transform: translateY(-20px);
    opacity: 0.4;
  }
  100% {
    transform: translateY(20px);
    opacity: 0.6;
  }
}

/* Input Field Style */
input[type="text"],
textarea {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--color-primary-text);
  padding: 1rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease-in-out;
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  ring-2: var(--color-accent-teal);
  border-color: transparent;
  box-shadow: 0 0 0 2px var(--color-accent-teal);
}

/* Button Styles */
button {
  transition: all 0.3s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 15px rgba(0, 212, 170, 0.2), 0 4px 15px rgba(124, 58, 237, 0.2);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Scrollbar styling for Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-accent-teal) var(--color-background-deep);
}

/* Scrollbar styling for Webkit (Chrome, Safari) */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-background-deep);
}

::-webkit-scrollbar-thumb {
  background-color: var(--color-accent-teal);
  border-radius: 5px;
  border: 2px solid var(--color-background-deep);
}
--- END ---