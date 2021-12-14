import React, { useState } from "react"
import Highlight, { defaultProps } from "prism-react-renderer"
import darkTheme from "./darkTheme"
import lightTheme from "./lightTheme"
import { calculateLinesToHighlight, copyToClipboard } from "./utils"
import useColorModeValue from "../../hooks/useColorModeValue"
import { IconCheck, IconCopy } from "../../icons"
import VisuallyHidden from "../VisuallyHidden"

import Prism from "prism-react-renderer/prism"
;(typeof global !== "undefined" ? global : window).Prism = Prism
require("prismjs/components/prism-elixir")

const CopyButton = ({ codeString }) => {
  const [isCopied, setIsCopied] = useState(false)

  return (
    <button
      onClick={() => {
        copyToClipboard(codeString)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 3000)
      }}
      className={`group inline-flex rounded absolute top-0 right-0 m-2 p-2 text-lg  ${
        isCopied
          ? "bg-green-200 dark:bg-green-600"
          : "bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300"
      }`}
    >
      {isCopied ? (
        <>
          <VisuallyHidden>Copied</VisuallyHidden>
          <IconCheck className="stroke-green-500 dark:stroke-green-900" />
        </>
      ) : (
        <IconCopy className="stroke-gray-500 group-hover:stroke-gray-600 dark:stroke-gray-900 dark:group-hover:stroke-gray-900" />
      )}
    </button>
  )
}

const Pre = ({ children, className, ...props }) => {
  return (
    <pre
      className={`relative my-8 overflow-x-auto text-sm rounded-md pt-10 pr-6 pb-6 pl-2 ${className}`}
      {...props}
    >
      {children}
    </pre>
  )
}

const LangBadge = ({ children }) => (
  <span className="font-mono uppercase bg-purple-200 dark:bg-purple-800 px-2 py-1 mr-4 text-xs rounded-b-md">
    {children}
  </span>
)

const FileNameBadge = ({ children }) => (
  <span className="font-mono bg-green-200 dark:bg-green-800 px-2 py-1 text-xs rounded-b-md">
    {children}
  </span>
)

const LineNumber = ({ children }) => (
  <span className="text-gray-400 dark:text-gray-500 pr-3 w-8 text-right select-none opacity-50 inline-block">
    {children}
  </span>
)

const HIGHLIGHT_CODE_LINE_STYLES =
  "bg-purple-100 dark:bg-[rgba(142,107,223,0.1)] border-l-4 border-purple-400 dark:border-purple-500 -mr-11 -ml-2 pl-[0.25rem]"

function CodeSnippet({ children, lang = "markup", highlight, file }) {
  const theme = useColorModeValue({ dark: darkTheme, light: lightTheme })

  const shouldHighlightLine = calculateLinesToHighlight(highlight)

  const codeString = children.trim()

  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={lang}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className="relative">
          <div className="inline-flex absolute z-10 left-6">
            <LangBadge>{lang}</LangBadge>
            {file && <FileNameBadge>{file}</FileNameBadge>}
          </div>
          <Pre className={className} style={style}>
            <CopyButton codeString={codeString} />
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i })

              if (shouldHighlightLine(i)) {
                lineProps.className = `${lineProps.className} ${HIGHLIGHT_CODE_LINE_STYLES}`
              }

              return (
                <div {...lineProps}>
                  <LineNumber>{i + 1}</LineNumber>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              )
            })}
          </Pre>
        </div>
      )}
    </Highlight>
  )
}

export default CodeSnippet
