import axios from 'axios'

// In development, Vite proxies /api → localhost:8000 (see vite.config.ts).
// In production, set VITE_API_BASE_URL to the full backend origin, e.g.:
//   VITE_API_BASE_URL=https://numericalab-api.onrender.com
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'

const api = axios.create({
  baseURL: BASE_URL,
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
