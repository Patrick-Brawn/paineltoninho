/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        torrado: {
          DEFAULT: '#2B1B12',
          light: '#3D291B',
          dark: '#1F1B16',
        },
        kraft: {
          DEFAULT: '#F7EFE1',
          dark: '#EEE2CC',
          card: '#FFFBF3',
        },
        vermelho: {
          DEFAULT: '#8B3A2B',
          light: '#A8493A',
        },
        dourado: {
          DEFAULT: '#C68A3D',
          light: '#DCA75C',
          dark: '#A8722F',
        },
        plantacao: {
          DEFAULT: '#4B6B4A',
          light: '#5F8360',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        stamp: '0 2px 0 rgba(43,27,18,0.15)',
        card: '0 4px 14px rgba(43,27,18,0.10)',
      },
    },
  },
  plugins: [],
}
