import api from './api'
import type { FloatingPointRequest, FloatingPointResult } from '@/types/api.types'

export const floatingPointService = {
  analyze: (req: FloatingPointRequest) =>
    api.post<FloatingPointResult>('/floating-point/analyze', req).then((r) => r.data),

  getMachineEpsilon: () =>
    api.get<{ float32: number; float64: number }>('/floating-point/machine-epsilon').then((r) => r.data),

  demonstrateCancellation: (a: number, b: number) =>
    api
      .post<FloatingPointResult['catastrophic_cancellation_demo']>(
        '/floating-point/cancellation',
        { a, b },
      )
      .then((r) => r.data),
}
