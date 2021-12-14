import colors from "../../colors"

const DARK_THEME = {
  plain: {
    color: colors.gray[300],
    backgroundColor: colors.gray[800],
  },
  styles: [
    {
      types: ["inserted", "attr-name"],
      style: {
        color: colors.blue[400],
        fontStyle: "italic",
      },
    },
    {
      types: ["comment"],
      style: {
        color: colors.gray[500],
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "attr-value"],
      style: {
        color: colors.green[400],
      },
    },
    {
      types: ["number"],
      style: {
        color: colors.amber[600],
      },
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ["punctuation"],
      style: {
        color: colors.gray[400],
      },
    },
    {
      types: ["function", "selector", "doctype"],
      style: {
        color: colors.blue[400],
      },
    },
    {
      types: ["class-name"],
      style: {
        color: colors.green[500],
      },
    },
    {
      types: ["tag"],
      style: {
        color: colors.amber[400],
      },
    },
    {
      types: ["script", "spread"],
      style: {
        color: colors.amber[400],
      },
    },
    {
      types: ["operator"],
      style: {
        color: colors.gray[400],
      },
    },
    {
      types: ["atom", "attr-name"],
      languages: ["elixir"],
      style: {
        color: colors.amber[400],
      },
    },
    {
      types: ["property", "keyword", "namespace"],
      style: {
        color: colors.purple[400],
      },
    },
    {
      types: ["boolean"],
      style: {
        color: colors.amber[400],
      },
    },
  ],
}

export default DARK_THEME
