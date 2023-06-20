module.exports = {
  mode: "jit",
  content: [
  "./pages/**/*.{js,ts,jsx,tsx}", 
  "./components/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx",
],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        socialBg:'#F5F7FB',
        socialBlue: '#218DFA',
        customGray: '#a2a2a2',
        customBlack: "#1E1F23",
        customBlack2: "#27282F",
        lightBG: "#F9F9F9",
        darkBG: "#17181C",
        lightBorder: "#EFEFEF",
      },
      borderWidth: {
        '3': '3px',
      },
      screens: {
        'sm': '320px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};