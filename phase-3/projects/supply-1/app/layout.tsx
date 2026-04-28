import './globals.css'

export const metadata = {
  title: 'StormRoute',
  description: 'Predict disruption. Reroute before it hits.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
