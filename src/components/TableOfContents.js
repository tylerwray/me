import React from "react";

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func.apply(null, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(null, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const TableOfContents = ({ headings }) => {
  const activeHeadingUrl = useActiveHeading(headings);

  return (
    <nav
      id="table-of-contents"
      className="sticky top-2 overflow-y-auto h-screen pt-20 px-2 hidden xl:block justify-self-start"
    >
      <h4 className="uppercase">Table of Contents</h4>

      {headings.map((heading, index) => (
        <ContentLinkHeading
          key={index}
          href={heading.url}
          isActive={activeHeadingUrl === heading.url}
        >
          {heading.title}
        </ContentLinkHeading>
      ))}
    </nav>
  );
};

const useActiveHeading = (headings) => {
  const [activeHeadingUrl, setActiveHeadingUrl] = React.useState(
    headings[0].url
  );

  React.useEffect(() => {
    const handleScroll = throttle(() => {
      // The first heading within the viewport is the one we want to highlight.
      let firstHeadingInViewport = headings.find(({ url }) => {
        const elem = document.querySelector(url);
        if (!elem) return false;
        const rect = elem.getBoundingClientRect();
        // Using negative value here because our headers have a top
        // padding and top border
        return rect.top >= -2 && rect.bottom <= window.innerHeight;
      });

      if (
        firstHeadingInViewport &&
        firstHeadingInViewport.url !== activeHeadingUrl
      ) {
        setActiveHeadingUrl(firstHeadingInViewport.url);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeHeadingUrl, setActiveHeadingUrl, headings]);

  return activeHeadingUrl;
};

const ContentLinkHeading = ({ isActive = false, children, ...props }) => {
  let activeStyles = "text-gray-600 dark:text-gray-400";

  if (isActive) activeStyles = "text-gray-900 dark:text-white font-bold";

  return (
    <a
      className={`block mb-2 no-underline transition-opacity opacity-70 hover:focus:opacity-100 hover:black dark:hover:text-white text-base ${activeStyles}`}
      {...props}
    >
      {children}
    </a>
  );
};
// font-weight: 500;
// color: var(--table-of-contents-text);
// transform: translateX(0.25rem);

export default TableOfContents;
