# Brief
A web application that provides a vendor reliability scorecard by analyzing user-provided relationship details through an AI model.

# Opportunities
- Differentiation: Unique AI-powered vendor assessment and proactive disruption detection for supply chains.
- Problem Solving Approach: Continuously analyzes transit data to preemptively flag and mitigate supply chain disruptions.
- USP: Dynamic route adjustment recommendations to prevent cascading delays.

# Features
- Vendor relationship input form
- AI-powered reliability scorecard generation (scores, grade, risk flags, recommendations)
- Neumorphism UI with a soft, extruded 3D aesthetic
- Responsive design for all devices
- Loading and error state handling
- Prominent display of vendor name and tagline
- Seamless integration with Gemini API for backend processing

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React for icons
- Gemini API (gemini-2.5-flash)
- Google Fonts (Poppins)

Constraints:
- No markdown like ** or ##
- No code
- Clean bullet points only
- Keep concise
--- FILE: app/page.tsx ---
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

export default function HomePage() {
  const [formData, setFormData] = useState({
    vendorType: '',
    yearsTogether: '',
    recentIssues: '',
    deliveryPerformance: '',
    communicationQuality: '',
    financialStabilitySignals: '',
  });
  const [scorecard, setScorecard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setScorecard(null);
    setError(null);

    const prompt = `Vendor Type: ${formData.vendorType}\n` +
                   `Years Worked Together: ${formData.yearsTogether}\n` +
                   `Recent Issues: ${formData.recentIssues}\n` +
                   `Delivery Performance: ${formData.deliveryPerformance}\n` +
                   `Communication Quality: ${formData.communicationQuality}\n` +
                   `Financial Stability Signals: ${formData.financialStabilitySignals}`;

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
        throw new Error(errorData.error || 'Failed to generate scorecard');
      }

      const data = await response.json();
      setScorecard(data.result);
    } catch (err) {
      console.error('Error fetching scorecard:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-center mb-2 text-gray-700">VendorScore</h1>
      <p className="text-lg text-center mb-12 text-gray-500">Describe a vendor relationship — get a full reliability scorecard</p>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-6 p-8 rounded-xl shadow-neomorph-outer bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="input-group">
            <label htmlFor="vendorType" className="input-label">Vendor Type</label>
            <input
              type="text"
              id="vendorType"
              name="vendorType"
              value={formData.vendorType}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label htmlFor="yearsTogether" className="input-label">Years Together</label>
            <input
              type="text"
              id="yearsTogether"
              name="yearsTogether"
              value={formData.yearsTogether}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g., 5"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="recentIssues" className="input-label">Recent Issues</label>
          <textarea
            id="recentIssues"
            name="recentIssues"
            value={formData.recentIssues}
            onChange={handleChange}
            required
            rows={3}
            className="input-field resize-none"
            placeholder="Describe any recent problems or concerns"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="input-group">
            <label htmlFor="deliveryPerformance" className="input-label">Delivery Performance</label>
            <input
              type="text"
              id="deliveryPerformance"
              name="deliveryPerformance"
              value={formData.deliveryPerformance}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g., 95% on-time"
            />
          </div>
          <div className="input-group">
            <label htmlFor="communicationQuality" className="input-label">Communication Quality</label>
            <input
              type="text"
              id="communicationQuality"
              name="communicationQuality"
              value={formData.communicationQuality}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g., Responsive, Proactive"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="financialStabilitySignals" className="input-label">Financial Stability Signals</label>
          <textarea
            id="financialStabilitySignals"
            name="financialStabilitySignals"
            value={formData.financialStabilitySignals}
            onChange={handleChange}
            required
            rows={3}
            className="input-field resize-none"
            placeholder="e.g., Positive payment history, Strong credit indicators"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className={`btn-submit ${isLoading ? 'btn-submit-loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 8.015l4-3.706z"></path>
              </svg>
            ) : null}
            {isLoading ? 'Generating...' : 'Get Scorecard'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-neomorph-inner w-full max-w-3xl text-center">
          {error}
        </div>
      )}

      {scorecard && !isLoading && (
        <div className="mt-12 p-8 rounded-xl shadow-neomorph-outer bg-background w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Vendor Reliability Scorecard</h2>
          <div className="scorecard-content text-gray-600 space-y-4" dangerouslySetInnerHTML={{ __html: formatScorecard(scorecard) }} />
        </div>
      )}
    </div>
  );
}

function formatScorecard(scorecardText: string): string {
  let html = scorecardText;
  const lines = scorecardText.split('\n');
  let currentSection = '';

  const sections: { [key: string]: string } = {
    'Scores:': '',
    'Overall Grade:': '',
    'Risk Flags:': '',
    'Recommendations:': '',
  };

  lines.forEach(line => {
    if (line.startsWith('Scores:')) {
      currentSection = 'Scores:';
      sections[currentSection] += `<h3>Scores:</h3><ul>`;
    } else if (line.match(/^\s*\w+(\s+\w+)*:\s*\d+\/10/)) {
        if (currentSection === 'Scores:') {
            const [dimension, score] = line.split(':');
            sections[currentSection] += `<li><strong>${dimension.trim()}:</strong> ${score.trim()}</li>`;
        } else {
            html = html.replace(line, `<p><strong>${line.trim()}</strong></p>`);
        }
    } else if (line.match(/^Overall Grade:/)) {
      currentSection = 'Overall Grade:';
      sections[currentSection] += `<h3>Overall Grade:</h3>`;
      sections[currentSection] += `<p><strong>${line}</strong></p>`;
    } else if (line.match(/^Top \d+ Risk Flags:/)) {
      currentSection = 'Risk Flags:';
      sections[currentSection] += `<h3>Risk Flags:</h3><ul>`;
      sections[currentSection] += `<li>${line.replace('Top \d+ Risk Flags:', '').trim()}</li>`;
    } else if (line.match(/^[\w\s]+\./) && currentSection === 'Risk Flags:') {
       sections[currentSection] += `<li>${line.trim()}</li>`;
    } else if (line.match(/^Relationship Recommendations:/)) {
      currentSection = 'Recommendations:';
      sections[currentSection] += `<h3>Relationship Recommendations:</h3><ul>`;
    } else if (line.match(/^[\w\s]+(?:\.$|$)/) && currentSection === 'Recommendations:') {
        sections[currentSection] += `<li>${line.trim()}</li>`;
    } else if (line.trim()) {
        // Fallback for other lines, perhaps justifications
        if (currentSection && sections[currentSection]) {
           if (sections[currentSection].includes('<h3>')) {
                // Append justification to the last item if it looks like a justification
                const items = sections[currentSection].split('</li>');
                if (items.length > 1) {
                    const lastItem = items[items.length - 2];
                    const updatedLastItem = lastItem + `<br/><em> - ${line.trim()}</em>`;
                    items[items.length - 2] = updatedLastItem;
                    sections[currentSection] = items.join('</li>');
                } else {
                     sections[currentSection] += `<p><em>${line.trim()}</em></p>`;
                }
            } else {
                 sections[currentSection] += `<p><em>${line.trim()}</em></p>`;
            }
        } else {
            html = html.replace(line, `<p>${line.trim()}</p>`);
        }
    }
  });

  if (sections['Scores:']) sections['Scores:'] += `</ul>`;
  if (sections['Risk Flags:']) sections['Risk Flags:'] += `</ul>`;
  if (sections['Recommendations:']) sections['Recommendations:'] += `</ul>`;


  // Combine formatted sections, preserving original structure where needed
  const formattedHtmlParts = [];
  let remainingHtml = html;

  for (const sectionKey of ['Scores:', 'Overall Grade:', 'Risk Flags:', 'Recommendations:']) {
      if (sections[sectionKey]) {
          formattedHtmlParts.push(sections[sectionKey]);
          // Attempt to remove the original text of this section from remainingHtml to avoid duplication
          const sectionRegex = new RegExp(`^${sectionKey.replace(':', '\\:')}.*?(\n\n|\\n(?=Scores:|Overall Grade:|Risk Flags:|Recommendations:)|$)`, 'smi');
          remainingHtml = remainingHtml.replace(sectionRegex, '');
      }
  }
  // Add any remaining non-section text, potentially justifications or intro/outro
  if (remainingHtml.trim()) {
      formattedHtmlParts.push(`<div class="additional-info">${remainingHtml.trim().split('\n').map(l => `<p>${l}</p>`).join('')}</div>`);
  }

  return formattedHtmlParts.join('<div class="my-6 h-px bg-gray-300 rounded-full"></div>');
}

--- FILE: app/api/generate/route.ts ---
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  const { prompt } = await request.json();

  const systemPrompt = "You are a vendor assessment AI. Score this vendor across 5 dimensions (each 1-10): Delivery Reliability, Communication Quality, Financial Stability, Flexibility/Responsiveness, Risk Concentration. Give overall grade (A-F), top 2 risk flags, and 3 relationship recommendations. Justify each score briefly.";

  const fullPrompt = `${systemPrompt}\n\n${prompt}`;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      return NextResponse.json({ result: data.candidates[0].content.parts[0].text });
    } else {
      console.error('Unexpected Gemini API response format:', JSON.stringify(data));
      throw new Error('Received an unexpected response format from Gemini.');
    }

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate scorecard' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

:root {
  --background-color: #e0e5ec; /* Soft mid-tone */
  --text-color-primary: #333;
  --text-color-secondary: #555;
  --accent-color: #50b0f0; /* Soft blue */
  --shadow-light: #ffffff;
  --shadow-dark: rgba(0, 0, 0, 0.15);
  --shadow-inset-light: #e0e5ec; /* Background color for inset */
  --shadow-inset-dark: rgba(0, 0, 0, 0.1); /* Slightly less dark for inset */
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color-primary);
  line-height: 1.6;
}

/* Neumorphism Outer Shadow */
.shadow-neomorph-outer {
  box-shadow:
    -6px -6px 12px var(--shadow-light),
    6px 6px 12px var(--shadow-dark);
}

/* Neumorphism Inner Shadow (for focus/active states, or inside elements) */
.shadow-neomorph-inner {
  box-shadow:
    inset -4px -4px 8px var(--shadow-light),
    inset 4px 4px 8px var(--shadow-dark);
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-weight: 500;
  margin-bottom: 0.75rem; /* space-y-3 equivalent */
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.input-field {
  background-color: var(--background-color);
  padding: 0.8rem 1rem;
  border-radius: 12px; /* Rounded corners */
  border: none;
  font-size: 1rem;
  color: var(--text-color-primary);
  outline: none;
  box-shadow:
    inset -3px -3px 7px var(--shadow-light),
    inset 3px 3px 7px var(--shadow-dark);
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.input-field:focus {
  box-shadow:
    inset -4px -4px 10px var(--shadow-light),
    inset 4px 4px 10px var(--shadow-dark),
    0 0 0 3px var(--accent-color); /* Focus ring */
  transform: translateY(1px); /* Slight press down effect on focus */
}

.input-field::placeholder {
  color: var(--text-color-secondary);
  opacity: 0.7;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color);
  padding: 0.8rem 2rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color-primary);
  cursor: pointer;
  box-shadow:
    -5px -5px 10px var(--shadow-light),
    5px 5px 10px var(--shadow-dark);
  transition: all 0.2s ease-in-out;
  min-width: 180px; /* Ensure button has a decent width */
}

.btn-submit:hover:not(:disabled) {
  box-shadow:
    inset -3px -3px 7px var(--shadow-light),
    inset 3px 3px 7px var(--shadow-dark);
  transform: translateY(2px);
}

.btn-submit:active:not(:disabled) {
   box-shadow:
    inset -4px -4px 10px var(--shadow-light),
    inset 4px 4px 10px var(--shadow-dark);
  transform: translateY(4px);
}

.btn-submit:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow:
    inset -3px -3px 7px var(--shadow-light),
    inset 3px 3px 7px var(--shadow-dark);
}

.btn-submit-loading {
  background-color: var(--accent-color);
  color: white;
  box-shadow:
    inset -3px -3px 7px var(--shadow-light),
    inset 3px 3px 7px var(--shadow-dark);
}

.scorecard-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color-primary);
  border-bottom: 1px solid var(--shadow-dark); /* Subtle separator */
  padding-bottom: 0.5rem;
}

.scorecard-content ul {
  list-style: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
}

.scorecard-content li {
  margin-bottom: 0.5rem;
  color: var(--text-color-secondary);
}

.scorecard-content strong {
  color: var(--text-color-primary);
  font-weight: 600;
}

.scorecard-content em {
    font-style: italic;
    color: var(--text-color-secondary);
    font-size: 0.9rem;
}

.scorecard-content p {
    margin-bottom: 0.75rem;
}
.scorecard-content .additional-info p {
    margin-bottom: 0.5rem;
}
.scorecard-content .additional-info p:last-child {
    margin-bottom: 0;
}
--- END ---