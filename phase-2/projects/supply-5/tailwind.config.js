/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent:     'var(--accent)',
        muted:      'var(--muted)',
        border:     'var(--border)',
      },
      fontFamily: {
        serif: ['Source Serif 4', 'serif'],
        'serif-display': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
