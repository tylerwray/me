import { Link } from "gatsby"
import React from "react"
import useDarkMode from "use-dark-mode"
import Moon from "../icons/Moon"
import Sun from "../icons/Sun"

const emoji = ["🙈", "🌀", "💻", "🤘🏻"]

function Header() {
  const icon = emoji[Math.floor(Math.random() * emoji.length)]

  const darkMode = useDarkMode(false, {
    classNameDark: "dark",
    classNameLight: "light",
  })

  return (
    <header className="flex items-center justify-between py-4 max-w-3xl mx-auto px-6">
      <Link to="/" className="text-black dark:text-white no-underline">
        <span className="text-2xl" role="img" aria-label="emoji">
          {icon}
        </span>
        <span className="ml-2 text-lg hidden sm:inline">Tyler Wray</span>
      </Link>
      <div className="flex justify-around items-center">
        <NavItem to="/">Posts</NavItem>
        <NavItem to="/me/">Me</NavItem>
        <NavItem to="/contact/">Contact</NavItem>
        <button
          type="button"
          aria-label="dark mode switch"
          className="relative m-3 w-8 focus:outline-none"
          onClick={darkMode.toggle}
        >
          <div className="dark:bg-purple-600 bg-gray-300 absolute rounded-full h-6 w-10 left-0 right-0 transition duration-200" />
          <div className="transform dark:translate-x-4 dark:bg-purple-900 bg-gray-100 rounded-full flex items-center justify-center shadow relative w-6 h-6 transition duration-200">
            <Sun className="dark:hidden text-yellow-500 fill-current" />
            <Moon className="dark:block hidden text-purple-600 fill-current" />
          </div>
        </button>
      </div>
    </header>
  )
}

function NavItem({ to, children }) {
  return (
    <Link
      to={to}
      className="mx-2 hover:underline text-black dark:text-white text-lg no-underline"
      activeStyle={{ textDecoration: "underline" }}
    >
      {children}
    </Link>
  )
}

export default Header
