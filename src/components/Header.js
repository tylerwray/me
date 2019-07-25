import React, { useState, useLayoutEffect } from "react"
import { Link } from "gatsby"
import LightModeIcon from "./LightModeIcon"
import DarkModeIcon from "./DarkModeIcon"
import "./header.css"

const emoji = ["🎉", "🤷🏻‍♂️", "🙈", "🌀", "🕷", "💻", "🖥", "🤘🏻", "⛴"]

function Header() {
  const icon = emoji[Math.floor(Math.random() * emoji.length)]

  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const darkMode = localStorage.getItem("tylerwray-dark-mode")

      if (darkMode === "on") {
        return true
      } else if (darkMode === "off") {
        return false
      }
    }
  })

  useLayoutEffect(() => {
    if (dark) {
      localStorage.setItem("tylerwray-dark-mode", "on")
      document.body.classList.add("tylerwray-dark-mode")
    } else {
      localStorage.setItem("tylerwray-dark-mode", "off")
      document.body.classList.remove("tylerwray-dark-mode")
    }
  }, [dark])

  function handleDarkModeClick() {
    setDark(d => !d)
  }

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
          to="/about"
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
        <a
          href="https://github.com/tylerwray"
          className="mx-2 hover:underline text-black dark:text-cream"
        >
          Github
        </a>
        <button
          type="button"
          className="relative m-3 w-8 focus:outline-none"
          onClick={handleDarkModeClick}
        >
          <div
            className={`DarkMode-track ${
              dark ? "on bg-purple-800" : "bg-gray-300"
            } absolute rounded-full h-4 left-0 right-0`}
          />
          <div
            className={`DarkMode-knob ${
              dark ? "on bg-purple-900" : "bg-cream resize"
            } rounded-full flex items-center justify-center shadow relative w-4 h-4`}
          >
            <div className={`${dark ? "hidden" : ""}`}>
              <LightModeIcon />
            </div>
            <div className={`${dark ? "" : "hidden"}`}>
              <DarkModeIcon />
            </div>
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header
