# Brief
LicenseGen automates the generation of bespoke digital media license agreements, addressing the critical need for IP protection in the sports industry. It simplifies the process for organizations to define and enforce terms for their valuable content, safeguarding against unauthorized use and misappropriation.

# Opportunities
- Differentiation: Offers a specialized, AI-driven solution for a niche but high-value market (sports digital media IP).
- Problem Solving Approach: Directly tackles the visibility gap and IP vulnerability of scattered digital assets.
- USP: Instant generation of legally structured, customizable license agreements with a user-friendly, engaging interface.

# Features
- Intuitive input form for defining license parameters (asset type, usage rights, territory, etc.).
- AI-powered license generation via Gemini API.
- Dynamic display of generated license agreements with clear section hierarchy.
- Real-time loading and error handling states for a seamless user experience.
- Responsive Claymorphism UI design for a modern, approachable feel.
- Browser tab and page title set to "LicenseGen".

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini API (gemini-2.5-flash)
- Lucide React for icons
- Google Fonts (Nunito, Fredoka One)

Constraints:
- No markdown like ** or ##
- No code
- Clean bullet points only
- Keep concise
--- FILE: app/page.tsx ---
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image'; // Although not used directly in this MVP, good practice for Next.js

// Placeholder for icons if needed later, currently using text for simplicity
// import { Loader2 } from 'lucide-react';

const initialState = {
  assetType: '',
  permittedUses: '',
  prohibitedUses: '',
  attributionRequirements: '',
  commercialTerms: '',
  territory: '',
};

const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const formFieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [formData, setFormData] = useState(initialState);
  const [generatedLicense, setGeneratedLicense] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedLicense('');

    const prompt = `
      Generate a content license agreement for the following asset details:
      Asset Type: ${formData.assetType}
      Permitted Uses: ${formData.permittedUses}
      Prohibited Uses: ${formData.prohibitedUses}
      Attribution Requirements: ${formData.attributionRequirements}
      Commercial Terms: ${formData.commercialTerms}
      Territory: ${formData.territory}

      Draft a complete content license agreement for this asset with these sections: Grant of License, Permitted Uses, Prohibited Uses, Attribution Requirements, Commercial Terms, Territory, Term and Termination, Warranties, Governing Law. Use precise legal language appropriate for digital media licensing.
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
        throw new Error(errorData.error || 'Failed to generate license. Please try again.');
      }

      const data = await response.json();
      setGeneratedLicense(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error('Generation Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Attempt to parse the generated license for better display
  const parseLicense = (licenseText: string) => {
    if (!licenseText) return null;

    const sections: { [key: string]: string } = {};
    const sectionRegex = /(Grant of License|Permitted Uses|Prohibited Uses|Attribution Requirements|Commercial Terms|Territory|Term and Termination|Warranties|Governing Law)\s*:\s*/g;
    let lastIndex = 0;
    let match;
    let currentSection = 'Introduction'; // For any text before the first official section

    while ((match = sectionRegex.exec(licenseText)) !== null) {
      const sectionTitle = match[1];
      const sectionStart = match.index;

      // Store the content of the previous section
      if (currentSection && sectionStart > lastIndex) {
        sections[currentSection] = licenseText.substring(lastIndex, sectionStart).trim();
      }

      currentSection = sectionTitle;
      lastIndex = sectionRegex.lastIndex;
    }

    // Add the last section
    if (currentSection && lastIndex < licenseText.length) {
      sections[currentSection] = licenseText.substring(lastIndex).trim();
    }

    // Add any remaining text that wasn't captured as a specific section if needed, or handle it as part of the last section.
    // For this example, we assume the prompt ensures all standard sections are present.

    return sections;
  };

  const parsedLicense = parseLicense(generatedLicense);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-2 drop-shadow-lg">LicenseGen</h1>
        <p className="text-lg md:text-xl text-purple-600 font-semibold">
          Input your asset details — get a custom license agreement generated instantly
        </p>
      </div>

      <motion.div
        className="w-full max-w-3xl bg-white rounded-3xl p-8 shadow-claymorphism-lg flex flex-col items-center space-y-6"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold text-purple-700">Create Your License</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <motion.div variants={formFieldVariants} className="flex flex-col space-y-2">
            <label htmlFor="assetType" className="text-lg font-medium text-gray-700">Asset Type</label>
            <input
              type="text"
              id="assetType"
              name="assetType"
              value={formData.assetType}
              onChange={handleChange}
              required
              className="p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 shadow-inner-clay focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-gray-700"
              placeholder="e.g., Official Game Footage, Player Photo"
            />
          </motion.div>

          <motion.div variants={formFieldVariants} className="flex flex-col space-y-2">
            <label htmlFor="permittedUses" className="text-lg font-medium text-gray-700">Permitted Uses</label>
            <textarea
              id="permittedUses"
              name="permittedUses"
              value={formData.permittedUses}
              onChange={handleChange}
              required
              rows={3}
              className="p-4 rounded-2xl border-2 border-mint-300 focus:border-mint-500 shadow-inner-clay focus:outline-none focus:ring-2 focus:ring-mint-500 transition-all duration-300 text-gray-700 resize-none"
              placeholder="e.g., Non-commercial social media sharing, Editorial use in news articles"
            ></textarea>
          </motion.div>

          <motion.div variants={formFieldVariants} className="flex flex-col space-y-2">
            <label htmlFor="prohibitedUses" className="text-lg font-medium text-gray-700">Prohibited Uses</label>
            <textarea
              id="prohibitedUses"
              name="prohibitedUses"
              value={formData.prohibitedUses}
              onChange={handleChange}
              required
              rows={3}
              className="p-4 rounded-2xl border-2 border-red-300 focus:border-red-500 shadow-inner-clay focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 text-gray-700 resize-none"
              placeholder="e.g., Commercial advertising, Resale, Alteration without permission"
            ></textarea>
          </motion.div>

          <motion.div variants={formFieldVariants} className="flex flex-col space-y-2">
            <label htmlFor="attributionRequirements" className="text-lg font-medium text-gray-700">Attribution Requirements</label>
            <input
              type="text"
              id="attributionRequirements"
              name="attributionRequirements"
              value={formData.attributionRequirements}
              onChange={handleChange}
              required
              className="p-4 rounded-2xl border-2 border-yellow-300 focus:border-yellow-500 shadow-inner-clay focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 text-gray-700"
              placeholder="e.g., 'Photo by [Photographer Name] | Licensed by LicenseGen'"
            />
          </motion.div>

          <motion.div variants={formFieldVariants} className="flex flex-col space-y-2">
            <label htmlFor="commercialTerms" className="text-lg font-medium text-gray-700">Commercial Terms</label>
            <textarea
              id="commercialTerms"
              name="commercialTerms"
              value={formData.commercialTerms}
              onChange={handleChange}
              required
              rows={2}
              className="p-4 rounded-2xl border-2 border-green-300 focus:border-green-500 shadow-inner-clay focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-gray-700 resize-none"
              placeholder="e.g., Royalty-free for agreed uses, Flat fee per use"
            ></textarea>
          </motion.div>

          <motion.div variants={formFieldVariants} className="flex flex-col space-y-2">
            <label htmlFor="territory" className="text-lg font-medium text-gray-700">Territory</label>
            <input
              type="text"
              id="territory"
              name="territory"
              value={formData.territory}
              onChange={handleChange}
              required
              className="p-4 rounded-2xl border-2 border-indigo-300 focus:border-indigo-500 shadow-inner-clay focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-700"
              placeholder="e.g., Worldwide, North America, European Union"
            />
          </motion.div>

          <motion.div variants={formFieldVariants} className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-4 rounded-full text-xl font-bold transition-all duration-300
                ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed shadow-inner-clay-disabled'
                  : 'bg-accent-500 hover:bg-accent-600 shadow-clay-button text-white'
                }
                flex items-center space-x-2`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate License</span>
              )}
            </button>
          </motion.div>
        </form>

        {error && (
          <motion.div variants={formFieldVariants} className="w-full p-5 bg-red-100 border-2 border-red-400 rounded-2xl text-red-800 text-center">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </motion.div>
        )}

        {generatedLicense && !isLoading && parsedLicense && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full p-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-3xl shadow-clay-lg"
          >
            <h3 className="text-3xl font-bold text-green-800 mb-6 text-center">Your License Agreement</h3>
            {Object.entries(parsedLicense).map(([sectionTitle, sectionContent], index) => (
              <motion.div key={index} variants={formFieldVariants} className="mb-6 last:mb-0">
                <h4 className="text-2xl font-semibold text-green-700 mb-3 border-b-2 border-green-300 pb-2">{sectionTitle}</h4>
                <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: sectionContent.replace(/\n/g, '<br />') }} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Styles for prose if needed for rich text rendering (optional)
// Add this to globals.css if you plan to use markdown or rich text within the generated content display
/*
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}
.prose h1, .prose h2 { font-size: 2rem; }
.prose h3 { font-size: 1.75rem; }
.prose h4 { font-size: 1.5rem; }
.prose p {
  margin-top: 0;
  margin-bottom: 1rem;
}
.prose strong { font-weight: 600; }
*/
--- FILE: app/api/generate/route.ts ---
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Ensure you have your GEMINI_API_KEY set in your environment variables
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
  // In a real app, you might want to handle this more gracefully,
  // like returning an error response or stopping the server startup.
}

const genAI = new GoogleGenerativeAI(API_KEY!);

export async function POST(request: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: "Server configuration error: Gemini API key not provided." }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // The system prompt for the AI
    const systemPrompt = `You are an IP licensing AI. Draft a complete content license agreement for this asset with these sections: Grant of License, Permitted Uses, Prohibited Uses, Attribution Requirements, Commercial Terms, Territory, Term and Termination, Warranties, Governing Law. Use precise legal language appropriate for digital media licensing.`;

    // Combine system prompt with user's prompt
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    // Log detailed error information
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", await error.response.text());
    }
    return NextResponse.json({ error: error.message || "An error occurred while generating the license." }, { status: error.status || 500 });
  }
}
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&family=Varela+Round&display=swap');

:root {
  /* Claymorphism Palette */
  --color-primary-light: #e0e7ff; /* Soft lavender */
  --color-primary-medium: #c7d2fe;
  --color-primary-dark: #a5b4fc; /* Slightly deeper lavender */

  --color-secondary-light: #d1fae5; /* Soft mint */
  --color-secondary-medium: #a7f3d0;
  --color-secondary-dark: #6ee7b7; /* Brighter mint accent */

  --color-accent-default: #8b5cf6; /* A vibrant accent, e.g., purple */
  --color-accent-hover: #7c3aed;

  --color-background-default: #f8fafc; /* Very light, almost white */
  --color-text-default: #374151; /* Dark gray for text */
  --color-text-muted: #6b7280; /* Muted gray */

  /* Shadowing for Claymorphism */
  --shadow-clay-card: 0 20px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08);
  --shadow-clay-card-lg: 0 25px 70px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.10);
  --shadow-clay-button: 0 10px 30px rgba(0,0,0,0.10), 0 5px 15px rgba(0,0,0,0.08);
  --shadow-inner-clay: inset 0 4px 10px rgba(0,0,0,0.05);
  --shadow-inner-clay-light: inset 0 2px 6px rgba(0,0,0,0.04);
  --shadow-clay-disabled: inset 0 2px 5px rgba(0,0,0,0.1);

  --border-radius-card: 28px;
  --border-radius-input: 18px;
  --border-radius-button: 50px; /* Pill shape */
}

body {
  background-color: var(--color-background-default);
  font-family: 'Nunito', sans-serif;
  color: var(--color-text-default);
  line-height: 1.6;
}

/* Base Claymorphism Card Style */
.bg-claymorphism-card {
  background-color: white; /* Base color */
  border-radius: var(--border-radius-card);
  box-shadow: var(--shadow-clay-card);
  /* Subtle gradient for inflation effect */
  background-image: linear-gradient(to bottom, #ffffff, #f4f4f8);
}

.shadow-claymorphism-lg {
  box-shadow: var(--shadow-clay-card-lg);
}

.shadow-clay-button {
  box-shadow: var(--shadow-clay-button);
}

.shadow-inner-clay {
  box-shadow: var(--shadow-inner-clay);
}

.shadow-inner-clay-light {
  box-shadow: var(--shadow-inner-clay-light);
}

.shadow-clay-disabled {
  box-shadow: var(--shadow-clay-disabled);
}

input[type="text"],
textarea {
  border-radius: var(--border-radius-input);
  border: 2px solid var(--color-primary-medium); /* Default border */
  padding: 1rem 1.25rem; /* Generous padding */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-size: 1rem;
  color: var(--color-text-default);
}

textarea {
  min-height: 80px; /* Default minimum height for textareas */
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-accent-default); /* Highlight on focus */
  box-shadow: var(--shadow-inner-clay-light), 0 0 0 3px rgba(139, 92, 246, 0.3); /* Inner clay + focus ring */
}

/* Accent Color Utility */
.bg-accent-default { background-color: var(--color-accent-default); }
.hover\:bg-accent-hover:hover { background-color: var(--color-accent-hover); }

/* Specific Field Colors */
#assetType:focus ~ *,
#assetType { border-color: var(--color-primary-dark); }
#assetType:focus { border-color: var(--color-accent-default); box-shadow: var(--shadow-inner-clay-light), 0 0 0 3px rgba(139, 92, 246, 0.3); } /* Accent focus */

#permittedUses:focus ~ *,
#permittedUses { border-color: var(--color-secondary-medium); }
#permittedUses:focus { border-color: var(--color-secondary-dark); box-shadow: var(--shadow-inner-clay-light), 0 0 0 3px rgba(103, 232, 249, 0.3); } /* Mint focus */

#prohibitedUses:focus ~ *,
#prohibitedUses { border-color: #fca5a5; } /* Light Red */
#prohibitedUses:focus { border-color: #ef4444; box-shadow: var(--shadow-inner-clay-light), 0 0 0 3px rgba(239, 68, 68, 0.3); } /* Red focus */

#attributionRequirements:focus ~ *,
#attributionRequirements { border-color: #fcd34d; } /* Light Yellow */
#attributionRequirements:focus { border-color: #eab308; box-shadow: var(--shadow-inner-clay-light), 0 0 0 3px rgba(234, 179, 8, 0.3); } /* Yellow focus */

#commercialTerms:focus ~ *,
#commercialTerms { border-color: #a7f3d0; } /* Mint */
#commercialTerms:focus { border-color: var(--color-secondary-dark); box-shadow: var(--shadow-inner-clay-light), 0 0 0 3px rgba(8, 145, 178, 0.3); } /* Darker Mint focus */

#territory:focus ~ *,
#territory { border-color: #a5b4fc; } /* Lavender */
#territory:focus { border-color: var(--color-primary-dark); box-shadow: var(--shadow-inner-clay-light), 0 0 0 3px rgba(137, 196, 244, 0.3); } /* Darker Lavender focus */


/* Headings */
h1 {
  font-family: 'Fredoka One', cursive; /* Display font */
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

h2 {
  font-size: 2.5rem;
  font-weight: 700;
}

h3 {
  font-size: 2rem;
  font-weight: 700;
}

h4 {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  h1 {
    font-size: 2.75rem;
  }
  h2 {
    font-size: 2rem;
  }
  .bg-claymorphism-card {
    padding: 1.5rem;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 2.25rem;
  }
  .bg-claymorphism-card {
    padding: 1rem;
  }
  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

/* Pro dark mode styles if needed, but sticking to claymorphism's light pastel theme */
/* Using Tailwind's 'prose' class for any potentially generated HTML content */
.prose {
  color: var(--color-text-default);
}
.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  color: var(--color-primary-dark); /* Example heading color */
  font-weight: 700;
}
.prose p {
  margin-bottom: 1rem;
}
.prose strong {
  font-weight: 700;
}
--- END ---