import api from './api'
import type { DifferentiationRequest, DifferentiationResult } from '@/types/api.types'

export const differentiationService = {
  differentiate: (req: DifferentiationRequest) =>
    api.post<DifferentiationResult>('/differentiation/compute', req).then((r) => r.data),

  errorVsH: (expression: string, x_point: number) =>
    api
      .get<{ h_values: number[]; errors: Record<string, number[]> }>('/differentiation/error-vs-h', {
        params: { expression, x_point },
      })
      .then((r) => r.data),
}
