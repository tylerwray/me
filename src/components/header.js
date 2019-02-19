import { Link } from "gatsby"
import React, { useState } from "react"
import styled from "styled-components"

import profile from "../images/profile.png"

import MobileNav from "./MobileNav"

const Main = styled.header`
  padding-bottom: 5rem;
  background-image: linear-gradient(var(--green), var(--cream));
`

const Container = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.5rem 2rem;
`

const Title = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TitleLink = styled(Link)`
  color: var(--black);
  text-decoration: none;
  font-family: Satisfy;
  z-index: var(--index-level-3);
`

const HamburgerButton = styled.button`
  padding: 24px;
  background: transparent;
  border: none;
  outline: none;
`

const Hamburger = styled.div`
  width: 24px;
  height: 2px;
  position: relative;
  left: 0px;
  background: ${props => (props.open ? "transparent" : "var(--black)")};
  transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;
  cursor: pointer;
  z-index: var(--index-level-3);

  &::before {
    content: "";
    top: ${props => (props.open ? 0 : "-8px")};
    width: 24px;
    height: 2px;
    position: absolute;
    left: 0px;
    transform: rotate(${props => (props.open ? 45 : 0)}deg);
    background: var(--black);
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
    background: var(--black);
    transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;
  }
`

const ProfileImage = styled.div`
  display: block;
  visibility: visible;
  width: 160px;
  height: 160px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  background-size: 100%;
  background: url(${profile}) 5px / cover no-repeat var(--green);
  background-repeat: no-repeat;
`

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  return (
    <Main>
      <Container>
        <Title>
          <TitleLink to="/">Tyler Wray</TitleLink>
          <HamburgerButton onClick={toggleMenu}>
            <Hamburger open={menuOpen} />
          </HamburgerButton>
        </Title>
      </Container>
      <ProfileImage />
      <MobileNav open={menuOpen} />
    </Main>
  )
}

export default Header
