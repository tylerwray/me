import colors from "../../colors"

const LIGHT_THEME = {
  plain: {
    color: colors.gray[700],
    backgroundColor: colors.gray[100],
  },
  styles: [
    {
      types: ["inserted", "attr-name"],
      style: {
        color: colors.blue[600],
        fontStyle: "italic",
      },
    },
    {
      types: ["comment"],
      style: {
        color: colors.gray[400],
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "attr-value"],
      style: {
        color: colors.green[700],
      },
    },
    {
      types: ["variable"],
      style: {
        color: colors.purple[600],
      },
    },
    {
      types: ["number"],
      style: {
        color: colors.amber[700],
      },
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ["punctuation"],
      style: {
        color: colors.gray[600],
      },
    },
    {
      types: ["function", "selector", "doctype"],
      style: {
        color: colors.blue[600],
      },
    },
    {
      types: ["class-name"],
      style: {
        color: colors.green[600],
      },
    },
    {
      types: ["tag"],
      style: {
        color: colors.amber[700],
      },
    },
    {
      types: ["script", "spread"],
      style: {
        color: colors.amber[700],
      },
    },
    {
      types: ["operator"],
      style: {
        color: colors.gray[700],
      },
    },
    {
      types: ["atom", "attr-name"],
      languages: ["elixir"],
      style: {
        color: colors.amber[700],
      },
    },
    {
      types: ["property", "keyword", "namespace"],
      style: {
        color: colors.purple[700],
      },
    },
    {
      types: ["boolean"],
      style: {
        color: colors.amber[700],
      },
    },
  ],
}

export default LIGHT_THEME
