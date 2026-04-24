import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HazardMap',
  description: 'AI-powered venue hazard analysis and safety coordination.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
