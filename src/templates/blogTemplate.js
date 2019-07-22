import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import styled from "styled-components"

import Layout from "../components/Layout"
import { Footer } from "../components/Footer"

const Header = styled.h1`
  margin-top: 1.45rem;
  margin-bottom: 0.25rem;
`

const Info = styled.div`
  margin-bottom: 1.85rem;
`

const PhotoCredit = styled.div`
  margin-top: 4px;
  font-size: 12px;
  text-align: center;
`

const Content = styled.div`
  padding-top: 0.5rem;
`

export default function Template({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout>
      <Header>{frontmatter.title}</Header>
      <Info>
        {frontmatter.author} · {frontmatter.date}
      </Info>
      <Img fluid={frontmatter.banner.childImageSharp.fluid} />
      <PhotoCredit>
        Photo By{" "}
        <a href={frontmatter.bannerCreditUrl}>{frontmatter.bannerCreditName}</a>
      </PhotoCredit>
      <Content dangerouslySetInnerHTML={{ __html: html }} />
      <Footer />
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
