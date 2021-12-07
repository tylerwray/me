import React, { useEffect } from "react"
// eslint-disable-next-line import/no-unresolved
import { useLocation } from "@reach/router"

const TOP_OFFSET = 100

function getHeaderAnchors() {
  return Array.prototype.filter.call(
    document.getElementsByClassName("anchor"),
    (testElement) =>
      testElement.parentNode.nodeName === "H2" ||
      testElement.parentNode.nodeName === "H3"
  )
}

function getHeaderDataFromAnchor(el) {
  return {
    url: el.getAttribute("href"),
    text: el.parentElement?.innerText,
    depth: Number(el.parentElement?.nodeName.replace("H", "")),
  }
}

function getAnchorHeaderIdentifier(el) {
  return el?.parentElement?.id
}

export function useTocHighlight(ref) {
  const { pathname } = useLocation()
  const [lastActiveLink, setLastActiveLink] = React.useState(undefined)
  const [headings, setHeadings] = React.useState([])

  useEffect(() => {
    setHeadings(getHeaderAnchors().map(getHeaderDataFromAnchor))
  }, [pathname])

  useEffect(() => {
    let headersAnchors = []
    let links = []

    function setActiveLink() {
      function getActiveHeaderAnchor() {
        let index = 0
        let activeHeaderAnchor = null

        headersAnchors = getHeaderAnchors()
        while (index < headersAnchors.length && !activeHeaderAnchor) {
          const headerAnchor = headersAnchors[index]
          const { top } = headerAnchor.getBoundingClientRect()

          if (top >= 0 && top <= TOP_OFFSET) {
            activeHeaderAnchor = headerAnchor
          }

          index += 1
        }

        return activeHeaderAnchor
      }

      const activeHeaderAnchor = getActiveHeaderAnchor()

      if (activeHeaderAnchor) {
        let index = 0
        let itemHighlighted = false

        links = ref.current ? ref.current.querySelectorAll("a") : []

        while (index < links.length && !itemHighlighted) {
          const link = links[index]
          const { href } = link
          const anchorValue = decodeURIComponent(
            href.substring(href.indexOf("#") + 1)
          )

          if (getAnchorHeaderIdentifier(activeHeaderAnchor) === anchorValue) {
            if (lastActiveLink) {
              lastActiveLink.removeAttribute("aria-current")
            }

            link.setAttribute("aria-current", "true")

            setLastActiveLink(link)
            itemHighlighted = true
          }

          index += 1
        }
      }
    }

    document.addEventListener("scroll", setActiveLink)
    document.addEventListener("resize", setActiveLink)

    setActiveLink()

    return () => {
      document.removeEventListener("scroll", setActiveLink)
      document.removeEventListener("resize", setActiveLink)
    }
  })

  return headings
}

function Link({ href, children }) {
  return (
    <a
      href={href}
      className="table-of-contents-link inline-block transition-all text-gray-600 dark:text-gray-400 no-underline opactiy-80 transform hover:translate-x-1 hover:text-gray-900 dark:hover:text-white text-sm"
    >
      {children}
    </a>
  )
}

function TableOfContents() {
  const ref = React.useRef()
  const headings = useTocHighlight(ref)
  if (!headings.length) return null
  return (
    <div
      ref={ref}
      className="sticky hidden top-2 py-6 overflow-y-auto h-screen xl:block"
    >
      <h4 className="m-0 text-sm font-normal uppercase">On this page</h4>
      <ul className="list-none p-0">
        {headings.map((heading, i) =>
          heading.url ? (
            <li key={i} data-depth={heading.depth} className="my-1">
              <Link href={heading.url}>{heading.text}</Link>
            </li>
          ) : null
        )}
      </ul>
    </div>
  )
}

export default TableOfContents
