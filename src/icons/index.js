import React from "react"
import ReactIcon from "./ReactLogo"
import Lambda from "./Lambda"
import Javascript from "./Javascript"
import Elixir from "./Elixir"

export function getIcon(icon) {
  const iconMap = {
    react: <ReactIcon className="w-5 h-5 mr-2 mt-1" />,
    lambda: (
      <Lambda className="w-5 h-5 mr-2 mt-1 text-orange-500 fill-current" />
    ),
    javascript: (
      <Javascript className="w-5 h-5 mr-2 mt-1 fill-current text-black" />
    ),
    elixir: (
      <Elixir className="w-5 h-5 mr-2 mt-1 mb-0 rounded dark:bg-purple-400" />
    ),
  }

  return iconMap[icon]
}
