import React from "react";
import MDXProvider from "./MDXProvider";

function RootWrapper({ children }) {
  return <MDXProvider>{children}</MDXProvider>;
}

export default RootWrapper;
