import React from "react"
import { string } from "prop-types"
import styled from "styled-components"

import { Link } from "gatsby"

const Wrapper = styled.div`
  & > a {
    color: var(${props => props.color});
  }
`

const link = `
  cursor: pointer;
  text-decoration: none;
  font-size: 18px;
  margin: 10px 0px;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    text-decoration: underline
  }
`

const NavAnchor = styled.a`
  ${link}
`

const NavLink = styled(Link)`
  ${link}
`

const Nav = ({ textColor }) => (
  <Wrapper color={textColor}>
    <NavAnchor href="https://github.com/tylerwray/me">Github</NavAnchor>
    <NavAnchor href="https://twitter.com/wray_tw">Twitter</NavAnchor>
    <NavLink to="/about/" activeStyle={{ textDecoration: "underline" }}>
      About Me
    </NavLink>
  </Wrapper>
)

Nav.propTypes = {
  textColor: string
}

export default Nav
