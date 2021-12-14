import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import MDXRenderer from "gatsby-plugin-mdx/mdx-renderer"
import family from "../images/family_192.jpg"
import Comments from "./Comments"
import VisuallyHidden from "./VisuallyHidden"

function Post({ frontmatter, siteUrl, timeToRead, fields, body }) {
  const blogPostUrl = `${siteUrl}${fields.slug}`

  const banner = getImage(frontmatter?.banner)

  const readingTime = timeToRead * 3

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="flex text-lg leading-relaxed font-bold">
        <h1 className="mb-2 text-2xl sm:text-4xl">{frontmatter.title}</h1>
      </div>
      <div className="ml-8">{frontmatter.subTitle}</div>
      <div className="mb-4">
        <span>{frontmatter.prettyDate}</span>
        <span style={{ marginLeft: 10, marginRight: 10 }}>{` • `}</span>
        <span>
          {"📚".repeat(Math.floor(readingTime / 5))} {readingTime} min read
        </span>
        <span style={{ marginLeft: 10, marginRight: 10 }}>{` • `}</span>
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
      </div>
      <GatsbyImage
        className="mt-3"
        image={banner}
        alt={frontmatter.bannerDescription}
      />
      <div className="mt-2 mb-6 text-sm text-center text-gray-700 dark:text-gray-500">
        Photo By{" "}
        <a href={frontmatter.bannerCreditUrl}>{frontmatter.bannerCreditName}</a>
      </div>
      <VisuallyHidden>
        <h2 className="inline-block">
          <a id="introduction" className="inline-block" href="#introduction">
            Introduction
          </a>
        </h2>
      </VisuallyHidden>
      <MDXRenderer>{body}</MDXRenderer>
      <a target="_blank" rel="noopener noreferrer" href={fields.editLink}>
        Edit post on GitHub
      </a>
      <div
        className="flex justify-center p-12 my-16 dark:text-white bg-gray-100 dark:bg-gray-800 w-screen relative left-2/4 z-10"
        style={{ marginLeft: "-50vw" }}
      >
        <div className="px-6 max-w-3xl">
          <div className="flex ">
            <div>
              <h3 className="mt-0">About the Author</h3>
              <p className="pb-4">
                Hi{" "}
                <span role="img" aria-label="hand wave">
                  👋
                </span>{" "}
                I'm Tyler. I'm a software engineer with a passion for learning
                new things. I love solving hard problems and simplifying them
                down to their pieces. Presently residing in Utah with my two
                girls and beautiful wife.
              </p>
            </div>
            <img
              className="rounded-full h-48 w-48 ml-12 hidden md:block"
              alt="Family"
              src={family}
            />
          </div>
          <a
            className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-800 dark:hover:bg-purple-900 text-white p-4 rounded-md uppercase font-bold no-underline"
            target="_blank"
            rel="noreferrer"
            href="https://ko-fi.com/tylerwray"
          >
            Buy me a coffee
          </a>
        </div>
      </div>
      <Comments />
    </div>
  )
}

export default Post
