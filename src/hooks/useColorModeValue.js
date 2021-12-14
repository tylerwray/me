import useColorMode from "./useColorMode"

function useColorModeValue({ dark, light }) {
  const { mode } = useColorMode()

  if (mode === "dark") return dark

  return light
}

export default useColorModeValue
