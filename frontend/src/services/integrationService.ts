import api from './api'
import type { IntegrationRequest, IntegrationResult } from '@/types/api.types'

export const integrationService = {
  integrate: (req: IntegrationRequest) =>
    api.post<IntegrationResult>('/integration/compute', req).then((r) => r.data),

  compare: (req: Omit<IntegrationRequest, 'method'> & { methods: string[] }) =>
    api
      .post<Record<string, IntegrationResult>>('/integration/compare', req)
      .then((r) => r.data),
}
