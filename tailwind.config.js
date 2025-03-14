/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'poloar-azul': '#004080',
        'poloar-vermelho': '#E00000',
        'poloar-branco': '#ffffff',
      },
    },
  },
  plugins: [],
} 