import { useMemo } from 'react'
import type { PlotSeries } from '@/types/numerical.types'

/**
 * Generates x/y plot series for a mathematical expression over a range.
 * The function string is evaluated via the backend — this hook manages
 * the client-side shape of plot data for Plotly.
 */
export function usePlotData(series: PlotSeries[]) {
  return useMemo(
    () =>
      series.map((s) => ({
        x: s.x,
        y: s.y,
        name: s.name,
        type: 'scatter' as const,
        mode: s.mode,
        line: s.dash ? { dash: s.dash, width: s.width ?? 2, color: s.color } : { width: s.width ?? 2, color: s.color },
        marker: { color: s.color, size: 6 },
      })),
    [series],
  )
}

/** Generates a linspace array (inclusive) */
export function linspace(start: number, end: number, n: number): number[] {
  if (n <= 1) return [start]
  const step = (end - start) / (n - 1)
  return Array.from({ length: n }, (_, i) => start + i * step)
}
