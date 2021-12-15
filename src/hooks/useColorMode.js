import useDarkMode from "use-dark-mode";

function useColorMode() {
  const darkMode = useDarkMode(false, {
    classNameDark: "dark",
    classNameLight: "light",
  });

  return {
    mode: darkMode.value ? "dark" : "light",
    toggle: darkMode.toggle,
  };
}

export default useColorMode;
