import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import Header from "./Header"

const Container = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
`

const Layout = ({ children }) => (
  <>
    <Header />
    <Container>
      <main>{children}</main>
    </Container>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
