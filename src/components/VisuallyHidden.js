import React from "react";

const VisuallyHidden = ({ children, ...delegated }) => {
  const [forceShow, setForceShow] = React.useState(false);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const handleKeyDown = (ev) => {
      if (ev.key === "Alt") {
        setForceShow(true);
      }
    };

    const handleKeyUp = () => {
      setForceShow(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  if (forceShow) {
    return children;
  }

  return (
    <div
      className="absolute overflow-hidden h-1 w-1 -m-1 p-0 border-none"
      {...delegated}
    >
      {children}
    </div>
  );
};

export default VisuallyHidden;
