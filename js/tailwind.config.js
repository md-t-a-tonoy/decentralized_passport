/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'background':'#CAABBF',
        'blue-here':'#A5D4DC',
        'white-here':'#F7F7F7',
        'pink-here':'#EBD2D1',
        'dark-pink':'#AE9897'
      }
    },
    fontFamily: {
      kons: ['Koh Santepheap', 'sans-serif'],
      kelly:['Kelly Slab'],
      alg:['Alegreya', 'serif'],
    },
  },
  plugins: [],
}

