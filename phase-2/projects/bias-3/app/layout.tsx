import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ModelCard',
  description: 'AI-powered bias-aware model card generator',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
