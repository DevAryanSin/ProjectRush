/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#166534',
        'bold-orange': '#ea580c',
        'soft-cream': '#f3efe7',
        'deep-charcoal': '#1a1a1a',
      },
      fontFamily: {
        'editorial': ['Libre Baskerville', 'serif'],
        'body': ['Source Serif 4', 'serif'],
        'ui': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
