/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { 
    extend: {
      colors: {
        primary: '#0f766e',
        accent: '#ea580c',
        charcoal: '#1a1a1a',
      },
      fontFamily: {
        'serif-display': ['var(--font-playfair)', 'serif'],
        'source-serif': ['var(--font-source-serif)', 'serif'],
        'ui': ['var(--font-nunito)', 'sans-serif'],
      }
    } 
  },
  plugins: [],
}
