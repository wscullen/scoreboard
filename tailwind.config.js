/** @type {import('tailwindcss').Config} */

import ContainerQueries from "@tailwindcss/container-queries"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'superxl2': '65rem',
        'superxl': '50rem',
        'superlg': '40rem',
        'supermd': '30rem',
        'supersm': '20rem',
        '10xl': '10rem',
        '11xl': '11rem',
        '12xl': '12rem',
        '13xl': '13rem',
        '14xl': '14rem',
        '15xl': '15rem',
        '16xl': '16rem',
        '17xl': '17rem',
        '18xl': '18rem',
        '19xl': '19rem',
      }
    },
  },
  plugins: [ContainerQueries],
}

