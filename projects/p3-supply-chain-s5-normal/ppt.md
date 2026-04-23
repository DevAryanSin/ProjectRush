# Brief
The SupplierPulse tool provides an intuitive interface for supply chain managers to evaluate the risk associated with individual suppliers. By integrating Gemini AI, it moves beyond simple data entry to deliver intelligent, actionable insights, helping preempt potential disruptions and fortify supply chain resilience.

# Opportunities
## Differentiation
SupplierPulse differentiates itself by offering real-time, AI-powered risk assessment and actionable diversification strategies, going beyond static risk scores to provide dynamic, situation-specific recommendations. Its focus on a professional, trustworthy UI enhances user confidence in the AI's analytical capabilities.
## Problem Solving Approach
The application addresses the problem of reactive supply chain management by enabling proactive risk identification. It uses AI to synthesize complex supplier data into clear vulnerability factors and concrete action plans, allowing managers to mitigate risks *before* they escalate into significant disruptions.
## USP
The unique selling proposition of SupplierPulse is its combination of a user-friendly, professional interface with sophisticated Gemini AI-driven risk analytics, delivering not just a score but a pragmatic, multi-step plan for enhancing supply chain security and resilience.

# Features
- AI-powered supplier dependency risk assessment (0-100%).
- Identification of top 3 vulnerability factors.
- Single-source risk rating (CRITICAL/HIGH/MEDIUM/LOW).
- Personalized 3-step diversification action plan, including alternative supplier types.
- Clean, professional UI with clear input forms and visually hierarchical results.
- Responsive design for desktop and mobile use.

# Technologies
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Icons:** Lucide React
- **AI Integration:** Google Gemini 2.5 Flash API

--- FILE: app/page.tsx ---
```tsx
'use client';

import { useState, FormEvent } from 'react';
import { Rocket, Lightbulb, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface SupplierPulseResult {
  dependencyRiskScore: string;
  vulnerabilityFactors: string[];
  singleSourceRiskRating: string;
  diversificationActionPlan: string[];
  rawResult?: string;
}

export default function HomePage() {
  const [supplierName, setSupplierName] = useState('');
  const [whatTheySupply, setWhatTheySupply] = useState('');
  const [yearsWorked, setYearsWorked] = useState('');
  const [recentIssues, setRecentIssues] = useState('');
  const [alternativeSuppliers, setAlternativeSuppliers] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SupplierPulseResult | null>(null);

  const parseGeminiResponse = (text: string): SupplierPulseResult => {
    const parsed: SupplierPulseResult = {
      dependencyRiskScore: 'N/A',
      vulnerabilityFactors: [],
      singleSourceRiskRating: 'N/A',
      diversificationActionPlan: [],
    };

    // Extract Dependency Risk Score
    const riskScoreMatch = text.match(/Dependency Risk Score:\s*(\d+%)/);
    if (riskScoreMatch) {
      parsed.dependencyRiskScore = riskScoreMatch[1];
    }

    // Extract Vulnerability Factors
    const vulnerabilityFactorsMatch = text.match(/Vulnerability Factors:\s*\n((?:- .*\n){1,})/);
    if (vulnerabilityFactorsMatch) {
      parsed.vulnerabilityFactors = vulnerabilityFactorsMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('- '))
        .map(line => line.replace(/^- /, '').trim());
    }

    // Extract Single-Source Risk Rating
    const singleSourceRiskMatch = text.match(/Single-Source Risk Rating:\s*(CRITICAL|HIGH|MEDIUM|LOW)/i);
    if (singleSourceRiskMatch) {
      parsed.singleSourceRiskRating = singleSourceRiskMatch[1].toUpperCase();
    }

    // Extract Diversification Action Plan
    const actionPlanMatch = text.match(/Diversification Action Plan:\s*\n((?:- .*\n){1,})/);
    if (actionPlanMatch) {
      parsed.diversificationActionPlan = actionPlanMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('- '))
        .map(line => line.replace(/^- /, '').trim());
    }
    
    // Store the raw result for fallback display if parsing fails or is incomplete
    parsed.rawResult = text;

    return parsed;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
    Supplier name/type: ${supplierName}
    What they supply: ${whatTheySupply}
    How long worked with them (years): ${yearsWorked}
    Recent issues: ${recentIssues || 'None'}
    Alternative suppliers available: ${alternativeSuppliers || 'None'}
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
      if (data.result) {
        setResult(parseGeminiResponse(data.result));
      } else {
        throw new Error('No result found in the response.');
      }
    } catch (err) {
      console.error('Failed to fetch AI response:', err);
      setError('Failed to get an analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskRatingClass = (rating: string) => {
    switch (rating) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 ring-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 ring-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 ring-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 ring-green-200';
      default: return 'bg-gray-100 text-gray-800 ring-gray-200';
    }
  };

  const getDependencyScoreColor = (scoreStr: string) => {
    const score = parseInt(scoreStr.replace('%', ''), 10);
    if (isNaN(score)) return 'text-gray-700';
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-body text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 md:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold font-heading text-teal-600 flex items-center gap-2">
            <Rocket className="w-7 h-7 text-amber-500" /> SupplierPulse
          </h1>
          <nav>
            {/* Optional nav links can go here */}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form Card */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-fit">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6 border-b pb-4">
            Assess Supplier Dependency
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Name / Type
              </label>
              <input
                type="text"
                id="supplierName"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="whatTheySupply" className="block text-sm font-medium text-gray-700 mb-1">
                What do they supply? (e.g., raw materials, components, services)
              </label>
              <textarea
                id="whatTheySupply"
                value={whatTheySupply}
                onChange={(e) => setWhatTheySupply(e.target.value)}
                rows={3}
                required
                className="input-field"
              ></textarea>
            </div>

            <div>
              <label htmlFor="yearsWorked" className="block text-sm font-medium text-gray-700 mb-1">
                How long have you worked with them? (Years)
              </label>
              <input
                type="number"
                id="yearsWorked"
                value={yearsWorked}
                onChange={(e) => setYearsWorked(e.target.value)}
                min="0"
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="recentIssues" className="block text-sm font-medium text-gray-700 mb-1">
                Any recent issues? (e.g., delays, quality problems, communication breakdown)
              </label>
              <textarea
                id="recentIssues"
                value={recentIssues}
                onChange={(e) => setRecentIssues(e.target.value)}
                rows={3}
                className="input-field"
                placeholder="Leave blank if none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="alternativeSuppliers" className="block text-sm font-medium text-gray-700 mb-1">
                Are alternative suppliers available? If so, describe them.
              </label>
              <textarea
                id="alternativeSuppliers"
                value={alternativeSuppliers}
                onChange={(e) => setAlternativeSuppliers(e.target.value)}
                rows={3}
                className="input-field"
                placeholder="Leave blank if none or unknown"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              suppressHydrationWarning
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" /> Analyzing...
                </>
              ) : (
                <>
                  <Lightbulb className="w-5 h-5 mr-2" /> Get Analysis
                </>
              )}
            </button>
          </form>
        </section>

        {/* Results Card */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-fit">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6 border-b pb-4">
            Analysis Results
          </h2>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-teal-600">
              <Loader2 className="animate-spin w-12 h-12 mb-4" />
              <p className="text-lg">Crunching data, please wait...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md flex items-center gap-3" role="alert">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-500" /> Dependency Risk Score
                </h3>
                <p className={`text-5xl font-bold ${getDependencyScoreColor(result.dependencyRiskScore)}`}>
                  {result.dependencyRiskScore}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" /> Vulnerability Factors
                </h3>
                {result.vulnerabilityFactors.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {result.vulnerabilityFactors.map((factor, index) => (
                      <li key={index} className="text-sm">{factor}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No specific vulnerability factors identified, or they could not be parsed.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-teal-500" /> Single-Source Risk Rating
                </h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${getRiskRatingClass(result.singleSourceRiskRating)}`}>
                  {result.singleSourceRiskRating}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-teal-500" /> Diversification Action Plan
                </h3>
                {result.diversificationActionPlan.length > 0 ? (
                  <ol className="list-decimal list-inside text-gray-700 space-y-1">
                    {result.diversificationActionPlan.map((step, index) => (
                      <li key={index} className="text-sm">{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-gray-600">No specific diversification plan provided, or it could not be parsed.</p>
                )}
              </div>

              {/* Fallback for unparsed or partially parsed results */}
              {(!result.dependencyRiskScore.includes('%') ||
               result.vulnerabilityFactors.length === 0 ||
               result.singleSourceRiskRating === 'N/A' ||
               result.diversificationActionPlan.length === 0) && result.rawResult && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Full AI Response (for debugging/fallback):</h3>
                  <pre className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {result.rawResult}
                  </pre>
                </div>
              )}
            </div>
          )}

          {!isLoading && !error && !result && (
            <div className="text-center py-12 text-gray-500">
              <Lightbulb className="w-10 h-10 mx-auto mb-3 text-amber-400" />
              <p className="text-lg">Enter supplier details to get an analysis.</p>
              <p className="text-sm">Understand your supply chain vulnerabilities.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm border-t border-gray-100 bg-white">
        <p>&copy; {new Date().getFullYear()} SupplierPulse. All rights reserved.</p>
      </footer>
    </div>
  );
}
```
--- FILE: app/api/generate/route.ts ---
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt: userInput } = await req.json();

  if (!userInput) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
  }

  const geminiSystemPrompt = `You are a supplier risk assessment AI. Evaluate this supplier relationship and provide:
- **Dependency Risk Score:** (0-100%)
- **Vulnerability Factors:** (List top 3 specific factors, e.g., "Lack of alternative suppliers", "High volume reliance", "Past performance issues")
- **Single-Source Risk Rating:** (CRITICAL/HIGH/MEDIUM/LOW)
- **Diversification Action Plan:** (Provide a 3-step action plan, including specific types of alternative suppliers to seek. Format as "- Step 1: ...", "- Step 2: ...", "- Step 3: ...")

Based on the following supplier information:`;

  const fullPrompt = `${geminiSystemPrompt}\n\n${userInput}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.7, // Adjust temperature for creativity vs. consistency
            topP: 0.95,
            topK: 60,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: `Gemini API call failed: ${errorData.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const geminiResult = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';

    return NextResponse.json({ result: geminiResult }, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal server error during AI generation.' },
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

/* Custom Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lexend+Deca:wght@400;500;600;700&display=swap');

@layer base {
  :root {
    /* Base Colors */
    --color-primary-teal: #008080; /* Industrial Teal */
    --color-primary-teal-dark: #006666;
    --color-accent-amber: #FFA000; /* Professional Amber */
    --color-accent-amber-dark: #cc8000;

    /* Text Colors */
    --color-text-default: #333333;
    --color-text-secondary: #666666;

    /* Backgrounds */
    --color-bg-light: #f8f9fa; /* Light grey for sections */
    --color-bg-white: #ffffff;

    /* Border & Shadow */
    --color-border: #e0e0e0;
    --shadow-subtle: 0 1px 3px rgba(0,0,0,0.1);

    /* Border Radius */
    --border-radius-base: 4px;
  }

  body {
    font-family: 'Inter', sans-serif;
    color: var(--color-text-default);
    background-color: var(--color-bg-light);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Lexend Deca', sans-serif;
  }
}

@layer components {
  .input-field {
    @apply w-full p-2.5 bg-white border border-gray-300 rounded-[var(--border-radius-base)] shadow-sm
           focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none
           transition-all duration-200 ease-in-out text-sm text-gray-800;
  }

  .btn-primary {
    @apply w-full md:w-auto px-6 py-2.5 bg-[var(--color-primary-teal)] text-white font-semibold
           rounded-[var(--border-radius-base)] shadow-[var(--shadow-subtle)]
           hover:bg-[var(--color-primary-teal-dark)] transition-colors duration-200 ease-in-out
           focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:ring-offset-2
           flex items-center justify-center text-base;
  }

  .btn-primary:disabled {
    @apply bg-gray-400 cursor-not-allowed shadow-none;
  }
}

/* Custom Tailwind utility classes for easy access to custom properties */
@layer utilities {
  .font-heading {
    font-family: 'Lexend Deca', sans-serif;
  }
  .font-body {
    font-family: 'Inter', sans-serif;
  }
  .bg-section-light {
    background-color: var(--color-bg-light);
  }
  .text-teal-600 {
    color: var(--color-primary-teal);
  }
  .text-amber-500 {
    color: var(--color-accent-amber);
  }
}
```
--- END ---