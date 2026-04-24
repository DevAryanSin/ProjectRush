import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HiringLens',
  description: 'AI-powered bias detection for job descriptions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
