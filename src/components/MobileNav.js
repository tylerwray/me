import React from "react"
import { bool } from "prop-types"
import styled from "styled-components"

import geometry from "../images/geometry.png"

import { Link } from "gatsby"

const Nav = styled.div`
  position: absolute;
  z-index: var(--index-level-2);
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 100vh;
  display: ${props => (props.open ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: var(--blue);
  background-image: url(${geometry});
`

const link = `
  cursor: pointer;
  text-decoration: none;
  color: var(--cream);
  font-size: 22px;
  margin: 10px 0px;
  padding: 10px;
  border-radius: 5px;
`

const NavAnchor = styled.a`
  ${link}
`

const NavLink = styled(Link)`
  ${link}
`

const MobileNav = ({ open }) => (
  <Nav open={open}>
    <NavAnchor href="https://github.com/tylerwray">Github</NavAnchor>
    <NavAnchor href="https://twitter.com/wray_tw">Twitter</NavAnchor>
    <NavLink to="/about/">About Me</NavLink>
  </Nav>
)

MobileNav.propTypes = {
  open: bool
}

export default MobileNav
