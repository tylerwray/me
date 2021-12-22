import React from "react";
import Helmet from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";

const DETAILS_QUERY = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
        image
        imageDescription
      }
    }
  }
`;

function SEO({
  description,
  image,
  imageDescription,
  keywords = [],
  meta = [],
  path,
  title,
}) {
  const data = useStaticQuery(DETAILS_QUERY);
  const metaDescription = description || data.site.siteMetadata.description;

  const metaImage = image || data.site.siteMetadata.image;
  const metaImageDescription =
    imageDescription || data.site.siteMetadata.imageDescription;
  const url = `${data.site.siteMetadata.siteUrl}${path}`;

  return (
    <Helmet
      htmlAttributes={{
        lang: "en",
      }}
      title={title}
      titleTemplate={`%s | ${data.site.siteMetadata.title}`}
      link={[{ rel: "canonical", href: url }]}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: "blog",
        },
        {
          property: `og:url`,
          content: url,
        },
        {
          property: `og:image`,
          content: `${data.site.siteMetadata.siteUrl}${metaImage}`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:site`,
          content: data.site.siteMetadata.author,
        },
        {
          name: `twitter:creator`,
          content: data.site.siteMetadata.author,
        },
        {
          name: `twitter:creator:id`,
          content: "268108378",
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `twitter:image`,
          content: `${data.site.siteMetadata.siteUrl}${metaImage}`,
        },
        {
          property: `twitter:image:alt`,
          content: metaImageDescription,
        },
        ...meta,
      ].concat(
        keywords.length > 0
          ? {
              name: `keywords`,
              content: keywords.join(`, `),
            }
          : []
      )}
    />
  );
}

export default SEO;
