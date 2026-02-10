/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1a',
        paper: '#faf8f5',
        accent: '#2d6a4f',
        'accent-light': '#d8f3dc',
        'accent-glow': '#40916c',
        warm: '#f4845f',
        'warm-light': '#fce4db',
        blue: '#1d4e89',
        'blue-light': '#d6e5f5',
        muted: '#6b7280',
        border: '#e5e2dd',
      },
      fontFamily: {
        serif: ['DM Serif Display', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
