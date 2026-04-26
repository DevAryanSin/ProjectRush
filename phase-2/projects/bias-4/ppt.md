# Brief
CounterfactualAI is a web-based tool that leverages AI to identify and flag discriminatory bias in automated decision-making systems. It provides organizations with actionable counterfactual test cases to ensure fairness and accountability.

# Opportunities
- Differentiation: Unique terminal/hacker UI, specialized focus on counterfactual fairness testing.
- Problem Solving Approach: Systematically isolates demographic variables to reveal hidden biases.
- USP: Generates specific, testable scenarios for algorithmic accountability, promoting ethical AI.

# Features
- Interactive terminal-like UI for inputting decision details.
- AI-powered generation of 5 counterfactual fairness test cases.
- Clear display of expected fair outcomes and potential bias flags.
- Loading and error states for enhanced user experience.
- Fully responsive design for accessibility across devices.

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini API (gemini-2.5-flash)
- Lucide React for icons

Constraints:
- Monospace fonts only.
- Restricted color palette (black, greens, white, cyan).
- No external npm packages beyond core dependencies.
- Strict adherence to UI style guide.

--- FILE: app/page.tsx ---
```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, Loader2, FileWarning } from 'lucide-react';

interface ResultBlock {
  scenario: string;
  shouldBe: string;
  biasedOutcome?: string;
  passFail: string;
}

export default function HomePage() {
  const [decision, setDecision] = useState('');
  const [inputFactors, setInputFactors] = useState('');
  const [demographicContext, setDemographicContext] = useState('');
  const [decisionDomain, setDecisionDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setResults([]);

    const prompt = `
      Decision: ${decision}
      Key Input Factors: ${inputFactors}
      Demographic Context: ${demographicContext}
      Decision Domain: ${decisionDomain}
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
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const geminiResponse = data.result;

      // Basic parsing - more robust parsing might be needed depending on Gemini's output structure
      const parsedResults: ResultBlock[] = [];
      const scenarios = geminiResponse.split(/\n\n(?=Scenario \d+:)/); // Split by Scenario

      scenarios.forEach((scenarioText: string) => {
        if (!scenarioText.trim()) return;

        const lines = scenarioText.split('\n');
        const scenarioMatch = lines[0].match(/Scenario \d+:/);
        if (!scenarioMatch) return;

        const scenario = lines[0];
        let shouldBe = '';
        let biasedOutcome = '';
        let passFail = '';

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('Should be:')) {
            shouldBe = line.replace('Should be:', '').trim();
          } else if (line.startsWith('Potential Biased Outcome:')) {
            biasedOutcome = line.replace('Potential Biased Outcome:', '').trim();
          } else if (line.startsWith('Pass/Fail Criteria:')) {
            passFail = line.replace('Pass/Fail Criteria:', '').trim();
          }
        }
        parsedResults.push({ scenario, shouldBe, biasedOutcome, passFail });
      });
      setResults(parsedResults);

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An unknown error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terminal-container">
      <header className="terminal-header">
        <div className="window-controls">
          <span className="control red"></span>
          <span className="control yellow"></span>
          <span className="control green"></span>
        </div>
        <div className="terminal-title">CounterfactualAI</div>
      </header>
      <main className="terminal-body">
        <h1 className="main-title">CounterfactualAI</h1>
        <p className="tagline">Input an automated decision — generate counterfactual fairness test cases</p>

        <div className="input-section">
          <label htmlFor="decision" className="prompt-label">
            <span className="prompt-char">&gt;</span> Decision:
          </label>
          <input
            ref={inputRef}
            type="text"
            id="decision"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="input-field"
            placeholder="e.g., Loan application approved"
            disabled={loading}
          />
        </div>

        <div className="input-section">
          <label htmlFor="inputFactors" className="prompt-label">
            <span className="prompt-char">&gt;</span> Key Input Factors:
          </label>
          <input
            type="text"
            id="inputFactors"
            value={inputFactors}
            onChange={(e) => setInputFactors(e.target.value)}
            className="input-field"
            placeholder="e.g., Credit score, income, employment history"
            disabled={loading}
          />
        </div>

        <div className="input-section">
          <label htmlFor="demographicContext" className="prompt-label">
            <span className="prompt-char">&gt;</span> Demographic Context:
          </label>
          <input
            type="text"
            id="demographicContext"
            value={demographicContext}
            onChange={(e) => setDemographicContext(e.target.value)}
            className="input-field"
            placeholder="e.g., Applicant's race, gender, age group"
            disabled={loading}
          />
        </div>

        <div className="input-section">
          <label htmlFor="decisionDomain" className="prompt-label">
            <span className="prompt-char">&gt;</span> Decision Domain:
          </label>
          <input
            type="text"
            id="decisionDomain"
            value={decisionDomain}
            onChange={(e) => setDecisionDomain(e.target.value)}
            className="input-field"
            placeholder="e.g., Finance, Healthcare, Employment"
            disabled={loading}
          />
        </div>

        <button onClick={handleSubmit} className="submit-button" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          {loading ? 'Processing...' : '[> EXECUTE]'}
        </button>

        {error && (
          <div className="error-message">
            <FileWarning size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <Loader2 size={20} className="animate-spin mr-2" />
            <p>Generating counterfactual scenarios...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="results-section">
            <h2 className="results-title">[<span className="accent-cyan">output</span>]</h2>
            {results.map((result, index) => (
              <div key={index} className="result-block">
                <h3 className="scenario-title">{result.scenario}</h3>
                <p><span className="prompt-char">&gt;</span> <span className="bold-text">Should be:</span> {result.shouldBe}</p>
                {result.biasedOutcome && (
                  <p><span className="prompt-char">&gt;</span> <span className="bold-text">Potential Biased Outcome:</span> {result.biasedOutcome}</p>
                )}
                <p className="pass-fail"><span className="prompt-char">&gt;</span> <span className="bold-text">Pass/Fail Criteria:</span> {result.passFail}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="terminal-footer">
        <p>&copy; {new Date().getFullYear()} CounterfactualAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

```
--- FILE: app/api/generate/route.ts ---
```typescript
import { NextResponse, type NextRequest } from 'next/server';
import OpenAI from 'openai';

// Ensure GEMINI_API_KEY is set in your environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable not set');
}

const openai = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
});

export async function POST(request: NextRequest) {
  try {
    const { prompt: userInput } = await request.json();

    const systemPrompt = `You are a counterfactual fairness testing AI. Given this decision and its inputs, generate 5 counterfactual test cases. For each: change ONE demographic attribute (race/gender/age/location), keep all else identical, state the expected fair outcome, and flag if a biased system would likely give a different result. Format as testable scenarios with pass/fail criteria.
    `;

    const fullPrompt = `${systemPrompt}\n\n${userInput}`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gemini-2.5-flash", // Explicitly using the model name
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.7, // Adjust as needed for creativity vs. determinism
    });

    const geminiResponse = chatCompletion.choices[0]?.message?.content;

    if (!geminiResponse) {
      throw new Error('Gemini API returned an empty response.');
    }

    return NextResponse.json({ result: geminiResponse });

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    // Provide a more specific error message if available from the API
    const errorMessage = error.message || 'Failed to generate counterfactual scenarios.';
    return NextResponse.json({ message: errorMessage }, { status: error.status || 500 });
  }
}
```
--- FILE: app/globals.css ---
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Font Import */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');

:root {
  --background: #0a0f0a;
  --text-primary: #39ff14; /* Brighter green */
  --text-secondary: #008f11; /* Dimmer green */
  --accent-cyan: #00ffff;
  --border-color: var(--text-primary);
  --input-border: var(--text-primary);
  --button-bg: transparent;
  --button-text: var(--text-primary);
  --button-border: var(--text-primary);
  --button-hover-bg: var(--text-secondary);
  --button-hover-text: var(--accent-cyan);
  --loading-text: var(--accent-cyan);
  --error-text: #ff4500; /* Orange-red */
  --error-bg: #200000;
}

body {
  background-color: var(--background);
  color: var(--text-primary);
  font-family: 'Fira Code', monospace;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align to top */
  min-height: 100vh;
  padding-top: 40px; /* Space from top */
}

/* Terminal Container */
.terminal-container {
  width: 90%;
  max-width: 900px;
  border: 1px solid var(--border-color);
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.3); /* Green glow */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevents shadow bleeding */
  background-color: var(--background);
}

/* Terminal Header */
.terminal-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #000000; /* Black for header */
  border-bottom: 1px solid var(--border-color);
}

.window-controls {
  display: flex;
  margin-right: 10px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
  display: inline-block;
}

.control.red { background-color: #ff5f56; }
.control.yellow { background-color: #ffbd2e; }
.control.green { background-color: #27c93f; }

.terminal-title {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.9rem;
}

/* Terminal Body */
.terminal-body {
  padding: 20px 25px;
  flex-grow: 1;
}

.main-title {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 10px;
  text-align: left;
  font-weight: 700;
  letter-spacing: 2px;
}

.tagline {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 30px;
  text-align: left;
  opacity: 0.8;
}

.input-section {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.prompt-label {
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: 10px;
  color: var(--accent-cyan);
  font-weight: 700;
  font-size: 1rem;
}

.prompt-char {
  color: var(--text-primary);
  margin-right: 5px;
  font-weight: 700;
}

.input-field {
  flex-grow: 1;
  background-color: transparent;
  border: 1px solid var(--input-border);
  color: var(--text-primary);
  padding: 8px 12px;
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  outline: none;
  caret-color: var(--text-primary); /* Cursor color */
  transition: border-color 0.2s ease-in-out;
  min-width: 150px; /* Ensure it doesn't get too small */
}

.input-field::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.input-field:focus {
  border-color: var(--accent-cyan);
}

.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


.submit-button {
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--button-text);
  padding: 10px 20px;
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--button-hover-bg);
  color: var(--button-hover-text);
  border-color: var(--accent-cyan);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


.loading-message, .error-message {
  margin-top: 25px;
  padding: 15px;
  border: 1px dashed var(--text-secondary);
  background-color: rgba(0, 10, 0, 0.5); /* Darker overlay */
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  animation: blink 1.5s infinite;
}

.error-message {
  border-color: var(--error-text);
  color: var(--error-text);
  background-color: var(--error-bg);
}

.loading-message {
  color: var(--loading-text);
  border-color: var(--accent-cyan);
}

.results-section {
  margin-top: 30px;
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
}

.results-title {
  font-size: 1.4rem;
  color: var(--accent-cyan);
  margin-bottom: 20px;
  font-weight: 700;
  letter-spacing: 1px;
}

.results-title .accent-cyan {
  color: var(--accent-cyan);
}

.result-block {
  margin-bottom: 25px;
  padding-left: 15px;
  border-left: 1px dashed var(--text-secondary);
}

.scenario-title {
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 10px;
  text-decoration: underline;
  text-decoration-color: var(--accent-cyan);
}

.result-block p {
  margin-bottom: 8px;
  font-size: 0.95rem;
  color: var(--text-primary);
  opacity: 0.9;
}

.result-block p .prompt-char {
  color: var(--accent-cyan);
  margin-right: 8px;
}

.result-block p .bold-text {
  font-weight: 700;
  color: var(--text-primary);
  opacity: 0.95;
}

.pass-fail {
  font-style: italic;
  color: var(--text-secondary);
}

/* Terminal Footer */
.terminal-footer {
  padding: 10px 25px;
  background-color: #000000;
  border-top: 1px solid var(--border-color);
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

/* Animations */
@keyframes blink {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .terminal-container {
    width: 95%;
    margin: 20px auto;
  }
  .main-title {
    font-size: 2rem;
  }
  .input-section {
    flex-direction: column;
    align-items: flex-start;
  }
  .prompt-label {
    margin-bottom: 5px;
  }
  .input-field {
    width: 100%;
  }
  .terminal-body {
    padding: 15px;
  }
}

/* Specific styles for buttons and inputs to match terminal */
button, input {
  font-family: 'Fira Code', monospace !important; /* Enforce monospace */
}
```
--- END ---