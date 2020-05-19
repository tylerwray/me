import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

export default function Template({ data }) {
  const { markdownRemark } = data
  const { html, frontmatter } = markdownRemark
  return (
    <Layout>
      <SEO title={frontmatter.title} keywords={frontmatter.tags} />
      <div className="page" dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        tags
        path
      }
    }
  }
`
