import React from "react"
import { Link } from "gatsby"

const emoji = ["🎉", "🤷🏻‍♂️", "🙈", "🌀", "🕷", "💻", "🖥", "🤘🏻", "⛴"]

function Header() {
  const icon = emoji[Math.floor(Math.random() * emoji.length)]

  return (
    <header className="flex items-center justify-between py-4">
      <Link to="/" className="text-black no-underline">
        <span className="text-2xl" role="img" aria-label="emoji">
          {icon}
        </span>
        <span className="ml-2 text-lg hidden sm:inline">Tyler Wray</span>
      </Link>
      <div className="flex justify-around">
        <Link
          to="/about"
          className="mx-2 hover:underline text-black"
          activeStyle={{ textDecoration: "underline" }}
        >
          Me
        </Link>
        <Link
          to="/contact"
          className="mx-2 hover:underline text-black"
          activeStyle={{ textDecoration: "underline" }}
        >
          Contact
        </Link>
        <a
          href="https://github.com/tylerwray"
          className="mx-2 hover:underline text-black"
        >
          Github
        </a>
      </div>
    </header>
  )
}

export default Header
