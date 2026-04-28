import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RiskLens | Prevention + Post-Mortem Intelligence',
  description: 'Map risks before they happen and learn systematically from incidents after they occur with RiskLens.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
