export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        vintage: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#F1EDE4',
        ink: '#2A2A2A',
        docbg: '#F8F9FA',
        docborder: '#E3E3E3',
        mocca: '#8B7355',
        vintage: '#FAF8F5',
      },
    },
  },
  plugins: [],
};
