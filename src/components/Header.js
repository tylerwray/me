import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

import Nav from "./Nav"

const Wrapper = styled.header`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 32px;
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
  color: var(--black);
  text-decoration: none;
  font-family: Satisfy;
  z-index: var(--index-level-3);
  -webkit-tap-highlight-color: transparent;
`

function Header() {
  return (
    <Wrapper>
      <Container>
        <Title to="/">Tyler Wray</Title>
        <Nav />
      </Container>
    </Wrapper>
  )
}

export default Header
