import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ImpactForge',
  description: 'Write for funding. Tell stories that matter. NGO storytelling and grant writing system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
