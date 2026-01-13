/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A', // Slate 900
        secondary: '#334155', // Slate 700
        accent: '#3B82F6', // Blue 500
        success: '#10B981', // Emerald 500
        danger: '#EF4444', // Red 500
        warning: '#F59E0B', // Amber 500
        background: '#F8FAFC', // Slate 50
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
