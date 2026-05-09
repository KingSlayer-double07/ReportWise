import * as React from "react"

const MOBILE_BREAKPOINT = 768

const getIsMobile = () =>
  typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : undefined

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(getIsMobile)

  const onChange = React.useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  }, [])

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [onChange])

  return !!isMobile
}
