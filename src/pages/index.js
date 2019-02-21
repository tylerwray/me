import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"

function IndexPage({ data }) {
  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      {data.allMdx.edges.map(({ node }) => (
        <div key={node.id}>
          <div>{node.frontmatter.title}</div>
          <div>
            <span>{node.frontmatter.date}</span>
            <span>{node.timeToRead} mins</span>
          </div>
          <div>{node.excerpt}</div>
          <Link to={node.frontmatter.slug}>READ</Link>
        </div>
      ))}
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  {
    allMdx(
      limit: 5
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/blog/" } }
    ) {
      edges {
        node {
          id
          excerpt
          timeToRead
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            slug
          }
        }
      }
    }
  }
`
