import axios from 'axios'

const api = axios.create({
  // baseURL: 'http://localhost:5000',
  baseURL: 'https://mpp-server-rose.vercel.app/',
})

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error('API ERROR:', error)
    console.error('Response:', error?.response)
    console.error('Data:', error?.response?.data)

    // Only logout if token exists AND request is NOT login request
    const isLoginRequest =
      error.config?.url?.includes('/api/auth/login')

    if (
      error.response?.status === 401 &&
      !isLoginRequest
    ) {
      console.warn('Session expired. Logging out...')

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // use navigate in app instead of reload redirect
      // window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api