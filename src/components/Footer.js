import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

export function Footer() {
  return (
    <footer className="mw-xl mx-auto p-3 flex items-center justify-start">
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
      <div className="ml-2">
        Personal Blog by <a href="https://twitter.com/wray_tw">Tyler Wray</a>
      </div>
    </footer>
  )
}
