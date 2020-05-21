import React from "react"
import { node, bool } from "prop-types"

import Header from "./Header"

function Layout({ children }) {
  return (
    <div className="max-w-3xl mx-auto px-6">
      <Header />
      <main className="pt-6">{children}</main>
    </div>
  )
}

Layout.propTypes = {
  children: node.isRequired,
  blog: bool,
}

export default Layout
