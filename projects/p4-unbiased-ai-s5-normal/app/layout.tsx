import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FixItFlow | AI Bias Detection & Mitigation',
  description: 'A professional platform for analyzing biased AI outcomes and generating concrete debiasing action plans to ensure algorithmic fairness.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
