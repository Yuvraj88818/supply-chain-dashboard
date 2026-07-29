/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We will force dark mode at app root, but leave this as standard
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // slate-900
        surface: '#1E293B',    // slate-800
        primary: '#3B82F6',    // blue-500
        secondary: '#10B981',  // emerald-500
        danger: '#EF4444',     // red-500
        warning: '#F59E0B',    // amber-500
        textMain: '#F8FAFC',   // slate-50
        textMuted: '#94A3B8',  // slate-400
        border: '#334155'      // slate-700
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
