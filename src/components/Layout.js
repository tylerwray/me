import React from "react";
import { node, bool } from "prop-types";

import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <Header />
      <main className="pt-6">{children}</main>
    </div>
  );
}

Layout.propTypes = {
  children: node.isRequired,
  blog: bool,
};

export default Layout;
