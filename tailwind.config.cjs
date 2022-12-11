const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,md,mdx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        purple: colors.violet,
      },
      // See tailwind default theme for theme keys
      // https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            p: {
              margin: 0,
              paddingBottom: theme("spacing.5"),
            },
            "h1, h2, h3, h4, h5, h6": {
              margin: 0,
            },
            "ul, li": {
              margin: 0,
            },
            ul: {
              paddingBottom: theme("spacing.5")
            },
            blockquote: {
              fontWeight: theme("fontWeight.normal"),
              fontStyle: "normal",
              backgroundColor: theme("colors.purple.100"),
              borderLeftColor: theme("colors.purple.400"),
              borderLeftWidth: theme("borderWidth.8"),
              marginBottom: theme("spacing.4"),
              marginInline: "-0.5rem",
              paddingBlock: theme("spacing.4"),
              borderRadius: theme("borderRadius.md"),
              quotes: "none",
              "& > p": {
                padding: 0,
                margin: 0,
              },
            },
            a: {
              color: theme("colors.purple.600"),
              textDecorationLine: "none",
              "&:hover": {
                textDecorationLine: "underline",
              },
            },
            h1: {
              fontSize: theme("fontSize.3xl")[0],
              lineHeight: theme("fontSize.3xl")[1].lineHeight,
            },
            img: {
              borderRadius: theme("borderRadius.md"),
              margin: "0 auto",
            },
            "p, li": {
              code: {
                color: "inherit",
                backgroundColor: theme("colors.zinc.200"),
                padding: "0.25rem 0.5rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: "400",
              },
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },

        // Dark Mode specific styles
        invert: {
          css: {
            blockquote: {
              backgroundColor: "rgba(121,72,232,0.2)",
              borderLeftColor: theme("colors.purple.800"),
            },
            a: {
              color: theme("colors.purple.400"),
              border: theme("colors.purple.800"),
            },
            "p, li": {
              code: {
                backgroundColor: theme("colors.zinc.800"),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
