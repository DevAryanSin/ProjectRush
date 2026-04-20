import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScanGuard — Digital Sports Media IP Protection',
  description: 'AI-powered tool to detect unauthorized use and misappropriation of official sports media across the internet.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
