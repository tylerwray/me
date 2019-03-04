import React from "react"
import { graphql, Link } from "gatsby"
import styled from "styled-components"

import Layout from "../components/Layout"
import SEO from "../components/SEO"

const Card = styled.div`
  margin-top: 16px;
  background-color: white;
  color: var(--black);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  padding: 16px;
`

const Title = styled(Link)`
  font-size: 24px;
  font-weight: 600;
  color: var(--black);
  text-decoration: none;
  cursor: pointer;
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
        <Card key={node.id}>
          <Title to={node.frontmatter.path}>{node.frontmatter.title}</Title>
          <Info>
            <Date>{node.frontmatter.date}</Date>
            <Dot>·</Dot>
            <TimeToRead>
              {"🗻".repeat(node.timeToRead)} {node.timeToRead} min read
            </TimeToRead>
          </Info>
          <Excerpt>{node.excerpt}</Excerpt>
        </Card>
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
