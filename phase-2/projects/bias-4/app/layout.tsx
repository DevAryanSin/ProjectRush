import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CounterfactualAI',
  description: 'Input an automated decision — generate counterfactual fairness test cases',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
