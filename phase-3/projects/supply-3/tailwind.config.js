/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        accent: '#b91c1c',
        cream: '#f5f0e8',
      },
      fontFamily: {
        editorial: ['Playfair Display', 'serif'],
        body: ['Source Serif 4', 'serif'],
        ui: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
