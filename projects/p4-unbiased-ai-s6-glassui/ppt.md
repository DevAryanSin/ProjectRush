# Brief
Computer programs are increasingly making life-altering decisions. If these systems are trained on flawed or unfair historical data, they will perpetuate and amplify existing biases, leading to discriminatory outcomes in areas like employment, finance, and healthcare. There is an urgent need for a clear, accessible solution that allows organizations to thoroughly inspect datasets and software models for hidden unfairness or discrimination.

# Opportunities
## Differentiation
EthicsCheck differentiates itself through its unique Glass UI styling, its direct mapping of compliance checks to specific, recognized global standards (EU AI Act, NIST AI RMF, IEEE 7010), and its integration of Gemini AI to generate context-aware, tailored ethics checklists. This positions it as a premium, analytically precise tool in the AI governance space.

## Problem Solving Approach
The tool addresses the problem by empowering users to provide a comprehensive description of their AI system, including its purpose, data, decisions, and affected populations. Gemini AI then processes this information to dynamically generate a compliance checklist, assessing each item's status (LIKELY COMPLIANT / NEEDS REVIEW / LIKELY NON-COMPLIANT) and highlighting critical risk gaps. This proactive and structured approach enables organizations to identify and rectify ethical issues before deployment.

## USP
"Describe your AI system — get an ethics compliance checklist mapped to real standards." EthicsCheck offers an unparalleled, AI-driven capability to instantly audit AI systems against global ethical guidelines, providing actionable insights for fairness and accountability.

# Features
- Intuitive Glass UI for describing AI system purpose, data, decisions, and impact.
- AI-powered generation of a tailored ethics compliance checklist using Gemini (`gemini-2.5-flash`).
- Compliance checks mapped to EU AI Act, NIST AI Risk Management Framework, and IEEE 7010.
- Clear status indicators for each checklist item: LIKELY COMPLIANT, NEEDS REVIEW, LIKELY NON-COMPLIANT.
- Identification and highlighting of the top 3 highest-risk compliance gaps.
- Responsive design for seamless use across desktop and mobile devices.
- Robust loading and error state handling for a smooth user experience.

# Technologies
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom CSS variables (Glass UI)
- **Icons:** lucide-react
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`) via server-side route