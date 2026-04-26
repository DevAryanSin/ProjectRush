# Brief
PostMortemPro is a web application that streamlines hospitality crisis response by automatically generating detailed incident post-mortem reports. It acts as a central hub for incident information, transforming raw input into actionable insights for future prevention.

# Opportunities
- Differentiation: Specializes in the hospitality sector's unique emergency needs.
- Problem Solving Approach: Automates the complex and time-consuming post-mortem report generation process.
- USP: Provides a structured, actionable post-mortem report using AI, ensuring consistent quality and detail.

# Features
- Crisis Incident Reporting: User-friendly form to capture incident details.
- AI-Powered Report Generation: Automatically creates structured post-mortem reports using Gemini API.
- Structured Output: Reports include Executive Summary, Timeline, Root Cause Analysis, What Worked, What Failed, and Prevention Plan.
- Paper/Editorial UI Style: Clean, readable, and trustworthy interface with serif fonts and a muted color scheme.
- Loading and Error Handling: Provides clear user feedback during report generation and for errors.
- Responsive Design: Ensures usability across all devices.

# Technologies
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini API (gemini-2.5-flash)
- Lucide React (Icons)

Constraints:
- Next.js 16, App Router
- TypeScript
- Tailwind CSS + custom CSS variables
- Lucide React icons only
- No extra npm packages beyond next, react, react-dom, lucide-react, tailwindcss
- Gemini API server-side only
- Client-side fetch to API route
- Strict 'Paper/Editorial' UI style (serif fonts, specific color palette, column-based layout)
- No sans-serif fonts for content
- No gradients, rounded cards, or bright colors