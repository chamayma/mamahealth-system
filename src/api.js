import axios from 'axios'

const API = axios.create({
  // baseURL: 'http://localhost:8080/api/v1',
  baseURL: 'https://mamahealth-backend.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach auth token if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Global response interceptor for handling auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, clear and redirect to login
      localStorage.clear()
      // Use Vite's BASE_URL to correctly redirect on GitHub Pages (e.g. /mamahealth-system/login)
      const baseUrl = import.meta.env.BASE_URL || '/'
      window.location.href = baseUrl.endsWith('/') ? baseUrl + 'login' : baseUrl + '/login'
    }
    return Promise.reject(error)
  }
)

export default API
