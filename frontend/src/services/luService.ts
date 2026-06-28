import api from './api'
import type { LURequest, LUResult } from '@/types/api.types'

export const luService = {
  decompose: (req: LURequest) =>
    api.post<LUResult>('/lu/decompose', req).then((r) => r.data),

  solve: (req: LURequest & { b: number[] }) =>
    api.post<{ solution: number[]; steps: LUResult['steps'] }>('/lu/solve', req).then((r) => r.data),
}
