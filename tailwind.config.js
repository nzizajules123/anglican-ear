/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7f1',
          100: '#e5eddc',
          500: '#56704a',
          700: '#344b2c',
          800: '#293f23',
          900: '#1d2b19',
          950: '#101b0d',
        },
      },
    },
  },
  plugins: [],
}
