import React from "react"
import styled from "styled-components"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Container = styled.footer`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const Phrase = styled.div`
  margin-left: 8px;
  font-size: 16px;
`

export function Footer() {
  return (
    <Container>
      <StaticQuery
        query={graphql`
          query {
            placeholderImage: file(relativePath: { eq: "initials.png" }) {
              childImageSharp {
                fixed(width: 50, height: 50) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        `}
        render={data => (
          <Img fixed={data.placeholderImage.childImageSharp.fixed} />
        )}
      />
      <Phrase>
        Personal Blog by <a href="https://twitter.com/wray_tw">Tyler Wray</a>
      </Phrase>
    </Container>
  )
}
