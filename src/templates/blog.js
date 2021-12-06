import { graphql } from "gatsby"
import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import MDXRenderer from "gatsby-plugin-mdx/mdx-renderer"

import Layout from "../components/Layout"
import Seo from "../components/SEO"
import family from "../images/family_192.jpg"

import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader"

deckDeckGoHighlightElement()

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
  const { frontmatter, body, fields } = data.mdx
  const blogPostUrl = `${data.site.siteMetadata.siteUrl}${fields.slug}`

  const banner = getImage(frontmatter.banner)

  const timeToRead = data.mdx.timeToRead * 3

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
        <a target="_blank" rel="noopener noreferrer" href={fields.editLink}>
          Edit post on GitHub
        </a>
      </div>
      <GatsbyImage className="mt-3" image={banner} />
      <div className="mt-2 mb-6 text-sm text-center text-gray-500">
        Photo By{" "}
        <a href={frontmatter.bannerCreditUrl}>{frontmatter.bannerCreditName}</a>
      </div>
      <MDXRenderer>{body}</MDXRenderer>
      <div className="my-16 p-12 dark:text-white bg-gray-300 shadow-none dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex flex-col md:flex-row pb-12">
          <div>
            <h3 className="mt-0">About the Author</h3>
            <p>
              Hi{" "}
              <span role="img" aria-label="hand wave">
                👋
              </span>{" "}
              I'm Tyler. I'm a software engineer with a passion for learning new
              things. I love solving hard problems and simplifying them down to
              their pieces. Presently residing in Utah with my two girls and
              beautiful wife.
            </p>
          </div>
          <img
            className="rounded-full h-48 w-48 ml-12 hidden md:block"
            alt="Family"
            src={family}
          />
        </div>
        <a
          className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-md"
          target="_blank"
          rel="noreferrer"
          href="https://ko-fi.com/tylerwray"
        >
          Buy me a coffee
        </a>
      </div>
    </Layout>
  )
}

export default BlogTemplate
