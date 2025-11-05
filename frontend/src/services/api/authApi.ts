import { BaseApi } from './baseApi'

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  message: string
  user: {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    roles?: string[]
    permissions?: string[]
    allPermissions?: string[]
    roleCodes?: string[]
    roleNames?: string[]
  }
  tokens?: {
    accessToken: string
    refreshToken: string
    expiresIn: string
  }
  token?: string // Backward compatibility
}

interface UserPermissionsResponse {
  permissions: string[]
  roles: string[]
}

interface Permission {
  id: number
  code: string
  name: string
  description?: string
  category: string
  moduleCode?: string
}

interface Role {
  id: number
  code: string
  name: string
  description?: string
  permissions: string[]
}

class AuthApi extends BaseApi {
  /**
   * Kullanıcı girişi
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Backend'e identifier olarak gönder
    const payload = {
      identifier: credentials.username,
      password: credentials.password
    }
    return this.post<LoginResponse>('/auth/login', payload)
  }

  /**
   * Kullanıcı kaydı
   */
  async register(data: RegisterData): Promise<void> {
    return this.post('/auth/register', data)
  }

  /**
   * Token doğrulama
   */
  async verifyToken(): Promise<LoginResponse> {
    const response = await this.get<any>('/auth/verify')
    // Backend response formatını frontend formatına çevir
    return {
      success: response.success,
      message: response.message || 'Token doğrulandı',
      user: response.user,
      token: response.token || localStorage.getItem('token')
    }
  }

  /**
   * Kullanıcı çıkışı
   */
  async logout(): Promise<void> {
    return this.post('/auth/logout')
  }

  /**
   * Şifre değiştirme
   */
  async changePassword(data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<void> {
    return this.post('/auth/change-password', data)
  }

  /**
   * Şifre sıfırlama isteği
   */
  async requestPasswordReset(email: string): Promise<void> {
    return this.post('/auth/forgot-password', { email })
  }

  /**
   * Şifre sıfırlama
   */
  async resetPassword(data: {
    token: string
    password: string
    confirmPassword: string
  }): Promise<void> {
    return this.post('/auth/reset-password', data)
  }

  /**
   * Kullanıcı yetkilerini getirme
   */
  async getUserPermissions(userId: number): Promise<UserPermissionsResponse> {
    return this.get<UserPermissionsResponse>(`/auth/users/${userId}/permissions`)
  }

  /**
   * Tüm yetkileri getirme
   */
  async getAllPermissions(): Promise<Permission[]> {
    return this.get<Permission[]>('/auth/permissions')
  }

  /**
   * Tüm rolleri getirme
   */
  async getAllRoles(): Promise<Role[]> {
    return this.get<Role[]>('/auth/roles')
  }

  /**
   * Kullanıcı profili güncelleme
   */
  async updateProfile(data: {
    firstName: string
    lastName: string
    email: string
  }): Promise<void> {
    return this.put('/auth/profile', data)
  }

  /**
   * İki faktörlü kimlik doğrulama kurulumu
   */
  async setup2FA(): Promise<{
    qrCode: string
    secret: string
  }> {
    return this.post('/auth/2fa/setup')
  }

  /**
   * İki faktörlü kimlik doğrulama doğrulama
   */
  async verify2FA(token: string): Promise<void> {
    return this.post('/auth/2fa/verify', { token })
  }

  /**
   * İki faktörlü kimlik doğrulama devre dışı bırakma
   */
  async disable2FA(password: string): Promise<void> {
    return this.post('/auth/2fa/disable', { password })
  }
}

export const authApi = new AuthApi()
export default authApi