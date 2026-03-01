/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f0f0f5',
          100: '#e0e0eb',
          200: '#c2c2d6',
          300: '#9494b8',
          400: '#6b6b99',
          500: '#4a4a7a',
          600: '#3a3a63',
          700: '#2a2a4d',
          800: '#1a1a36',
          900: '#0d0d1f',
          950: '#07070f',
        },
        accent: { DEFAULT: '#7c6aff', light: '#a594ff', dark: '#5a48d4' },
        success: '#22c55e',
        danger:  '#ef4444',
        warning: '#f59e0b',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
