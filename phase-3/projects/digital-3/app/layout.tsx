import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OriginLock | Forensic Content Trace & Licensing',
  description: 'Professional forensic analysis and structured legal licensing for digital assets.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Playfair+Display:wght@700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}

