import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/Layout"
import Seo from "../components/SEO"
import { getIcon } from "../icons"

export const pageQuery = graphql`
  {
    allMdx(
      limit: 5
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fileAbsolutePath: { regex: "/blog/" }
        frontmatter: { isPublished: { ne: false } }
      }
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            icon
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

function IndexPage({ data }) {
  return (
    <Layout>
      <Seo
        path="/"
        title="My special corner of the internet"
        keywords={[`gatsby`, `application`, `react`]}
      />
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex mb-16 text-center sm:text-left">
          <div>
            <h1 className="whitespace-no-wrap">
              Hi there, I'm Tyler.{" "}
              <span role="img" aria-label="hand wave">
                👋
              </span>
            </h1>

            <img
              className="rounded-full h-48 w-48 mx-auto sm:ml-12 sm:hidden"
              alt="Me at Work"
              src="/images/me_at_work_720.jpg"
            />
            <p>
              For as long as I can remember, I've loved everything technology.
              When I discovered that I could create technology with software, it
              became my second love. It's now my mission to help others discover
              the beauty in software that I've found.
            </p>
          </div>
          <img
            className="rounded-full h-48 w-48 ml-12 hidden sm:block"
            alt="Me at Work"
            src="/images/me_at_work_720.jpg"
          />
        </div>

        <h3 className="mb-8">Recent Posts</h3>
        {data.allMdx.edges.map(({ node }) => (
          <Post key={node.id} node={node} />
        ))}
      </div>
    </Layout>
  )
}

function Post({ node }) {
  return (
    <Link
      className="group no-underline text-lg leading-relaxed text-black dark:text-white cursor-pointer border-transparent"
      to={node.fields.slug}
    >
      <div className="mb-2">
        <div className="flex">
          <div>{getIcon(node.frontmatter.icon)}</div>
          <div className="dark:group-hover:text-purple-400 group-hover:text-purple-600 text-lg font-bold">
            {node.frontmatter.title}
          </div>
        </div>
        <div className="mb-2 text-sm no-underline">{node.excerpt}</div>
        <div className="group-hover:translate-x-2 transform mb-8 font-bold text-sm transition">
          Read More
        </div>
      </div>
    </Link>
  )
}

export default IndexPage
