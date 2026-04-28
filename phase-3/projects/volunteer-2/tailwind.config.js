/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#050810',
        primary: '#22d3ee',
        secondary: '#7c3aed',
        alert: '#ef4444',
        'terminal-accent': '#39ff14',
      },
    },
  },
  plugins: [],
}
