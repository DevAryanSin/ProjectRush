import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ChainSight',
  description: 'Supply chain intelligence system. Narrative translation and cost optimization analysis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
