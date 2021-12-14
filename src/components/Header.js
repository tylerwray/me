import { Link } from "gatsby"
import React from "react"
import useColorMode from "../hooks/useColorMode"
import { IconMoon, IconSun } from "../icons"

const emoji = ["🙈", "🌀", "💻", "🤘🏻"]

function Header() {
  const icon = emoji[Math.floor(Math.random() * emoji.length)]

  const { toggle } = useColorMode()

  return (
    <header className="flex items-center justify-between py-4 max-w-3xl mx-auto px-6">
      <Link to="/" className="text-black dark:text-white no-underline">
        <span className="text-2xl" role="img" aria-label="emoji">
          {icon}
        </span>
        <span className="ml-4 text-2xl hidden sm:inline font-mono">
          Tyler Wray
        </span>
      </Link>
      <div className="flex justify-around items-center">
        <NavItem to="/">Posts</NavItem>
        <NavItem to="/me/">Me</NavItem>
        <NavItem to="/contact/">Contact</NavItem>
        <button
          type="button"
          aria-label="dark mode switch"
          className="relative m-3 w-8 focus:outline-none"
          onClick={toggle}
        >
          <div className="dark:bg-purple-600 bg-gray-300 absolute rounded-full h-6 w-10 left-0 right-0 transition duration-200" />
          <div className="dark:translate-x-4 dark:bg-purple-900 bg-gray-100 rounded-full flex items-center justify-center shadow relative w-6 h-6 transition duration-200">
            <IconSun className="dark:hidden stroke-amber-500 fill-amber-500" />
            <IconMoon className="dark:block hidden stroke-purple-600 fill-purple-600" />
          </div>
        </button>
      </div>
    </header>
  )
}

function NavItem({ to, children }) {
  const isActive = to === window.location.pathname

  return (
    <Link
      to={to}
      className={`group mx-2  text-lg no-underline relative ${
        isActive
          ? "text-black dark:text-white"
          : "text-gray-500 hover:text-black dark:hover:text-white dark:text-gray-400"
      }`}
    >
      {children}
      <span
        className={`h-0.5 left-0 -bottom-1 w-full block absolute ${
          isActive
            ? "bg-black dark:bg-white"
            : "scale-x-0 group-hover:scale-x-100 transition-transform origin-left group-hover:bg-black dark:group-hover:bg-white"
        }`}
      />
    </Link>
  )
}

// hover:
// background-color: currentColor;
// transform: scaleX(1);

// content: '';
// height: 2px;
// transform: scaleX(0);
// transition: transform 0.25s ease;
// transform-origin: left;
// left: 0;
// bottom: -4px;
// width: 100%;
// display: block;
// position: absolute;

export default Header
