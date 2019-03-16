import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"

import Layout from "../components/Layout"

const Header = styled.h1`
  margin-top: 1.45rem;
`

const Info = styled.div`
  margin-bottom: 8px;
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
      <img src={frontmatter.banner} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
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
      }
    }
  }
`
