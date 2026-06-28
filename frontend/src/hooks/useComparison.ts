import { useState, useCallback } from 'react'

interface UseComparisonOptions<T> {
  methods: string[]
  fetchFn: (method: string) => Promise<T>
}

interface UseComparisonReturn<T> {
  results: Record<string, T | null>
  loading: Record<string, boolean>
  errors: Record<string, string | null>
  runAll: () => Promise<void>
  runOne: (method: string) => Promise<void>
  clear: () => void
}

/**
 * Runs the same numerical problem across multiple methods in parallel
 * and collects results for comparison rendering.
 */
export function useComparison<T>({
  methods,
  fetchFn,
}: UseComparisonOptions<T>): UseComparisonReturn<T> {
  const [results, setResults] = useState<Record<string, T | null>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const runOne = useCallback(
    async (method: string) => {
      setLoading((prev) => ({ ...prev, [method]: true }))
      setErrors((prev) => ({ ...prev, [method]: null }))
      try {
        const result = await fetchFn(method)
        setResults((prev) => ({ ...prev, [method]: result }))
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? 'Error'
        setErrors((prev) => ({ ...prev, [method]: msg }))
        setResults((prev) => ({ ...prev, [method]: null }))
      } finally {
        setLoading((prev) => ({ ...prev, [method]: false }))
      }
    },
    [fetchFn],
  )

  const runAll = useCallback(async () => {
    await Promise.all(methods.map((m) => runOne(m)))
  }, [methods, runOne])

  const clear = useCallback(() => {
    setResults({})
    setLoading({})
    setErrors({})
  }, [])

  return { results, loading, errors, runAll, runOne, clear }
}
