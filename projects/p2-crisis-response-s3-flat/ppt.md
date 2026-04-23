# Brief
Hospitality venues face high-stakes emergencies with fragmented communication hindering coordinated responses. Critical information is often siloed, leading to chaotic reactions. EvacuGuide provides a robust, AI-powered solution to instantly detect, report, and synchronize crisis response efforts, creating a reliable bridge between distressed individuals, active personnel, and emergency services.

# Opportunities
## Differentiation
EvacuGuide offers highly customized, AI-generated evacuation plans tailored to specific venue types, occupancy, and crisis scenarios, differentiating it from generic emergency protocols. Its focus on real-time, actionable intelligence streamlines crisis management.
## Problem Solving Approach
The application uses Gemini AI to synthesize user-defined venue parameters and crisis types into comprehensive, actionable evacuation plans. This approach eliminates manual plan creation, standardizes critical information flow, and ensures coordinated response efforts by providing clear roles, routes, and communication scripts.
## USP
Instant, AI-powered, venue-specific evacuation plan generation for hospitality, ensuring coordinated, reliable crisis response and minimizing risk and communication breakdown during critical incidents.

# Features
- User input form for venue type (hotel/restaurant/event hall), number of floors, estimated occupancy, and crisis type (fire/flood/security/medical mass casualty).
- AI-powered generation of detailed, venue-specific evacuation plans using Google Gemini-2.5-flash.
- Output includes primary and backup evacuation routes, staff role assignments, guest announcement scripts, and special needs guest protocols.
- Clear visual display of results with hierarchy, not just raw text.
- Visually clear loading states during AI processing.
- Professional, polished, and responsive Flat Design UI.
- Graceful error handling for API calls.

# Technologies
- Framework: Next.js 16 (App Router)
- Language: TypeScript (.tsx)
- Styling: Tailwind CSS + custom CSS variables
- Icons: lucide-react
- AI Integration: Google Gemini-2.5-flash API (`gemini-2.5-flash`)
- Node Engine: 24.x