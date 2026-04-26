# Brief
GrantWriter is a web-based tool that leverages AI to generate persuasive grant application paragraphs for NGOs. It simplifies the fundraising process by converting user-provided details into a structured, funder-ready narrative.

# Opportunities
## Differentiation
Provides an AI-powered solution specifically for grant writing, directly addressing a critical operational need for NGOs. Its Brutalist UI ensures immediate attention and memorability.

## Problem Solving Approach
Collects key organizational data through a structured form. Utilizes the Gemini API with a specialized prompt to craft a comprehensive grant paragraph following established grant writing principles. Presents the output in a clear, organized manner.

## USP
Automated generation of compelling grant application paragraphs powered by Gemini AI, combined with a distinctive and attention-grabbing Brutalist user interface.

# Features
- **AI-Powered Grant Paragraph Generation:** Auto-drafts problem statements, solutions, impact projections, and budget justifications.
- **Brutalist UI:** Bold typography, thick borders, high contrast, and intentional asymmetry for a unique user experience.
- **Responsive Design:** Fully functional and visually consistent across desktop and mobile devices.
- **Loading & Error States:** Clear visual indicators for submission progress and user-friendly error messaging.
- **Structured Output:** Parses and displays AI-generated text with visual hierarchy for readability.

# Technologies
- **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend/API:** Next.js API Route (`app/api/generate/route.ts`)
- **AI Integration:** Gemini API (`gemini-2.5-flash`)
- **Icons:** Lucide React
- **Styling:** Custom CSS variables, Brutalism design principles
- **Deployment Domain:** `grantwriter-sc`
- **Node.js:** 24.x