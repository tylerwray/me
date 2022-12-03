const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,md,mdx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        green: colors.emerald,
        purple: colors.violet,
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
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
