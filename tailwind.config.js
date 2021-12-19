const colors = require("./src/colors");

module.exports = {
  content: ["./src/**/*.js", "./blog/**/*.mdx", "./pages/**/*.mdx"],
  darkMode: "class",
  theme: {
    colors,
    extend: {
      gridTemplateColumns: {
        post: "minmax(0, 24rem) 1fr minmax(0, 24rem)",
      },
    },
  },
  plugins: [],
};
