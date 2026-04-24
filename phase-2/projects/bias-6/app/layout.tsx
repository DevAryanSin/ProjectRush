import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RedTeamAI',
  description: 'Adversarial bias attack scenarios for AI systems',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
