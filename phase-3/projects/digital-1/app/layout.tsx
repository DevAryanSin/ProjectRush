import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

const bodyFont = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-inter', // Kept variable name consistent with prompt's requirement if needed, or used in CSS
});

const displayFont = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: 'IPForge | Digital Rights Management',
  description: 'Mark your assets. Prove ownership. Build your case instantly. The professional protocol for sports media protection.',
  icons: {
    icon: '/favicon.ico', // Standard
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="antialiased selection:bg-yellow-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
