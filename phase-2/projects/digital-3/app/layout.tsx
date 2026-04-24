import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AssetVault',
  description: 'Digital asset vulnerability ranking and copyright protection.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
