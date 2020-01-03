import { Link } from "gatsby"
import React, { useLayoutEffect, useState, useEffect } from "react"
import Moon from "../icons/Moon"
import Sun from "../icons/Sun"
import "./header.css"

const emoji = ["🙈", "🌀", "💻", "🤘🏻"]

function changeMode(dark, persist = false) {
  document.body.classList.toggle("tylerwray-dark-mode", dark)

  if (persist) {
    localStorage.setItem("tylerwray-dark-mode", dark ? "on" : "off")
  }
}

function checkMode() {
  if (typeof window !== "undefined") {
    const darkMode = localStorage.getItem("tylerwray-dark-mode")

    if (darkMode === "on") {
      return true
    } else if (darkMode === "off") {
      return false
    }

    // Fall back to user preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }
}

function Header() {
  const icon = emoji[Math.floor(Math.random() * emoji.length)]

  const [dark, setDark] = useState(checkMode)

  // Set initial dark mode
  useLayoutEffect(() => {
    changeMode(checkMode(), false)
  }, [])

  // Subscribe to user OS dark/light mode preferences
  useEffect(() => {
    function handler(event) {
      setDark(event.matches)
      changeMode(event.matches, true)
    }

    const matcher = window.matchMedia("(prefers-color-scheme: dark)")

    matcher.addListener(handler)

    return () => {
      matcher.removeListener(handler)
    }
  })

  function handleDarkModeClick() {
    // Set state and presist change
    setDark(d => {
      changeMode(!d, true)

      return !d
    })
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
          onClick={handleDarkModeClick}
        >
          <div
            className={`DarkMode-track ${
              dark ? "on bg-purple-800" : "bg-gray-300"
            } absolute rounded-full h-6 w-10 left-0 right-0`}
          />
          <div
            className={`DarkMode-knob ${
              dark ? "on bg-purple-900" : "bg-cream resize"
            } rounded-full flex items-center justify-center shadow relative w-6 h-6`}
          >
            <Sun
              className={`${dark ? "hidden" : ""} text-yellow-500 fill-current`}
            />
            <Moon
              className={`${dark ? "" : "hidden"} text-purple-700 fill-current`}
            />
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header
