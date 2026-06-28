import api from './api'
import type { InterpolationRequest, InterpolationResult } from '@/types/api.types'

export const interpolationService = {
  interpolate: (req: InterpolationRequest) =>
    api.post<InterpolationResult>('/interpolation/compute', req).then((r) => r.data),

  compare: (req: Omit<InterpolationRequest, 'method'>) =>
    api
      .post<Record<string, InterpolationResult>>('/interpolation/compare', req)
      .then((r) => r.data),
}
