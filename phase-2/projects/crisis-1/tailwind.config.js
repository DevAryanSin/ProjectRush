/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary:    'hsl(var(--primary)    / <alpha-value>)',
        accent:     'hsl(var(--accent)     / <alpha-value>)',
        card:       'hsl(var(--card)       / <alpha-value>)',
        border:     'hsl(var(--border)     / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
