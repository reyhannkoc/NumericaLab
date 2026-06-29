import axios from 'axios'

// In development, Vite proxies /api → localhost:8000 (see vite.config.ts).
// In production, set VITE_API_BASE_URL to the full backend origin, e.g.:
//   VITE_API_BASE_URL=https://numericalab-api.onrender.com
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 90_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out — the backend may be waking up (free tier). Please try again in a few seconds.'))
    }
    const status = err.response?.status
    if (status === 422 || status === 400) {
      const detail = err.response.data?.detail
      const message = Array.isArray(detail)
        ? detail.map((d: { msg: string }) => d.msg).join(', ')
        : typeof detail === 'string' ? detail : 'Invalid input'
      return Promise.reject(new Error(message))
    }
    return Promise.reject(err)
  },
)

export default api
