import { useState, useCallback } from 'react'
import type { APIError } from '@/types/api.types'

interface UseNumericalAPIState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseNumericalAPIReturn<TRequest, TResult> extends UseNumericalAPIState<TResult> {
  execute: (request: TRequest) => Promise<TResult | null>
  reset: () => void
}

/**
 * Generic hook for any backend numerical API call.
 * Handles loading, error, and result state uniformly.
 */
export function useNumericalAPI<TRequest, TResult>(
  apiFn: (req: TRequest) => Promise<TResult>,
): UseNumericalAPIReturn<TRequest, TResult> {
  const [state, setState] = useState<UseNumericalAPIState<TResult>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (request: TRequest): Promise<TResult | null> => {
      setState({ data: null, loading: true, error: null })
      try {
        const result = await apiFn(request)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (err: unknown) {
        const apiErr = err as { response?: { data?: APIError } }
        const message =
          apiErr?.response?.data?.detail
          ?? (err instanceof Error ? err.message : null)
          ?? 'An unexpected error occurred.'
        setState({ data: null, loading: false, error: message })
        return null
      }
    },
    [apiFn],
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return { ...state, execute, reset }
}
