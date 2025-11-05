import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '../../store'
import { logout } from '../../store/slices/authSlice'
import { addNotification } from '../../store/slices/uiSlice'

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Axios instance oluştur
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Token ekleme
apiClient.interceptors.request.use(
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

// Response interceptor - Hata yönetimi
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    const { response } = error

    if (response) {
      const { status, data } = response

      switch (status) {
        case 401:
          // Unauthorized - Token geçersiz
          store.dispatch(logout())
          store.dispatch(addNotification({
            type: 'error',
            title: 'Oturum Süresi Doldu',
            message: 'Lütfen tekrar giriş yapın.',
          }))
          break

        case 403:
          // Forbidden - Yetki yok
          store.dispatch(addNotification({
            type: 'error',
            title: 'Erişim Engellendi',
            message: 'Bu işlem için yetkiniz bulunmuyor.',
          }))
          break

        case 404:
          // Not Found
          store.dispatch(addNotification({
            type: 'error',
            title: 'Bulunamadı',
            message: 'İstenen kaynak bulunamadı.',
          }))
          break

        case 422:
          // Validation Error
          const validationErrors = data.errors || {}
          const errorMessages = Object.values(validationErrors).flat()
          store.dispatch(addNotification({
            type: 'error',
            title: 'Doğrulama Hatası',
            message: errorMessages.join(', '),
          }))
          break

        case 500:
          // Server Error
          store.dispatch(addNotification({
            type: 'error',
            title: 'Sunucu Hatası',
            message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
          }))
          break

        default:
          // Diğer hatalar
          store.dispatch(addNotification({
            type: 'error',
            title: 'Hata',
            message: data.message || 'Beklenmeyen bir hata oluştu.',
          }))
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      store.dispatch(addNotification({
        type: 'error',
        title: 'Zaman Aşımı',
        message: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
      }))
    } else {
      // Network Error
      store.dispatch(addNotification({
        type: 'error',
        title: 'Bağlantı Hatası',
        message: 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.',
      }))
    }

    return Promise.reject(error)
  }
)

// Base API class
export class BaseApi {
  protected client = apiClient

  protected async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  protected async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  protected async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  protected async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  protected async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export { apiClient }
export default BaseApi