import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReverseTrace | Digital Media Forensic Analysis',
  description: 'Trace suspicious sports media back to its likely original source using advanced forensic AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
