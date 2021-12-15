import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import darkTheme from "./darkTheme";
import lightTheme from "./lightTheme";
import useColorModeValue from "../../hooks/useColorModeValue";

const Code = ({ children, className, ...props }) => {
  return (
    <code
      className={`text-sm whitespace-nowrap rounded-md py-1 px-2 ${className}`}
      {...props}
    >
      {children}
    </code>
  );
};

function InlineCode({ lang, children }) {
  const theme = useColorModeValue({ dark: darkTheme, light: lightTheme });

  return (
    <Highlight {...defaultProps} code={children} language={lang} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Code className={className} style={style}>
          {tokens.map((line, i) => (
            <span {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </span>
          ))}
        </Code>
      )}
    </Highlight>
  );
}

export default InlineCode;
