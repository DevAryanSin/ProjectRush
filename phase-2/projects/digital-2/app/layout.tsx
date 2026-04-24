import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CloneCourt',
  description: 'AI-powered legal case summary generator for digital sports media.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
