import React from "react";

import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="grid">
      <Header />
      <main className="grid justify-self-center w-full max-w-3xl p-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
