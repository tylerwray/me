module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        black: "rgba(57, 62, 65, 1)",
        red: "rgb(233, 79, 55)",
        cream: "#F5FAFA"
      }
    }
  },
  variants: {
    textColor: ["dark"]
  },
  plugins: [darkMode]
}

function darkMode({ addVariant, e }) {
  addVariant("dark", ({ modifySelectors, separator }) => {
    modifySelectors(
      ({ className }) =>
        `.tylerwray-dark-mode .${e(`dark${separator}${className}`)}`
    )
  })
}
