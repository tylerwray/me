import React from "react"
import RootWrapper from "./src/components/RootWrapper"
import "./src/global.css"

export const wrapRootElement = ({ element }) => (
  <RootWrapper>{element}</RootWrapper>
)
