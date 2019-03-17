import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import styled from "styled-components"

import Layout from "../components/Layout"

const Header = styled.h1`
  margin-top: 1.45rem;
`

const Info = styled.div`
  margin-bottom: 8px;
`

const Content = styled.div`
  padding-top: 0.5rem;
`

export default function Template({
  data // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout blog>
      <Header>{frontmatter.title}</Header>
      <Info>
        {frontmatter.author} · {frontmatter.date}
      </Info>
      <Img fluid={frontmatter.banner.childImageSharp.fluid} />
      <sup>
        Photo By{" "}
        <a href={frontmatter.bannerCreditUrl}>{frontmatter.bannerCreditName}</a>
      </sup>
      <Content dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        author
        date(formatString: "MMMM DD, YYYY")
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
