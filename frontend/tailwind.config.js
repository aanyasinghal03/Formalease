/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF8F3',
        ink: '#122019',
        charcoal: '#1E2A24',
        emerald: {
          50: '#EAF6EE',
          100: '#D2EEDA',
          200: '#A6DDB8',
          400: '#3C9E63',
          500: '#1F7A45',
          600: '#166238',
          700: '#0F4C2C',
        },
        mint: '#E4F4EA',
        amber: {
          50: '#FDF3E1',
          400: '#E0A32E',
          500: '#C6821A',
        },
        sand: '#EFEAE0',
        slateblue: '#5B7A9D',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(18, 32, 25, 0.06), 0 1px 2px rgba(18, 32, 25, 0.04)',
        cardHover: '0 12px 24px rgba(18, 32, 25, 0.10), 0 2px 6px rgba(18, 32, 25, 0.06)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        countPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        countPulse: 'countPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
