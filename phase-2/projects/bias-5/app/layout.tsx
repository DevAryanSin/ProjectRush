import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BiasTranslator',
  description: 'Explain any AI bias concept in plain language for non-technical stakeholders',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
