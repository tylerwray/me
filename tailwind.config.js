module.exports = {
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
    textColor: ["dark"],
    backgroundColor: ["dark"],
  },
  plugins: [darkMode],
}

function darkMode({ addVariant, e }) {
  addVariant("dark", ({ modifySelectors, separator }) => {
    modifySelectors(
      ({ className }) => `.dark-mode .${e(`dark${separator}${className}`)}`
    )
  })
}
