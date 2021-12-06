import React from "react"
import Highlight, { defaultProps } from "prism-react-renderer"

// const Pre = styled.pre`
//   font-size: 15;
//   line-height: 1.45;
//   word-break: normal;
//   overflow: auto;
//   direction: ltr;
//   text-align: left;
//   white-space: pre;
//   word-spacing: normal;
//   word-break: normal;
//   margin: 3 -3;
//   background-color: editor-background;
//   color: editor-on;
//   direction: ltr;
//   text-align: left;
//   white-space: pre;
//   word-spacing: normal;
//   word-break: normal;
//   hyphens: none;
//   padding: 4 0;
//   border-left: ${th.space(4)} solid transparent;
//   border-right: ${th.space(4)} solid transparent;

//   textarea {
//     &:focus {
//       outline: none;
//     }
//   }

//   ${up(
//     "sm",
//     css`
//       border-radius: editor;
//       margin: 3 -2;
//     `
//   )}
// `

function Code({ children, lang = "markup" }) {
  const prismTheme = undefined

  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={lang}
      theme={prismTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i })

            return (
              <div {...lineProps}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            )
          })}
        </pre>
      )}
    </Highlight>
  )
}

export default Code
