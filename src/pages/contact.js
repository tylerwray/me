import React from "react"

import Layout from "../components/Layout"
import SEO from "../components/SEO"

const Contact = () => (
  <Layout>
    <SEO
      title="About Tyler Wray"
      keywords={["tyler wray", "about", "family", "hobbies"]}
    />
    <ul>
      <li>
        <span className="font-bold">Email:</span>{" "}
        <a href="mailto:wraytw@gmail.com">wraytw@gmail.com</a>
      </li>
      <li>
        <span className="font-bold">Twitter:</span>{" "}
        <a href="https://twitter.com/wray_tw">@wray_tw</a>
      </li>
      <li>
        <span className="font-bold">LinkedIn:</span>{" "}
        <a href="https://www.linkedin.com/in/wraytw/">Tyler Wray</a>
      </li>
    </ul>
  </Layout>
)

export default Contact
