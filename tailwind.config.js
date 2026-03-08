/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'mega-orange': '#FF6600',
        'mega-dark': '#1A1A1A',
        'mega-gray': '#F5F5F5',
        'mega-slate': '#333333'
      }
    },
  },
  plugins: [],
};
