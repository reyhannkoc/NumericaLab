/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Module accent colors
        module: {
          'floating-point': '#f59e0b',
          'root-finding':   '#10b981',
          'interpolation':  '#3b82f6',
          'differentiation':'#8b5cf6',
          'integration':    '#ec4899',
          'linear-systems': '#14b8a6',
          'lu':             '#f97316',
          'optimization':   '#06b6d4',
          'ode':            '#84cc16',
          'performance':    '#e11d48',
        },
        surface: {
          DEFAULT: '#0f172a',
          card:    '#1e293b',
          hover:   '#273548',
          border:  '#334155',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        math:  ['Computer Modern', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in':     'fadeIn 0.4s ease-in-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSub 1s infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideRight:{ from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        bounceSub: { '0%, 100%': { transform: 'translateY(-4px)' }, '50%': { transform: 'translateY(0)' } },
      },
      boxShadow: {
        'glow-brand':  '0 0 20px rgba(99, 102, 241, 0.35)',
        'glow-green':  '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-blue':   '0 0 20px rgba(59, 130, 246, 0.35)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
        'hero-gradient': 'radial-gradient(ellipse at 60% 20%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.12) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
