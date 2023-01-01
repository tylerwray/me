import type { MarkdownHeading } from "astro";
import { useState, useEffect } from "react";

interface Props {
  headings: MarkdownHeading[];
}

export const TableOfContents = ({ headings }: Props) => {
  const [currentID, setCurrentID] = useState("overview");

  useEffect(() => {
    const setCurrent: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (entry.target.id === "on-this-page-heading") continue;
          setCurrentID(entry.target.id);
          break;
        }
      }
    };

    const headingsObserver = new IntersectionObserver(setCurrent, {
      // Negative top margin accounts for `scroll-margin`.
      // Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
      rootMargin: "-100px 0% -66%",
      threshold: 1,
    });

    // Observe all the headings in the main page content.
    document
      .querySelectorAll("#article :is(h1,h2,h3)")
      .forEach((h) => headingsObserver.observe(h));

    return () => headingsObserver.disconnect();
  }, []);

  const depthClasses = new Map([
    [1, "pl-4"],
    [2, "pl-4"],
    [3, "pl-8"],
  ]);

  return (
    <>
      <h2 id="on-this-page-heading" className="pl-5 text- pb-2 font-semibold">
        On this page
      </h2>
      <ul>
        {headings.map(({ depth, slug, text }) => (
          <li key={slug}>
            <a
              className={`${
                currentID === slug
                  ? "dark:bg-purple-800/40 bg-purple-200 border-purple-400 dark:border-purple-600"
                  : "border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-700 dark:hover:border-zinc-300"
              } group flex py-1 border-l-4 ${depthClasses.get(depth)}`}
              href={`#${slug}`}
              onClick={() => {
                setCurrentID(slug);
              }}
            >
              <span className="relative">
                {text}
                <span className="h-0.5 left-0 -bottom-1 w-full block absolute scale-x-0 group-hover:scale-x-100 transition-transform ease-in origin-left group-hover:bg-black dark:group-hover:bg-white" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TableOfContents;
