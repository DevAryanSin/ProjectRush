import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WeatherShield',
  description: 'Input your route and forecast — predict weather-based delay risk',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
