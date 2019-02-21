import React from "react"
import { bool, func } from "prop-types"
import styled from "styled-components"

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
  background: ${props =>
    props.open ? "transparent" : "${props => props.color}"};
  transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;

  &::before {
    content: "";
    top: ${props => (props.open ? 0 : "-8px")};
    width: 24px;
    height: 2px;
    position: absolute;
    left: 0px;
    transform: rotate(${props => (props.open ? 45 : 0)}deg);
    background: ${props => props.color};
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
    background: ${props => props.color};
    transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;
  }
`

function Hamburger({ open, onToggle, color = "black" }) {
  return (
    <HamburgerButton onClick={onToggle}>
      <HamburgerLines open={open} color={color} />
    </HamburgerButton>
  )
}

Hamburger.propTypes = {
  open: bool,
  onToggle: func
}

export default Hamburger
