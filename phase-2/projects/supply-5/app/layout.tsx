import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ContractClause',
  description: 'Generate protective contract clauses for supply chain disruption scenarios.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
