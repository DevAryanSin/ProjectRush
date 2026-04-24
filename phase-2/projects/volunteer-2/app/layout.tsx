import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'volunteerbio',
  description: 'AI-powered MVP — Hackathon Factory Phase 2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
