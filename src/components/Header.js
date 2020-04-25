import { Link } from "gatsby"
import React from "react"
import useDarkMode from "use-dark-mode"
import Moon from "../icons/Moon"
import Sun from "../icons/Sun"
import "./header.css"

const emoji = ["🙈", "🌀", "💻", "🤘🏻"]

function Header() {
  const icon = emoji[Math.floor(Math.random() * emoji.length)]

  const darkMode = useDarkMode()

  return (
    <header className="flex items-center justify-between py-4">
      <Link to="/" className="text-black dark:text-cream no-underline">
        <span className="text-2xl" role="img" aria-label="emoji">
          {icon}
        </span>
        <span className="ml-2 text-lg hidden sm:inline">Tyler Wray</span>
      </Link>
      <div className="flex justify-around items-center">
        <Link
          to="/me"
          className="mx-2 hover:underline text-black dark:text-cream"
          activeStyle={{ textDecoration: "underline" }}
        >
          Me
        </Link>
        <Link
          to="/contact"
          className="mx-2 hover:underline text-black dark:text-cream"
          activeStyle={{ textDecoration: "underline" }}
        >
          Contact
        </Link>
        <button
          type="button"
          className="relative m-3 w-8 focus:outline-none"
          onClick={darkMode.toggle}
        >
          <div
            className={`DarkMode-track ${
              darkMode.value ? "on bg-purple-800" : "bg-gray-300"
            } absolute rounded-full h-6 w-10 left-0 right-0`}
          />
          <div
            className={`DarkMode-knob ${
              darkMode.value ? "on bg-purple-900" : "bg-cream resize"
            } rounded-full flex items-center justify-center shadow relative w-6 h-6`}
          >
            <Sun
              className={`${
                darkMode.value ? "hidden" : ""
              } text-yellow-500 fill-current`}
            />
            <Moon
              className={`${
                darkMode.value ? "" : "hidden"
              } text-purple-700 fill-current`}
            />
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header
