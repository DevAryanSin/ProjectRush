import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CrisisSync',
  description: 'Turn chaos into coordinated action in real time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
