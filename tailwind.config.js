/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F0E8',
        },
        marble: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(139, 134, 128, 0.08)',
        'glass-hover': '0 12px 48px rgba(139, 134, 128, 0.12)',
        'gold': '0 4px 24px rgba(217, 119, 6, 0.15)',
      },
    },
  },
  plugins: [],
}
