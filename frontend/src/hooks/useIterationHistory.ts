import { useState, useCallback } from 'react'

/**
 * Tracks per-iteration snapshots from any numerical algorithm result.
 * Used by AlgorithmStepper and IterationTable to highlight the current step.
 */
export function useIterationHistory<T>(items: T[]) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, items.length - 1)))
  }, [items.length])

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1))
  }, [items.length])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const reset = useCallback(() => setCurrentIndex(0), [])

  return {
    currentIndex,
    currentItem: items[currentIndex] ?? null,
    isFirst: currentIndex === 0,
    isLast: currentIndex === items.length - 1,
    goTo,
    next,
    prev,
    reset,
    total: items.length,
  }
}
