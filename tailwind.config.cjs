/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: {
          900: "#202024",
          800: "#36363C",
          700: "#4B4C55",
          600: "#61626D",
          500: "#777885",
          400: "#8C8E9E",
          300: "#A2A5B6",
          200: "#B8BCCE",
          100: "#CDD3E7",
          50: "#E3EAFF",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
