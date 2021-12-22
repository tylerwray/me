import React from "react";
import Layout from "../components/Layout";

function NotFound() {
  return (
    <Layout>
      <div className="grid justify-self-center justify-items-center w-full">
        <h1>404 - Not Found</h1>
        <p>This is not the page you're looking for...</p>
        <span className="block text-8xl p-8" role="img" alt="force hand wave">
          👋🏼
        </span>
      </div>
    </Layout>
  );
}

export default NotFound;
