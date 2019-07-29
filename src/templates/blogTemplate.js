import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/Layout"
import { Footer } from "../components/Footer"
import SEO from "../components/SEO"
import { getIcon } from "../icons"

export default function Template({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html, timeToRead } = markdownRemark

  return (
    <Layout>
      <SEO title={frontmatter.title} keywords={[frontmatter.tags]} />
      <div className="flex items-center text-xl leading-relaxed font-bold">
        {getIcon(frontmatter.icon)}
        {frontmatter.title}
      </div>
      <div className="text-xs my-1">
        <span>{frontmatter.date}</span>
        <span className="mx-2">·</span>
        <span>
          {"📚".repeat(Math.floor(timeToRead / 5))} {timeToRead} min read
        </span>
      </div>
      <Img className="mt-3" fluid={frontmatter.banner.childImageSharp.fluid} />
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
      timeToRead
      frontmatter {
        title
        icon
        tags
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
