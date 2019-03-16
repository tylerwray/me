import React, { useState } from "react"
import { bool } from "prop-types"
import styled from "styled-components"
import { Link } from "gatsby"

import geometry from "../images/geometry.png"

import MobileNav from "./MobileNav"

const Container = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled(Link)`
  font-size: 32px;
  line-height: 40px;
  color: var(--cream);
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
`

const HamburgerLines = styled.div`
  width: 24px;
  height: 2px;
  position: relative;
  left: 0px;
  background: ${props => (props.open ? "transparent" : "var(--cream)")};
  transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;

  &::before {
    content: "";
    top: ${props => (props.open ? 0 : "-8px")};
    width: 24px;
    height: 2px;
    position: absolute;
    left: 0px;
    transform: rotate(${props => (props.open ? 45 : 0)}deg);
    background: var(--cream);
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
    background: var(--cream);
    transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;
  }
`

const Background = styled.div`
  position: absolute;
  width: 100%;
  min-height: ${props => (props.flat ? 0 : "140px")};
  height: 35vh;
  max-height: 560px;
  box-sizing: border-box;
  padding: 48px 48px 32px;
  overflow: hidden;
  transform: skewY(${props => (props.flat ? 0 : 8)}deg);
  transform-origin: 100%;
  background-color: var(--blue);
  background-image: url(${geometry});
  z-index: var(--index-lowest);

  @media (min-width: 700px) {
    height: 50vh;
  }
`

function Header({ blog }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  return (
    <header>
      <Background flat={blog} />
      <Container>
        <Title to="/">Tyler Wray</Title>
        <HamburgerButton onClick={toggleMenu} aria-label="menu">
          <HamburgerLines open={menuOpen} />
        </HamburgerButton>
      </Container>
      <MobileNav open={menuOpen} />
    </header>
  )
}

Header.propTypes = {
  blog: bool
}

export default Header
