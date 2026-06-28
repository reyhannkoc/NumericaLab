import api from './api'
import type { OptimizationRequest, OptimizationResult } from '@/types/api.types'

export const optimizationService = {
  optimize: (req: OptimizationRequest) =>
    api.post<OptimizationResult>('/optimization/optimize', req).then((r) => r.data),

  compare: (req: Omit<OptimizationRequest, 'method'> & { methods: string[] }) =>
    api
      .post<Record<string, OptimizationResult>>('/optimization/compare', req)
      .then((r) => r.data),
}
