module.exports = {
  purge: ["./src/**/*.js", "./blog/**/*.md"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        black: "rgba(57, 62, 65, 1)",
        red: "rgb(233, 79, 55)",
        cream: "#F5FAFA",
      },
    },
  },
  variants: {
    extend: {
      translate: ["dark"],
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
