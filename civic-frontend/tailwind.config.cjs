/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#1E90FF',
        /* Primary used as the accent color in existing classes (primary-500 / primary-600 etc.) */
        primary: {
          50: '#E8F4FF',
          100: '#D7EFFF',
          200: '#B8E1FF',
          300: '#8FD1FF',
          400: '#5FBFFF',
          500: '#1E90FF',
          600: '#1A78E6',
          700: '#155FBB',
          800: '#0F478A',
          900: '#0B2F59',
        },
        /* Secondary: neutral grayscale used widely in the UI */
        secondary: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [],
}
