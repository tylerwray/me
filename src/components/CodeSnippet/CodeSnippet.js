import React, { useState } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import darkTheme from "./darkTheme";
import lightTheme from "./lightTheme";
import { calculateLinesToHighlight, copyToClipboard } from "./utils";
import useColorModeValue from "../../hooks/useColorModeValue";
import { IconCheck, IconChevronRight, IconCopy } from "../../icons";
import VisuallyHidden from "../VisuallyHidden";

import Prism from "prism-react-renderer/prism";
(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-elixir");

const CopyButton = ({ codeString }) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <button
      onClick={() => {
        copyToClipboard(codeString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      }}
      className={`group rounded absolute top-2 right-2 p-2 text-lg  ${
        isCopied
          ? "bg-green-200 dark:bg-green-600"
          : "bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300"
      }`}
    >
      {isCopied ? (
        <>
          <VisuallyHidden>Copied</VisuallyHidden>
          <IconCheck className="stroke-green-500 dark:stroke-green-900" />
        </>
      ) : (
        <IconCopy className="stroke-gray-500 group-hover:stroke-gray-600 dark:stroke-gray-900 dark:group-hover:stroke-gray-900" />
      )}
    </button>
  );
};

const Pre = ({ children, className, ...props }) => {
  return (
    <pre
      className={`overflow-scroll text-sm rounded pt-10 pb-6 ${className}`}
      {...props}
    >
      {children}
    </pre>
  );
};

const LangBadge = ({ children }) => (
  <div className="font-mono uppercase bg-purple-200 dark:bg-purple-800 px-2 py-1 text-xs rounded-b-md">
    {children}
  </div>
);

const FileNameBadge = ({ children }) => {
  if (!children) return null;

  return (
    <div className="font-mono bg-green-200 dark:bg-green-800 px-2 py-1 text-xs rounded-b-md">
      {children}
    </div>
  );
};

const GutterItem = ({ isHighlighted, children }) => (
  <span
    className={`sticky left-0 inline-grid justify-end w-12 pr-3 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-opacity-80 select-none ${
      isHighlighted ? "border-l-4 border-purple-400" : ""
    }`}
  >
    {children}
  </span>
);

const LineHighlight = ({ isHighlighted }) => {
  if (!isHighlighted) return null;

  return (
    <span className="absolute left-0 top-0 w-full bg-purple-500 opacity-10 pointer-events-none">
      {" "}
    </span>
  );
};

function CodeSnippet({ children, lang = "markup", highlight, file }) {
  const theme = useColorModeValue({ dark: darkTheme, light: lightTheme });

  const shouldHighlightLine = calculateLinesToHighlight(highlight);

  const codeString = children.trim();

  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={lang}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className="relative pb-8">
          <div className="absolute left-4 grid grid-cols-[max-content,auto] gap-4">
            <LangBadge>{lang}</LangBadge>
            <FileNameBadge>{file}</FileNameBadge>
          </div>
          <Pre className={className} style={style}>
            <CopyButton codeString={codeString} />
            <code className="grid">
              {tokens.map((line, i) => {
                const isHighlighted = shouldHighlightLine(i);

                return (
                  <div
                    {...getLineProps({
                      line,
                      key: i,
                      className: "relative",
                    })}
                  >
                    <GutterItem isHighlighted={isHighlighted}>
                      {lang === "shell" ? (
                        <IconChevronRight className="scale-150" />
                      ) : (
                        i + 1
                      )}
                    </GutterItem>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                    <LineHighlight isHighlighted={isHighlighted} />
                  </div>
                );
              })}
            </code>
          </Pre>
        </div>
      )}
    </Highlight>
  );
}

export default CodeSnippet;
