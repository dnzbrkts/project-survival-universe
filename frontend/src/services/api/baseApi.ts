import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

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
          localStorage.removeItem('token')
          window.location.href = '/login'
          break

        case 403:
          // Forbidden - Yetki yok
          console.error('Erişim engellendi:', data.message)
          break

        case 404:
          // Not Found
          console.error('Kaynak bulunamadı:', data.message)
          break

        case 422:
          // Validation Error
          console.error('Doğrulama hatası:', data.errors)
          break

        case 500:
          // Server Error
          console.error('Sunucu hatası:', data.message)
          break

        default:
          // Diğer hatalar
          console.error('API hatası:', data.message || 'Beklenmeyen bir hata oluştu.')
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('İstek zaman aşımına uğradı')
    } else {
      // Network Error
      console.error('Bağlantı hatası:', error.message)
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