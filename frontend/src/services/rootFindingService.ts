import api from './api'
import type {
  RootFindingRequest,
  RootFindingResult,
  ComparisonRequest,
  ComparisonResponse,
} from '@/types/api.types'

export const rootFindingService = {
  solve: (req: RootFindingRequest) =>
    api.post<RootFindingResult>('/root-finding/solve', req).then((r) => r.data),

  compare: (req: ComparisonRequest) =>
    api.post<ComparisonResponse>('/root-finding/compare', req).then((r) => r.data),

  getFunctionPlot: (expression: string, a: number, b: number, n = 300) =>
    api
      .get<{ x: number[]; y: number[] }>('/root-finding/plot', {
        params: { expression, a, b, n },
      })
      .then((r) => r.data),
}
