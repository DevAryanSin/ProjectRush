import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CostLeakFinder',
  description: 'Describe your supply chain — find hidden cost inefficiencies instantly',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
