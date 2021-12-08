import React from "react"
import Header from "../components/Header"

function NotFound() {
  return (
    <div className="max-w-3xl m-auto">
      <Header />
      <div className="text-center text-xl p-12">
        <h1>404 - Not Found</h1>
        This is not the page you're looking for...
        <span className="block mt-12 text-8xl" role="img" alt="force hand wave">
          👋🏼
        </span>
      </div>
    </div>
  )
}

export default NotFound
