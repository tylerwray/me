import React from "react"
import { string } from "prop-types"
import styled from "styled-components"

import { Link } from "gatsby"

const Wrapper = styled.div`
  & > a {
    color: var(--black);
  }
`

const NavLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  font-size: 18px;
  margin: 10px 0px;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    text-decoration: underline;
  }
`

const Nav = () => (
  <Wrapper>
    <NavLink to="/about/" activeStyle={{ textDecoration: "underline" }}>
      About me
    </NavLink>
  </Wrapper>
)

Nav.propTypes = {
  textColor: string
}

export default Nav
