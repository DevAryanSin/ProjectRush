/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        space: ['var(--font-space)', 'Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
