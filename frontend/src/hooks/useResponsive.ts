import { useEffect, useState } from 'react'

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

type Breakpoint = keyof typeof BREAKPOINTS

export function useResponsive() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  )

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const above = (bp: Breakpoint) => width >= BREAKPOINTS[bp]
  const below = (bp: Breakpoint) => width < BREAKPOINTS[bp]

  return {
    width,
    isMobile: below('md'),
    isTablet: above('md') && below('lg'),
    isDesktop: above('lg'),
    above,
    below,
  }
}
