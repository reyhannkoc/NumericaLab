import api from './api'
import type { LinearSystemRequest, LinearSystemResult } from '@/types/api.types'

export const linearSystemsService = {
  solve: (req: LinearSystemRequest) =>
    api.post<LinearSystemResult>('/linear-systems/solve', req).then((r) => r.data),

  compare: (req: Omit<LinearSystemRequest, 'method'> & { methods: string[] }) =>
    api
      .post<Record<string, LinearSystemResult>>('/linear-systems/compare', req)
      .then((r) => r.data),
}
