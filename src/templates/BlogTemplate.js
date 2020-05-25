import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import config from "../../config/website"
import family from "../images/family_192.jpg"

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
        bannerDescription
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
        path={frontmatter.path}
        description={frontmatter.description}
        image={frontmatter.banner.childImageSharp.fluid.src}
        imageDescription={frontmatter.bannerDescription}
        keywords={frontmatter.tags}
        meta={[
          { property: "article:published_time", content: frontmatter.metaDate },
          { property: "article:tag", content: frontmatter.tags },
          { property: "article:section", content: "Technology" },
        ]}
        title={frontmatter.title}
      />
      <div className="flex text-lg leading-relaxed font-bold">
        <h1 className="mb-2 text-2xl sm:text-4xl">{frontmatter.title}</h1>
      </div>
      <div className="ml-8">{frontmatter.subTitle}</div>
      <div className="text-xs my-1">
        <span>{frontmatter.prettyDate}</span>
        <span className="mx-2">·</span>
        <span>
          {"📚".repeat(Math.floor(timeToRead / 5))} {timeToRead} min read
        </span>
      </div>
      <div className="mb-4 text-sm">
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
      <Img className="mt-3" fluid={frontmatter.banner.childImageSharp.fluid} />
      <div className="mt-1 text-xs text-center text-gray-700">
        Photo By{" "}
        <a href={frontmatter.bannerCreditUrl}>{frontmatter.bannerCreditName}</a>
      </div>
      <div
        className="page pt-3 mb-24"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="flex mb-16 p-12 text-white bg-purple-600 shadow-none dark:bg-purple-900 rounded-lg shadow-xl flex-col md:flex-row">
        <div>
          <h3 className="mt-0">About the Author</h3>
          <p className="text-sm">
            Hi{" "}
            <span role="img" aria-label="hand wave">
              👋
            </span>{" "}
            I'm Tyler. I'm a full stack software engineer with a passion for
            learning new things. I love solving hard problems and simplifying
            them down to their pieces. Presently residing in Utah with my two
            girls and beautiful wife.
          </p>
        </div>
        <img
          className="rounded-full h-48 w-48 ml-12 hidden md:block"
          alt="Family"
          src={family}
        />
      </div>
    </Layout>
  )
}

export default BlogTemplate
