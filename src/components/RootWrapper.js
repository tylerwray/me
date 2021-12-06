import React from "react"
import { MDXProvider } from "@mdx-js/react"

import Code from "./Code"

function transformCode({ children, className, ...props }) {
  const lang = className && className.split("-")[1]
  return (
    <Code lang={lang} {...props}>
      {children}
    </Code>
  )
}

function getCodeChild(children) {
  const childrenArray = React.Children.toArray(children)
  if (childrenArray.length !== 1) return null
  const [firstChild] = childrenArray
  if (firstChild.props.mdxType !== "code") return null
  return firstChild
}

const components = {
  pre: ({ children }) => {
    const codeChild = getCodeChild(children)
    return codeChild ? transformCode(codeChild.props) : <pre>{children}</pre>
  },
}

function RootWrapper({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}

export default RootWrapper
