import api from './api'
import type { BenchmarkRequest, BenchmarkResponse } from '@/types/api.types'

export const performanceService = {
  benchmark: (req: BenchmarkRequest) =>
    api.post<BenchmarkResponse>('/performance/benchmark', req).then((r) => r.data),

  getComplexityData: (problem_type: string) =>
    api
      .get<{ n_values: number[]; times: Record<string, number[]> }>(
        '/performance/complexity',
        { params: { problem_type } },
      )
      .then((r) => r.data),
}
