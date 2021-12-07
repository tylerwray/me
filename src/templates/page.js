import React from "react"
import { graphql } from "gatsby"
import MDXRenderer from "gatsby-plugin-mdx/mdx-renderer"
import Layout from "../components/Layout"
import Seo from "../components/SEO"

export const query = graphql`
  query Page($id: String!) {
    mdx(id: { eq: $id }) {
      body
      fields {
        slug
      }
      frontmatter {
        title
        description
        tags
      }
    }
  }
`

export default function PageTemplate({ data }) {
  const { body, frontmatter, fields } = data.mdx

  return (
    <Layout>
      <Seo
        path={fields.slug}
        description={frontmatter.description}
        title={frontmatter.title}
        keywords={frontmatter.tags}
      />
      <div className="max-w-3xl mx-auto px-6">
        <MDXRenderer>{body}</MDXRenderer>
      </div>
    </Layout>
  )
}
