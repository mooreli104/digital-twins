/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for sustainability theme
        'farm-green': '#22c55e',
        'farm-blue': '#3b82f6',
        'farm-red': '#ef4444',
        'farm-yellow': '#fbbf24',
      },
    },
  },
  plugins: [],
}
