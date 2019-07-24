import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/Layout"
import { Footer } from "../components/Footer"

export default function Template({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  return (
    <Layout>
      <h3 className="mb-1">{frontmatter.title}</h3>
      <div className="mb-4">
        <span className="text-sm">{frontmatter.author}</span>&nbsp;
        <span className="text-xs text-gray-600">{frontmatter.date}</span>
      </div>
      <Img fluid={frontmatter.banner.childImageSharp.fluid} />
      <div className="mt-1 text-xs text-center text-gray-600">
        Photo By{" "}
        <a href={frontmatter.bannerCreditUrl}>{frontmatter.bannerCreditName}</a>
      </div>
      <div className="pt-3" dangerouslySetInnerHTML={{ __html: html }} />
      <Footer />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        author
        date(formatString: "MMMM DD, YYYY")
        banner {
          childImageSharp {
            fluid(maxWidth: 640) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        bannerCreditName
        bannerCreditUrl
      }
    }
  }
`
