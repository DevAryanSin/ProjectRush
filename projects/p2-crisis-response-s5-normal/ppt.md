# Brief
The `IncidentLog` tool provides hospitality operations with a crucial system for streamlining crisis response by instantly converting raw incident notes into structured, official reports. It directly addresses the critical need for rapid, coordinated information sharing during high-stakes emergencies, ensuring all relevant parties have access to clear, categorized incident data to protect lives and property.

# Opportunities
## Differentiation
The solution offers a unique AI-driven approach to standardizing incident reporting, moving beyond manual or template-based systems. By automatically extracting and formatting critical details from free-text input, it provides a significant efficiency and accuracy advantage in high-stress, time-sensitive situations.
## Problem Solving Approach
It tackles fragmented communication and slow information dissemination during crises by establishing a single, reliable point for incident reporting. By automating report generation, the system reduces human error, speeds up communication flows, and ensures compliance with industry standards, thereby enhancing safety and operational resilience.
## USP
The unique selling proposition is the instant, AI-powered transformation of unstructured field notes into comprehensive, professionally formatted incident reports, specifically tailored for hospitality emergency management. It acts as an intelligent communication hub, ensuring no critical detail is missed and all stakeholders receive standardized, actionable information.

# Features
- **Plain-Language Input:** Users can describe incidents naturally without needing to navigate complex forms or predefined categories.
- **AI-Powered Report Generation:** Gemini AI extracts key facts, categorizes the incident, and generates a structured, official report.
- **Standardized Output:** Reports adhere to hospitality industry standards, including sections for timestamp, location, parties involved, narrative, immediate actions, and required follow-up.
- **Missing Information Flagging:** The AI identifies and flags any critical details that are absent from the user's initial description.
- **Professional UI:** A clean, intuitive, and responsive interface designed for rapid and reliable use during emergency scenarios.

# Technologies
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Icons:** Lucide React
- **AI Integration:** Google Gemini-2.5-flash API

Constraints:
- No additional npm packages beyond next, react, react-dom, lucide-react, tailwindcss.
- Gemini API key strictly server-side (environment variable).
- Strict output format for generated code files.
- `suppressHydrationWarning` must be used for dynamic `disabled` attributes to prevent hydration errors.

--- FILE: app/page.tsx ---
'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Siren } from 'lucide-react';

interface ReportSection {
  title: string;
  content: string;
}

export default function IncidentLogPage() {
  const [incidentDescription, setIncidentDescription] = useState('');
  const [report, setReport] = useState<ReportSection[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseReport = (rawReport: string): ReportSection[] => {
    const sections: ReportSection[] = [];
    const sectionTitles = [
      "Incident Reference:", "Date/Time:", "Location:", "Incident Type:",
      "Parties Involved:", "Narrative Description:", "Immediate Actions Taken:",
      "Follow-Up Required:", "Reporting Officer:", "Missing Information:"
    ];

    let currentSectionTitle = "";
    let currentSectionContent = "";

    const lines = rawReport.split('\n');
    lines.forEach(line => {
      let foundTitle = false;
      for (const title of sectionTitles) {
        if (line.startsWith(title)) {
          // If we have content for a previous section, save it
          if (currentSectionTitle && currentSectionContent.trim()) {
            sections.push({ title: currentSectionTitle, content: currentSectionContent.trim() });
          }
          currentSectionTitle = title.replace(':', '').trim();
          currentSectionContent = line.substring(title.length).trim();
          foundTitle = true;
          break;
        }
      }
      if (!foundTitle && currentSectionTitle) {
        // Append to current section content
        currentSectionContent += '\n' + line.trim();
      }
    });

    // Save the last section
    if (currentSectionTitle && currentSectionContent.trim()) {
      sections.push({ title: currentSectionTitle, content: currentSectionContent.trim() });
    }

    return sections;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setReport(null);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: incidentDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report.');
      }

      const data = await response.json();
      setReport(parseReport(data.result));
    } catch (err: any) {
      console.error('API call failed:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-alt text-text-default flex flex-col items-center py-8">
      <header className="w-full max-w-4xl px-4 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Siren className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-heading text-text-default">IncidentLog</h1>
        </div>
        <nav>
          {/* Optional nav links can go here */}
        </nav>
      </header>

      <main className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-sm border border-border-color rounded-md">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-text-default">Report a New Incident</CardTitle>
            <CardDescription className="text-text-muted">
              Describe what happened in plain language to get a formatted official incident report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                placeholder="Example: At 3:15 PM, a guest, Mr. John Doe from room 201, slipped on a wet floor near the lobby entrance. He complained of ankle pain. Staff member Sarah L. immediately assisted him and called for medical attention. The area was cordoned off and cleaned. Security footage captured the incident."
                rows={10}
                className="w-full p-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-body text-text-default"
              />
              <Button
                type="submit"
                className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center space-x-2"
                disabled={isLoading || incidentDescription.trim() === ''}
                suppressHydrationWarning
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Incident Report
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border-color rounded-md">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-text-default">Official Incident Report</CardTitle>
            <CardDescription className="text-text-muted">
              Structured report generated by AI, ready for official documentation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-48 text-primary animate-pulse">
                <Loader2 className="h-8 w-8 mr-2" />
                <span className="text-lg">Analyzing incident...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative text-sm">
                <strong className="font-bold">Error:</strong> <span className="block sm:inline">{error}</span>
                <p className="mt-1">Please try refining your description or check your network connection.</p>
              </div>
            )}

            {report && report.length > 0 && (
              <div className="space-y-6">
                {report.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold font-heading text-text-default mb-1">{section.title}:</h3>
                    <p className="whitespace-pre-wrap text-text-default leading-relaxed text-sm">{section.content}</p>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && !report && (
              <div className="text-center text-text-muted h-48 flex items-center justify-center border border-dashed border-border-color rounded-md">
                <p>Your generated report will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="w-full max-w-4xl px-4 mt-12 py-4 border-t border-border-color text-center text-text-muted text-sm">
        <p>&copy; {new Date().getFullYear()} IncidentLog. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
}
--- FILE: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function POST(req: NextRequest) {
  try {
    const { prompt: userPrompt } = await req.json();

    if (!userPrompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const fullGeminiPrompt = `You are an incident documentation AI for hospitality operations. Convert this plain-language incident description into a formal incident report with these sections: Incident Reference, Date/Time, Location, Incident Type, Parties Involved, Narrative Description, Immediate Actions Taken, Follow-Up Required, Reporting Officer. Note any missing information that should be obtained.\n\nIncident Description: "${userPrompt}"`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullGeminiPrompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to get response from Gemini API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const geminiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!geminiResponseText) {
      return NextResponse.json({ error: 'No content received from Gemini API' }, { status: 500 });
    }

    return NextResponse.json({ result: geminiResponseText });
  } catch (error: any) {
    console.error('Server-side error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
--- FILE: app/globals.css ---
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #dc2626; /* Tailwind red-600: Urgent Red */
  --primary-dark: #b91c1c; /* Tailwind red-700: Darker Red for hover */
  --background: #ffffff; /* Cool White */
  --background-alt: #f8f9fa; /* Light Grey background for page */
  --text-default: #1f2937; /* Dark Grey for most text (Tailwind gray-800) */
  --text-muted: #6b7280; /* Medium Grey for descriptions (Tailwind gray-500) */
  --border-color: #e2e8f0; /* Light border grey (Tailwind gray-200) */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --radius: 0.25rem; /* 4px border radius */

  /* Font variables */
  --font-body: 'Inter', sans-serif;
  --font-heading: 'DM Sans', sans-serif;
}

body {
  font-family: var(--font-body);
  color: var(--text-default);
  background-color: var(--background-alt);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

.shadow-sm {
  box-shadow: var(--shadow-sm);
}

.rounded-md {
  border-radius: var(--radius);
}

/* Custom Tailwind components to apply CSS variables */
.btn-primary {
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius);
  transition: background-color 0.2s ease-in-out;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.card {
  background-color: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.input, .textarea {
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-default);
  background-color: var(--background);
}

.input:focus, .textarea:focus {
  outline: none;
  border-color: var(--primary); /* Use primary color for focus ring */
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2); /* Custom focus ring */
}

/* Using arbitrary values with Tailwind config for dynamic classes */
/* If `tailwind.config.js` were editable, we'd add these to `theme.extend` */
/* For this exercise, direct usage with CSS variables in component/globals */

/* Custom components based on Radix UI styled with Tailwind in Next.js */
/* Button, Card, Textarea are directly from custom components in the thought process
   and are expected to apply styles via `className` or a local CSS approach.
   For this generation, I'll rely on direct Tailwind classes and global variables. */

/* Basic utility classes if not directly provided by Tailwind config */
.text-primary {
  color: var(--primary);
}
.bg-primary {
  background-color: var(--primary);
}
.hover\:bg-primary-dark:hover {
  background-color: var(--primary-dark);
}
.text-background-alt {
  color: var(--background-alt);
}
.bg-background-alt {
  background-color: var(--background-alt);
}
.text-text-default {
  color: var(--text-default);
}
.text-text-muted {
  color: var(--text-muted);
}
.border-border-color {
  border-color: var(--border-color);
}
.focus\:ring-primary:focus {
  --tw-ring-color: var(--primary);
}
.font-body {
  font-family: var(--font-body);
}
.font-heading {
  font-family: var(--font-heading);
}
--- END ---