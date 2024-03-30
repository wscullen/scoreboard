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
      }
    },
  },
  plugins: [ContainerQueries],
}

