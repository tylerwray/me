import React from "react"
import ReactLogo from "../icons/ReactLogo"
import Lambda from "../icons/Lambda"
import Javascript from "./Javascript"

export function getIcon(icon) {
  const iconMap = {
    react: <ReactLogo className="w-5 h-5 mr-2" />,
    lambda: <Lambda className="w-5 h-5 mr-2 text-orange-500 fill-current" />,
    javascript: <Javascript className="w-5 h-5 mr-2 fill-current text-black" />
  }

  return iconMap[icon]
}
