/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4f4f0", // High-key artsy background (off-white)
        surface: "#ffffff", 
        primary: "#000000", // Stark black for contrast
        secondary: "#333333"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'], // Bold, quirky font
      },
      backgroundImage: {
        'noise': "url('https://grainy-gradients.vercel.org/noise.svg')", // External noise texture or local
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
