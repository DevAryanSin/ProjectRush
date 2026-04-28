import './globals.css'
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap' 
})
const mono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  display: 'swap' 
})
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-jakarta',
  display: 'swap' 
})

export const metadata = {
  title: 'CrisisFlow',
  description: 'Unified Emergency Guidance & Broadcast System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${jakarta.variable} dark`}>
      <body className="antialiased selection:bg-cyan-500/30">
        {children}
      </body>
    </html>
  )
}
