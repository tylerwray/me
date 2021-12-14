import React from "react"
import { MDXProvider as BaseMDXProvider } from "@mdx-js/react"
import CodeSnippet from "./CodeSnippet"
import InlineCode from "./CodeSnippet/InlineCode"

function transformCode({ children, className, ...props }) {
  const lang = className && className.split("-")[1]

  return (
    <CodeSnippet lang={lang} {...props}>
      {children}
    </CodeSnippet>
  )
}

function getCodeChild(children) {
  const childrenArray = React.Children.toArray(children)
  if (childrenArray.length !== 1) return null
  const [firstChild] = childrenArray
  if (firstChild.props.mdxType !== "code") return null
  return firstChild
}

const Pre = ({ children }) => {
  const codeChild = getCodeChild(children)
  return codeChild ? transformCode(codeChild.props) : <pre>{children}</pre>
}

const Code = ({ children }) => {
  if (!children) return null
  let lang = null
  let inlineCode = children

  const RE = /__/

  if (RE.test(children)) {
    const match = children.split("__")
    lang = match[0]
    inlineCode = match[1]
  }

  return <InlineCode lang={lang}>{inlineCode}</InlineCode>
}

const components = {
  inlineCode: Code,
  pre: Pre,
}

function MDXProvider({ children }) {
  return <BaseMDXProvider components={components}>{children}</BaseMDXProvider>
}

export default MDXProvider
