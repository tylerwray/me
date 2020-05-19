import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { getIcon } from "../icons"
import config from "../../config/website"

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      timeToRead
      fields {
        githubEditLink
      }
      frontmatter {
        title
        subTitle
        description
        path
        icon
        tags
        prettyDate: date(formatString: "MMMM DD, YYYY")
        metaDate: date(formatString: "YYYY-DD-MM")
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

function BlogTemplate({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html, timeToRead, fields } = markdownRemark
  const blogPostUrl = `${config.siteUrl}${frontmatter.path}`

  return (
    <Layout>
      <SEO
        description={frontmatter.description}
        keywords={frontmatter.tags}
        title={frontmatter.title}
        image={frontmatter.banner.childImageSharp.fluid.src}
        meta={[
          { property: "article:published_time", content: frontmatter.metaDate },
          { property: "article:tag", content: frontmatter.tags },
          { property: "article:section", content: "Technology" },
        ]}
      />
      <div className="flex items-center text-lg leading-relaxed font-bold">
        {getIcon(frontmatter.icon)}
        <span className="ml-1">{frontmatter.title}</span>
      </div>
      <div className="ml-8">{frontmatter.subTitle}</div>
      <div className="text-xs my-1">
        <span>{frontmatter.prettyDate}</span>
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
      <div className="page pt-3" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="mb-4">
        <a
          target="_blank"
          rel="noopener noreferrer"
          // using mobile.twitter.com because if people haven't upgraded
          // to the new experience, the regular URL wont work for them
          href={`https://mobile.twitter.com/search?q=${encodeURIComponent(
            blogPostUrl
          )}`}
        >
          Discuss on Twitter
        </a>
        <span style={{ marginLeft: 10, marginRight: 10 }}>{` • `}</span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={fields.githubEditLink}
        >
          Edit post on GitHub
        </a>
      </div>
    </Layout>
  )
}

export default BlogTemplate
