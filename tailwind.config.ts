import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stanford: {
          red: '#8C1515',
          'red-dark': '#6E1010',
          'red-light': '#B83A4B',
          black: '#2E2D29',
          white: '#FFFFFF',
          'cool-grey': '#4D4F53',
          'warm-grey': '#3F3C30',
          fog: '#F4F4F4',
          'fog-dark': '#DAD7CB',
          sandstone: '#D2C295',
          'light-sandstone': '#F9F6EF',
        },
      },
      fontFamily: {
        sans: ['Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Source Serif Pro', 'Georgia', 'Times', 'serif'],
      },
      ringColor: {
        focus: '#2563EB',
      },
      outlineColor: {
        focus: '#2563EB',
      },
    },
  },
  plugins: [],
};

export default config;
