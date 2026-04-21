import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IncidentLog | Official Crisis Coordination',
  description: 'AI-driven incident reporting system for professional hospitality operations.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
