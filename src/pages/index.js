import React from "react";
import { graphql, Link } from "gatsby";

import Seo from "../components/SEO";
import { IconArrowRight } from "../icons";
import Layout from "../components/Layout";
import meAtWork from "../images/me_at_work.jpg";

export const pageQuery = graphql`
  {
    allMdx(
      limit: 5
      sort: { fields: [frontmatter___publishedOn], order: DESC }
      filter: { frontmatter: { publishedOn: { ne: null } } }
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

function IndexPage({ data }) {
  return (
    <Layout>
      <Seo
        path="/"
        title="My special corner of the internet"
        keywords={[`tyler wray`, `blog`, `dev`, `tech`]}
      />
      <div className="grid sm:grid-cols-2 gap-8 justify-items-center sm:justify-items-end pb-8">
        <div>
          <h1 className="whitespace-nowrap">
            Hi there, I'm Tyler.{" "}
            <span role="img" aria-label="hand wave">
              👋
            </span>
          </h1>

          <p>
            For as long as I can remember, I've loved everything technology.
            When I discovered that I could create technology with software, it
            became my second love. It's now my mission to help others discover
            the beauty in software that I've found.
          </p>
        </div>
        <img
          className="rounded-full h-max max-h-52"
          alt="Me at Work"
          src={meAtWork}
        />
      </div>

      <h2 className="uppercase text-green-600 dark:text-green-400">
        Recently Published
      </h2>
      <div className="grid gap-6">
        {data.allMdx.edges.map(({ node }) => (
          <Post key={node.id} node={node} />
        ))}
      </div>
    </Layout>
  );
}

function Post({ node }) {
  return (
    <Link
      className="group no-underline text-black dark:text-white"
      to={node.fields.slug}
    >
      <h3 className="dark:group-hover:text-purple-400 group-hover:text-purple-600">
        {node.frontmatter.title}
      </h3>
      <p>{node.excerpt}</p>
      <div className="font-bold">
        Read More
        <IconArrowRight className="inline opacity-0 group-hover:opacity-100 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

export default IndexPage;
