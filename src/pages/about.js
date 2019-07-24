import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/Layout"
import SEO from "../components/SEO"

const About = () => (
  <Layout>
    <SEO
      title="About Tyler Wray"
      keywords={["tyler wray", "about", "family", "hobbies"]}
    />
    <h2>
      Hello, I'm Tyler Wray.
      <span role="img" aria-label="hand wave">
        {" "}
        👋
      </span>
    </h2>
    <StaticQuery
      query={graphql`
        query {
          placeholderImage: file(relativePath: { eq: "me_at_work.jpg" }) {
            childImageSharp {
              fluid(maxWidth: 700) {
                ...GatsbyImageSharpFluid_noBase64
              }
            }
          }
        }
      `}
      render={data => (
        <Img
          className="rounded shadow-md mb-4"
          fluid={data.placeholderImage.childImageSharp.fluid}
        />
      )}
    />
    <p>For as long as I can remember, I've loved everything technology.</p>
    <p>
      I was born in 1995 in Pocatello, Idaho; but I grew up in Provo, Utah.
      Living in Provo until the age of 10, I spent lots of time dreaming of
      being a BYU football player. Most of my summers were spent in Idaho on my
      grandparent's farms, or on trips to lake powell, moab, Oregon, and other
      fun places. I had the perfect childhood, and have been extremely blessed
      my entire life.
    </p>
    <p>
      Currently, I am a student at UVU in the Computer Science department; I am
      married to my highschool sweetheart, Ashley; and I have two young girls,
      Lyla and Cecily. I work full time as a Software Engineer for{" "}
      <a href="http://podium.com">Podium</a>. Some of my favorite past-times
      are; Playing Basketball, enjoying my two children, being with family, and
      doing yard work! I'm a{" "}
      <a href="https://twitter.com/wray_tw/status/1127774420724895744?s=20">
        #dad
      </a>{" "}
      through and through.
    </p>
  </Layout>
)

export default About
