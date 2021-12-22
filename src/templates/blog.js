import { graphql } from "gatsby";
import React from "react";

import Seo from "../components/SEO";
import TableOfContents from "../components/TableOfContents";
import Post from "../components/Post";
import Header from "../components/Header";

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
        tags
        prettyDate: publishedOn(formatString: "MMMM DD, YYYY")
        metaDate: publishedOn(formatString: "YYYY-DD-MM")
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
`;

function BlogTemplate({ data }) {
  const { frontmatter, body, fields, tableOfContents } = data.mdx;

  const headings = [
    { title: "Introduction", url: "#introduction" },
    ...tableOfContents.items,
  ];

  return (
    <div className="grid">
      <Seo
        description={frontmatter.description}
        image={frontmatter.banner?.publicURL}
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
        path={fields.slug}
        title={frontmatter.title}
      />
      <Header />
      <main className="grid grid-cols-1 gap-8 xl:grid-cols-post md:justify-items-center">
        <div className="hidden xl:block" />
        <Post
          frontmatter={frontmatter}
          body={body}
          fields={fields}
          siteUrl={data.site.siteMetadata.siteUrl}
          timeToRead={data.mdx.timeToRead}
        />
        <TableOfContents headings={headings} />
      </main>
    </div>
  );
}

export default BlogTemplate;
