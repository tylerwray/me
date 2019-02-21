import React from "react"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import Card from "../components/Card"
import { graphql } from "gatsby"

function IndexPage() {
  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      <Card
        title="React anti-patterns"
        url="/react-anti-patterns/"
        dateCreated="2019-02-17"
        timeToRead={8}
      />
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
