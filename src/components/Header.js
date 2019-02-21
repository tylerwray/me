import React, { useState } from "react"
import styled from "styled-components"

import geometry from "../images/geometry.png"

import MobileNav from "./MobileNav"
import Hamburger from "./Hamburger"
import Title from "./Title"

const Container = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Background = styled.div`
  position: absolute;
  width: 100%;
  min-height: 140px;
  height: 10vh;
  max-height: 560px;
  box-sizing: border-box;
  padding: 48px 48px 32px;
  overflow: hidden;
  transform: skewY(8deg);
  transform-origin: 100%;
  background-color: var(--blue);
  background-image: url(${geometry});
  z-index: var(--index-lowest);
`

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  return (
    <header>
      <Background />
      <Container>
        <Title to="/">Tyler Wray</Title>
        <Hamburger open={menuOpen} onToggle={toggleMenu} />
      </Container>
      <MobileNav open={menuOpen} />
    </header>
  )
}

export default Header
