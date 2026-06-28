import api from './api'
import type { ODERequest, ODEResult } from '@/types/api.types'

export const odeService = {
  solve: (req: ODERequest) =>
    api.post<ODEResult>('/ode/solve', req).then((r) => r.data),

  compare: (req: Omit<ODERequest, 'method'> & { methods: string[] }) =>
    api
      .post<Record<string, ODEResult>>('/ode/compare', req)
      .then((r) => r.data),
}
