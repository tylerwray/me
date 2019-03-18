import React from "react"
import { graphql, Link } from "gatsby"
import styled from "styled-components"

import Layout from "../components/Layout"
import SEO from "../components/SEO"

const Item = styled.div`
  margin-top: 16px;
  color: var(--black);
  padding: 16px;
  border-bottom: 1px solid var(--slate-grey);
`

const Title = styled(Link)`
  font-size: 24px;
  font-weight: 600;
  color: var(--black);
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const Info = styled.div`
  font-size: 14px;
  margin: 4px 0;
`

const Date = styled.span``

const Dot = styled.span`
  margin: 0 8px;
`
const TimeToRead = styled.span``

const Excerpt = styled.div`
  font-size: 18px;
`

function IndexPage({ data }) {
  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <Item key={node.id}>
          <Title to={node.frontmatter.path}>{node.frontmatter.title}</Title>
          <Info>
            <Date>{node.frontmatter.date}</Date>
            <Dot>·</Dot>
            <TimeToRead>
              {"📚".repeat(Math.floor(node.timeToRead / 5))} {node.timeToRead}{" "}
              min read
            </TimeToRead>
          </Info>
          <Excerpt>{node.excerpt}</Excerpt>
        </Item>
      ))}
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      limit: 5
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/blog/" } }
    ) {
      edges {
        node {
          id
          excerpt
          timeToRead
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
  }
`
