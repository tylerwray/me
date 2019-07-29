import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { getIcon } from "../icons"

function Post({ node }) {
  return (
    <>
      <div className="mb-2">
        <Link
          className="flex items-center text-xl leading-relaxed font-bold text-black dark:text-cream cursor-pointer hover:underline"
          to={node.frontmatter.path}
        >
          {getIcon(node.frontmatter.icon)}
          {node.frontmatter.title}
        </Link>
        <div className="text-xs my-1">
          <span>{node.frontmatter.date}</span>
          <span className="mx-2">·</span>
          <span>
            {"📚".repeat(Math.floor(node.timeToRead / 5))} {node.timeToRead} min
            read
          </span>
        </div>
        <div>{node.excerpt}</div>
      </div>
      <hr className="h-px bg-gray-500" />
    </>
  )
}

function IndexPage({ data }) {
  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <Post key={node.id} node={node} />
      ))}
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  {
    allMarkdownRemark(
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
            icon
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
  }
`
