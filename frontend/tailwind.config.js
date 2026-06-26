/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        workbench: {
          50: '#f4f6fe',
          100: '#e8ecfc',
          200: '#d5defb',
          300: '#b5c5f7',
          400: '#8da4f2',
          500: '#647eeb',
          600: '#485ee2',
          700: '#3c4bcc',
          800: '#353fa6',
          900: '#2f3984',
          950: '#1c204f',
        },
        darkbg: {
          50: '#0f111a',
          100: '#141724',
          200: '#1a1e30',
          300: '#22283f',
          400: '#2c3350',
          500: '#384266',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
