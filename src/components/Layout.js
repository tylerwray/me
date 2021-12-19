import React from "react";

import Header from "./Header";

function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-8">{children}</main>
    </>
  );
}

export default Layout;
