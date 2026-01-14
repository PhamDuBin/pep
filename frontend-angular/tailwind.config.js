/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: '#066A9E',
        'primary-light': '#E6F3F5',
        'text-dark': '#333333',
        'text-gray': '#808080',
        'border-gray': '#B9B9B9',
        'border-light': '#E1E1E1',
        'avatar-bg': '#8EC5D0',
      },
      fontFamily: {
        'noto': ['Noto Sans', 'sans-serif'],
        'noto-jp': ['Noto Sans JP', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'header': '0px 4px 15px rgba(0, 0, 0, 0.05)',
        'tab': '0px 4px 10px rgba(0, 0, 0, 0.05)',
        'sidebar': '0px 4px 15px rgba(0, 0, 0, 0.1)',
        'input': '0px 4px 15px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
}
