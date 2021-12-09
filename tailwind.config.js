const colors = require("tailwindcss/colors")

module.exports = {
  purge: ["./src/**/*.js", "./blog/**/*.md"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors: {
      gray: colors.gray,
      black: "rgba(57, 62, 65, 1)",
      white: "#ffffff",
      purple: colors.purple,
      yellow: colors.yellow,
    },
  },
  variants: {
    extend: {
      translate: ["dark", "group-hover"],
      display: ["dark"],
    },
  },
  plugins: [],
}

// module.exports = {
//   theme: {
//     extend: {
//     },
//   },
//   variants: {
//     textColor: ["dark"],
//     backgroundColor: ["dark", "hover"],
//     translate: ["dark"],
//     display: ["dark", "responsive"],
//   },
//   plugins: [darkMode],
// }

// function darkMode({ addVariant, e }) {
//   addVariant("dark", ({ modifySelectors, separator }) => {
//     modifySelectors(
//       ({ className }) => `.dark-mode .${e(`dark${separator}${className}`)}`
//     )
//   })
// }
