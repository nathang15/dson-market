module.exports = {
  mode: "jit",
  content: [
  "./pages/**/*.{js,ts,jsx,tsx}", 
  "./components/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx",
],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        socialBg:'#F5F7FB',
        socialBlue: '#218DFA',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};