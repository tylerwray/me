const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        black: "rgba(57, 62, 65, 1)",
        white: "#ffffff",
        purple: colors.violet,
        green: colors.emerald,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
