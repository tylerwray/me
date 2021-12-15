import React, { useEffect } from "react";
import useColorModeValue from "../hooks/useColorModeValue";

const COMMENTS_ID = "comments-container";

const Comments = () => {
  const theme = useColorModeValue({
    dark: "github-dark",
    light: "github-light",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "tylerwray/me");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("crossorigin", "anonymous");
    script.setAttribute("theme", theme);

    script.async = true;

    const comments = document.getElementById(COMMENTS_ID);
    if (comments) comments.appendChild(script);

    // This function will get called when the component unmounts
    // To make sure we don't end up with multiple instances of the comments component
    return () => {
      const comments = document.getElementById(COMMENTS_ID);
      if (comments) comments.innerHTML = "";
    };
  }, [theme]);

  return <div id={COMMENTS_ID} />;
};

export default Comments;
