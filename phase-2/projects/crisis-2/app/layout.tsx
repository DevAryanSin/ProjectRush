import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StaffPulse',
  description: 'AI-powered crisis coordination for hospitality teams.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
