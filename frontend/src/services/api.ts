import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 422) {
      const detail = err.response.data?.detail
      const message = Array.isArray(detail)
        ? detail.map((d: { msg: string }) => d.msg).join(', ')
        : detail ?? 'Validation error'
      return Promise.reject(new Error(message))
    }
    return Promise.reject(err)
  },
)

export default api
