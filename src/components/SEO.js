import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { StaticQuery, graphql } from "gatsby";

const DETAILS_QUERY = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
        image
      }
    }
  }
`;

function SEO({
  description,
  image,
  imageDescription,
  keywords,
  lang,
  meta,
  path,
  title,
  type,
}) {
  return (
    <StaticQuery
      query={DETAILS_QUERY}
      render={(data) => {
        const metaDescription =
          description || data.site.siteMetadata.description;

        const metaImage = image || data.site.siteMetadata.image;
        const metaType = type || `blog`;
        const url = `${data.site.siteMetadata.siteUrl}${path}`;

        return (
          <Helmet
            htmlAttributes={{
              lang,
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
                content: metaType,
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
                content: imageDescription || "Me at Work",
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
      }}
    />
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
};

SEO.propTypes = {
  description: PropTypes.string,
  image: PropTypes.string,
  imageDescription: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  lang: PropTypes.string,
  meta: PropTypes.array,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default SEO;
