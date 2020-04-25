const path = require("path")

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const blogTemplate = path.resolve(`src/templates/BlogTemplate.js`)

  const {
    errors: blogErrors,
    data: {
      allMarkdownRemark: { edges: posts },
    },
  } = await graphql(`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/blog/" } }
        sort: { order: ASC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)

  if (blogErrors) {
    console.error(blogErrors)
    return
  }

  posts.forEach(({ node }, index) => {
    const prev = index === 0 ? {} : posts[index - 1].node
    const next = index === posts.length - 1 ? {} : posts[index + 1].node
    createPage({
      path: node.frontmatter.path,
      component: blogTemplate,
      context: {
        prev,
        next,
      },
    })
  })

  const pageTemplate = path.resolve(`src/templates/PageTemplate.js`)

  const {
    errors: pageErrors,
    data: {
      allMarkdownRemark: { edges: pages },
    },
  } = await graphql(`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/pages/" } }
        sort: { order: ASC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)

  if (pageErrors) {
    console.error(pageErrors)
    return
  }

  pages.forEach((page) => {
    createPage({
      path: page.node.frontmatter.path,
      component: pageTemplate,
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type === `MarkdownRemark`) {
    const { createNodeField } = actions
    const fileNode = getNode(node.parent)

    createNodeField({
      name: "githubEditLink",
      node,
      value: `https://github.com/tylerwray/me/edit/master/blog/${fileNode.relativePath}`,
    })
  }
}
