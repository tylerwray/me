const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")

async function createPages({ graphql, actions, reporter }) {
  const { createPage } = actions

  const { data, errors } = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            fields {
              slug
              pageType
            }
            parent {
              ... on File {
                sourceInstanceName
              }
            }
          }
        }
      }
    }
  `)

  if (errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Create pages
  data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(
        __dirname,
        `./src/templates/${node.fields.pageType}.js`
      ),
      context: {
        id: node.id,
      },
    })
  })
}

function getSlug({ node, getNode, pageType }) {
  const path = createFilePath({ node, getNode })

  // 'page' types should just use their file path
  if (pageType === "page") return path

  return `/${pageType}${path}`
}

function onCreateMdxNode({ node, getNode, actions }) {
  const { createNodeField } = actions
  const pageType = /blog/.test(node.fileAbsolutePath) ? "blog" : "page"
  const slug = node.frontmatter.slug || getSlug({ node, getNode, pageType })

  createNodeField({
    name: "pageType",
    node,
    value: pageType,
  })

  createNodeField({
    name: "slug",
    node,
    value: slug,
  })

  const url = new URL(getSiteUrl())
  url.pathname = slug

  createNodeField({
    name: "url",
    node,
    value: url.toString(),
  })

  const editPath = node.fileAbsolutePath.replace(__dirname, "")

  createNodeField({
    name: "editLink",
    node,
    value: `https://github.com/tylerwray/me/edit/main${editPath}`,
  })
}

function onCreateNode(...args) {
  if (args[0].node.internal.type === `Mdx`) {
    onCreateMdxNode(...args)
  }
}

function getSiteUrl() {
  if (process.env.NETLIFY !== "true")
    return "https://tylerwray.me/" || "http://localhost:8000/"
  if (process.env.CONTEXT === "production") return process.env.URL
  return process.env.DEPLOY_PRIME_URL
}

module.exports = {
  onCreateNode,
  createPages,
}
