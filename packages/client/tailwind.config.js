module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {},
  plugins: [require('tailwindcss'), require('precss'), require('autoprefixer')]
}
