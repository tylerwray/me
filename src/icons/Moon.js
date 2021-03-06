import React from "react"

function Moon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 16, height: 16 }}
      className={className}
      viewBox="0 0 17 16"
    >
      <path
        fillRule="evenodd"
        d="M7.914 0a6.874 6.874 0 00-1.26 3.972c0 3.875 3.213 7.017 7.178 7.017.943 0 1.843-.178 2.668-.5C15.423 13.688 12.34 16 8.704 16 4.174 16 .5 12.41.5 7.982.5 3.814 3.754.389 7.914 0z"
      />
    </svg>
  )
}

export default Moon
