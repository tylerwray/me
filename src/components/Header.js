import React, { useState } from "react"
import { bool } from "prop-types"
import styled from "styled-components"
import { Link } from "gatsby"

import geometry from "../images/geometry.png"

import MobileNav from "./MobileNav"
import Nav from "./Nav"

const Wrapper = styled.header`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 32px;
  background-color: var(${props => props.color});
  background-image: ${props =>
    props.hideTexture ? "none" : `url(${geometry})`};
  z-index: var(--index-lowest);
`

const Container = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled(Link)`
  font-size: 32px;
  line-height: 40px;
  color: var(${props => props.color});
  text-decoration: none;
  font-family: Satisfy;
  z-index: var(--index-level-3);
  -webkit-tap-highlight-color: transparent;
`

const HamburgerButton = styled.button`
  width: 40px;
  height: 30px;
  background: transparent;
  border: none;
  outline: none;
  z-index: var(--index-level-3);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  @media (min-width: 700px) {
    display: none;
  }
`

const HamburgerLines = styled.div`
  width: 24px;
  height: 2px;
  position: relative;
  left: 0px;
  background: ${props => (props.open ? "transparent" : `var(${props.color})`)};
  transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;

  &::before {
    content: "";
    top: ${props => (props.open ? 0 : "-8px")};
    width: 24px;
    height: 2px;
    position: absolute;
    left: 0px;
    transform: rotate(${props => (props.open ? 45 : 0)}deg);
    background: var(${props => props.color});
    transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;
  }

  &::after {
    top: ${props => (props.open ? 0 : "8px")};
    content: "";
    width: 24px;
    height: 2px;
    position: absolute;
    left: 0px;
    transform: rotate(${props => (props.open ? -45 : 0)}deg);
    background: var(${props => props.color});
    transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;
  }
`

const NavMediaQuery = styled.div`
  display: none;
  @media (min-width: 700px) {
    display: block;
  }
`

function Header({ isTransparent }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  return (
    <Wrapper
      color={isTransparent ? "--cream" : "--blue"}
      hideTexture={isTransparent}
    >
      <Container>
        <Title
          to="/"
          color={menuOpen ? "--cream" : isTransparent ? "--black" : "--cream"}
        >
          Tyler Wray
        </Title>
        <HamburgerButton onClick={toggleMenu} aria-label="menu">
          <HamburgerLines
            color={menuOpen ? "--cream" : "--black"}
            open={menuOpen}
          />
        </HamburgerButton>
        <NavMediaQuery>
          <Nav textColor={isTransparent ? "--black" : "--cream"} />
        </NavMediaQuery>
      </Container>
        <MobileNav open={menuOpen} />
    </Wrapper>
  )
}

Header.propTypes = {
  isTransparent: bool
}

export default Header
