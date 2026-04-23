# Brief
The FairnessAudit tool addresses the critical need for detecting and rectifying bias in AI systems that make life-changing decisions. It provides a clear, accessible platform for organizations to scrutinize their machine learning models and datasets for hidden unfairness, ensuring ethical and equitable AI deployment.

# Opportunities
## Differentiation
This tool distinguishes itself through its intuitive Glassmorphism UI, making complex AI ethics accessible and engaging. Leveraging Gemini AI for deep, comprehensive audits provides a powerful, intelligent backend, delivering nuanced reports beyond basic statistical checks.
## Problem Solving Approach
The approach is proactive and preventive. By allowing comprehensive auditing *before* deployment, it helps organizations prevent discriminatory outcomes, maintain trust, and adhere to ethical AI standards, rather than reactively addressing issues post-impact.
## USP
The unique selling proposition is the combination of an aesthetically pleasing and highly functional Glassmorphism interface with the powerful, intelligent auditing capabilities of Gemini AI, offering a comprehensive and user-friendly solution for algorithmic accountability.

# Features
- **Intuitive Input Form:** Users easily describe ML model purpose, training data, features, decision types, and deployment context.
- **AI-Powered Fairness Audit:** Utilizes Gemini AI to generate detailed reports on disparate impact, proxy discrimination, fairness metrics, and remediation priorities.
- **Structured Report Display:** Presents audit findings in a clear, visually hierarchical format across multiple, layered glass panels.
- **Glassmorphism UI:** Features a modern, translucent design with rich gradients, blur effects, and ethereal floating elements for a premium user experience.
- **Responsive Design:** Ensures optimal usability and aesthetic consistency across all devices (mobile, tablet, desktop).

# Technologies
- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS (for Glassmorphism effects)
- **Icons:** Lucide-React
- **AI Integration:** Google Gemini 2.5 Flash API (server-side via Next.js API route)

Constraints:
- No fluff
- No repetition
- Keep concise
- Bullet points where appropriate

--- FILE: app/page.tsx ---
'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface AuditReport {
  disparateImpact: string;
  proxyDiscrimination: string;
  fairnessMetrics: string;
  remediationPriorities: string;
}

export default function Home() {
  const [modelPurpose, setModelPurpose] = useState('');
  const [trainingDataSources, setTrainingDataSources] = useState('');
  const [inputFeatures, setInputFeatures] = useState('');
  const [outputDecisionType, setOutputDecisionType] = useState('');
  const [deploymentContext, setDeploymentContext] = useState('');
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = modelPurpose && trainingDataSources && inputFeatures && outputDecisionType && deploymentContext;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please fill in all fields to conduct the audit.');
      return;
    }

    setIsLoading(true);
    setAuditReport(null);
    setError(null);

    const fullPrompt = `You are an AI fairness auditor. Conduct a fairness audit of this ML model. Your report should cover: (1) Disparate impact risk assessment per protected group, (2) Proxy discrimination risks in listed features, (3) Recommended fairness metrics for this use case (e.g., equalized odds, demographic parity), (4) Top 5 remediation priorities ordered by urgency. Reference real AI fairness standards where applicable.

    Model Purpose: ${modelPurpose}
    Training Data Sources: ${trainingDataSources}
    Input Features Used: ${inputFeatures}
    Output Decision Type: ${outputDecisionType}
    Deployment Context: ${deploymentContext}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch audit report.');
      }

      const data = await response.json();
      const rawReport = data.result;

      // Parse the structured report from Gemini
      const parsedReport: AuditReport = {
        disparateImpact: '',
        proxyDiscrimination: '',
        fairnessMetrics: '',
        remediationPriorities: '',
      };

      const sections = rawReport.split(/\(\d\)\s*(.*?):\s*/g).filter(Boolean);

      for (let i = 0; i < sections.length; i += 2) {
        const header = sections[i].trim().toLowerCase();
        const content = sections[i + 1] ? sections[i + 1].trim() : '';

        if (header.includes('disparate impact risk assessment')) {
          parsedReport.disparateImpact = content;
        } else if (header.includes('proxy discrimination risks')) {
          parsedReport.proxyDiscrimination = content;
        } else if (header.includes('recommended fairness metrics')) {
          parsedReport.fairnessMetrics = content;
        } else if (header.includes('remediation priorities')) {
          parsedReport.remediationPriorities = content;
        }
      }

      setAuditReport(parsedReport);

    } catch (err: any) {
      console.error('Audit generation error:', err);
      setError(err.message || 'An unexpected error occurred during the audit.');
    } finally {
      setIsLoading(false);
    }
  }, [modelPurpose, trainingDataSources, inputFeatures, outputDecisionType, deploymentContext, isFormValid]);


  const GlassInput = ({ id, label, value, onChange, placeholder, rows = 3 }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    rows?: number;
  }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold text-white mb-2">{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="glass-input w-full p-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 resize-y min-h-[80px]"
        disabled={isLoading}
        suppressHydrationWarning
      />
    </div>
  );

  const GlassPanel = ({ title, content, icon }: { title: string; content: string | React.ReactNode; icon: React.ReactNode }) => (
    <div className="glass-card p-6 mb-6 animate-fadeInSlideUp">
      <h3 className="text-xl font-poppins text-purple-200 mb-3 flex items-center">
        {icon} <span className="ml-2">{title}</span>
      </h3>
      <p className="text-white text-sm leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="gradient-orb orb-1 top-20 left-10 animate-pulse-slow"></div>
      <div className="gradient-orb orb-2 bottom-0 right-[-100px] animate-pulse-slow delay-200"></div>
      <div className="gradient-orb orb-3 top-[-50px] right-20 animate-pulse-slow delay-400"></div>

      <div className="relative z-10 w-full max-w-2xl text-white">
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-center mb-6 drop-shadow-lg animate-fadeInSlideUp">
          <span className="text-purple-300">Fairness</span>Audit
        </h1>
        <p className="text-center text-lg mb-8 text-gray-200 animate-fadeInSlideUp delay-100">
          Describe your ML model to receive a comprehensive fairness audit report.
        </p>

        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 mb-8 animate-fadeInSlideUp delay-200">
          <h2 className="text-2xl font-poppins font-semibold text-purple-200 mb-6 border-b border-purple-800 pb-3">Model Description</h2>

          <GlassInput
            id="modelPurpose"
            label="Model Purpose"
            value={modelPurpose}
            onChange={(e) => setModelPurpose(e.target.value)}
            placeholder="e.g., Loan approval, job applicant screening, medical diagnosis assistance."
          />
          <GlassInput
            id="trainingDataSources"
            label="Training Data Sources"
            value={trainingDataSources}
            onChange={(e) => setTrainingDataSources(e.target.value)}
            placeholder="e.g., Historical loan applications (anonymized), public health records, internal hiring data."
          />
          <GlassInput
            id="inputFeatures"
            label="Input Features Used"
            value={inputFeatures}
            onChange={(e) => setInputFeatures(e.target.value)}
            placeholder="e.g., Age, income, zip code, credit score, education level, gender."
          />
          <GlassInput
            id="outputDecisionType"
            label="Output Decision Type"
            value={outputDecisionType}
            onChange={(e) => setOutputDecisionType(e.target.value)}
            placeholder="e.g., Binary (approved/denied), categorical (low/medium/high risk), numerical (score 1-100)."
          />
          <GlassInput
            id="deploymentContext"
            label="Deployment Context"
            value={deploymentContext}
            onChange={(e) => setDeploymentContext(e.target.value)}
            placeholder="e.g., Production system, internal review, public-facing application."
            rows={2}
          />

          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 p-3 rounded-lg text-red-300 flex items-center mb-4 animate-fadeIn">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full glass-button-gradient py-3 rounded-lg font-semibold text-lg flex items-center justify-center transition-all duration-300 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isFormValid}
            suppressHydrationWarning
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Auditing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2" /> Conduct Fairness Audit
              </>
            )}
          </button>
        </form>

        {auditReport && (
          <div className="audit-results mt-8">
            <h2 className="text-3xl font-poppins font-bold text-center text-purple-200 mb-6 drop-shadow-lg animate-fadeInSlideUp delay-300">
              Audit Report
            </h2>

            <GlassPanel
              title="Disparate Impact Risk Assessment"
              content={auditReport.disparateImpact || "N/A"}
              icon={<AlertCircle className="text-yellow-400" />}
            />
            <GlassPanel
              title="Proxy Discrimination Risks"
              content={auditReport.proxyDiscrimination || "N/A"}
              icon={<AlertCircle className="text-orange-400" />}
            />
            <GlassPanel
              title="Recommended Fairness Metrics"
              content={auditReport.fairnessMetrics || "N/A"}
              icon={<CheckCircle className="text-green-400" />}
            />
            <GlassPanel
              title="Top 5 Remediation Priorities"
              content={auditReport.remediationPriorities || "N/A"}
              icon={<Sparkles className="text-purple-400" />}
            />
          </div>
        )}
      </div>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: errorData.error?.message || 'Gemini API call failed' }, { status: response.status });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      return NextResponse.json({ error: 'No content received from Gemini API' }, { status: 500 });
    }

    return NextResponse.json({ result: resultText });

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected server error occurred' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Poppins:wght@600;700&display=swap');

:root {
  --background-gradient-start: #1a0033; /* Deep dark purple */
  --background-gradient-end: #0a001a; /* Even darker purple */
  --glass-bg-rgba: rgba(255, 255, 255, 0.08);
  --glass-border-rgba: rgba(255, 255, 255, 0.18);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --purple-orb-1: #6a05ad;
  --purple-orb-2: #8e2de2;
  --purple-orb-3: #4a007b;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  color: #fff; /* Default text color */
}

body {
  background: linear-gradient(135deg, var(--background-gradient-start) 0%, var(--background-gradient-end) 100%);
  background-attachment: fixed; /* Ensures gradient covers full scrollable height */
}

/* Custom Tailwind Fonts */
.font-inter {
  font-family: 'Inter', sans-serif;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

/* Glassmorphism Card Style */
.glass-card {
  background: var(--glass-bg-rgba);
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(18px); /* Adjust blur for desired effect */
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid var(--glass-border-rgba);
  animation: fadeInSlideUp 0.7s ease-out forwards;
}

/* Glassmorphism Input/Textarea Style */
.glass-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  transition: all 0.2s ease-in-out;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.5); /* Lighter white for placeholder */
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(147, 51, 234, 0.5); /* Purple focus border */
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.2);
}

/* Glassmorphism Button Style - Gradient Fill */
.glass-button-gradient {
  background: linear-gradient(90deg, #9333ea 0%, #a855f7 100%); /* Deep purple to lighter purple */
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  color: #fff;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.glass-button-gradient:hover {
  background: linear-gradient(90deg, #a855f7 0%, #c084fc 100%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

.glass-button-gradient:active {
  background: linear-gradient(90deg, #8b2ee0 0%, #9b4be1 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transform: translateY(1px);
}

.glass-button-gradient:disabled {
  background: linear-gradient(90deg, #5b21b6 0%, #7c3aed 100%); /* A bit darker when disabled */
  cursor: not-allowed;
  opacity: 0.6;
}

/* Floating Orbs */
.gradient-orb {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  z-index: 0;
}

.orb-1 {
  background-color: var(--purple-orb-1);
  animation: float 10s ease-in-out infinite alternate;
}

.orb-2 {
  background-color: var(--purple-orb-2);
  animation: float 12s ease-in-out infinite alternate-reverse;
}

.orb-3 {
  background-color: var(--purple-orb-3);
  animation: float 11s ease-in-out infinite alternate;
}


/* Animations */
@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 40px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.05); opacity: 0.6; }
}

@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInSlideUp {
  animation: fadeInSlideUp 0.7s ease-out forwards;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Utility to apply animation delays easily */
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }

/* Responsive Adjustments */
@media (max-width: 768px) {
  .glass-card {
    padding: 1.5rem; /* Smaller padding on mobile */
  }

  h1 {
    font-size: 2.5rem; /* Adjust title size */
  }
}

--- END ---