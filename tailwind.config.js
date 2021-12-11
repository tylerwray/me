const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./src/**/*.js", "./blog/**/*.mdx", "./pages/**/*.mdx"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors: {
      gray: colors.neutral,
      black: "rgba(57, 62, 65, 1)",
      white: "#ffffff",
      amber: colors.amber,
      purple: colors.violet,
    },
  },
  plugins: [],
}
