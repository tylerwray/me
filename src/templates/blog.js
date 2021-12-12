import { graphql } from "gatsby"
import React from "react"

import Layout from "../components/Layout"
import Seo from "../components/SEO"
import TableOfContents from "../components/TableOfContents"
import Post from "../components/Post"

export const query = graphql`
  query BlogPost($id: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    mdx(id: { eq: $id }) {
      body
      timeToRead
      fields {
        slug
        editLink
      }
      tableOfContents
      frontmatter {
        title
        description
        icon
        tags
        prettyDate: date(formatString: "MMMM DD, YYYY")
        metaDate: date(formatString: "YYYY-DD-MM")
        banner {
          publicURL
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
        bannerDescription
        bannerCreditName
        bannerCreditUrl
      }
    }
  }
`

function BlogTemplate({ data }) {
  const { frontmatter, body, fields, tableOfContents } = data.mdx

  const headings = [
    { title: "Introduction", url: "#introduction" },
    ...tableOfContents.items,
  ]

  return (
    <Layout>
      <Seo
        path={fields.slug}
        description={frontmatter.description}
        image={frontmatter.banner.publicURL}
        imageDescription={frontmatter.bannerDescription}
        keywords={frontmatter.tags}
        meta={[
          {
            property: "article:published_time",
            content: frontmatter.metaDate,
          },
          { property: "article:tag", content: frontmatter.tags },
          { property: "article:section", content: "Technology" },
        ]}
        title={frontmatter.title}
      />
      <div className="layout-grid">
        <div />
        <Post
          frontmatter={frontmatter}
          body={body}
          fields={fields}
          siteUrl={data.site.siteMetadata.siteUrl}
          timeToRead={data.mdx.timeToRead}
        />
        <TableOfContents headings={headings} />
      </div>
    </Layout>
  )
}

export default BlogTemplate
