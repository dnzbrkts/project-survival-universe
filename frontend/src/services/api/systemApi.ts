import { BaseApi } from './baseApi'
import { ModuleDefinition } from '../../core/ModuleSystem'

interface SystemInfo {
  version: string
  environment: string
  uptime: number
  memoryUsage: {
    used: number
    total: number
  }
  activeConnections: number
}

interface ModuleConfig {
  [key: string]: any
}

class SystemApi extends BaseApi {
  /**
   * Sistem bilgilerini getirme
   */
  async getSystemInfo(): Promise<SystemInfo> {
    return this.get<SystemInfo>('/system/info')
  }

  /**
   * Sistem durumunu kontrol etme
   */
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'error'
    checks: Array<{
      name: string
      status: 'pass' | 'fail'
      message?: string
    }>
  }> {
    return this.get('/system/health')
  }

  /**
   * Tüm modülleri getirme
   */
  async getModules(): Promise<ModuleDefinition[]> {
    return this.get<ModuleDefinition[]>('/system/modules')
  }

  /**
   * Modül durumunu güncelleme
   */
  async updateModuleStatus(
    moduleCode: string, 
    status: ModuleDefinition['status']
  ): Promise<void> {
    return this.patch(`/system/modules/${moduleCode}/status`, { status })
  }

  /**
   * Modül konfigürasyonunu güncelleme
   */
  async updateModuleConfig(
    moduleCode: string, 
    config: ModuleConfig
  ): Promise<void> {
    return this.put(`/system/modules/${moduleCode}/config`, config)
  }

  /**
   * Modül konfigürasyonunu getirme
   */
  async getModuleConfig(moduleCode: string): Promise<ModuleConfig> {
    return this.get<ModuleConfig>(`/system/modules/${moduleCode}/config`)
  }

  /**
   * Sistem loglarını getirme
   */
  async getSystemLogs(params?: {
    level?: 'error' | 'warn' | 'info' | 'debug'
    module?: string
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }): Promise<{
    logs: Array<{
      id: number
      level: string
      message: string
      module?: string
      userId?: number
      timestamp: string
      metadata?: any
    }>
    total: number
  }> {
    return this.get('/system/logs', { params })
  }

  /**
   * Güvenlik loglarını getirme
   */
  async getSecurityLogs(params?: {
    eventType?: string
    userId?: number
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }): Promise<{
    logs: Array<{
      id: number
      eventType: string
      userId?: number
      ipAddress: string
      userAgent?: string
      success: boolean
      message?: string
      timestamp: string
    }>
    total: number
  }> {
    return this.get('/system/security-logs', { params })
  }

  /**
   * Performans metriklerini getirme
   */
  async getPerformanceMetrics(params?: {
    startDate?: string
    endDate?: string
    interval?: 'hour' | 'day' | 'week' | 'month'
  }): Promise<{
    metrics: Array<{
      timestamp: string
      cpuUsage: number
      memoryUsage: number
      responseTime: number
      requestCount: number
      errorCount: number
    }>
  }> {
    return this.get('/system/metrics', { params })
  }

  /**
   * Veritabanı backup oluşturma
   */
  async createBackup(): Promise<{
    backupId: string
    filename: string
    size: number
    createdAt: string
  }> {
    return this.post('/system/backup')
  }

  /**
   * Backup listesini getirme
   */
  async getBackups(): Promise<Array<{
    id: string
    filename: string
    size: number
    createdAt: string
    status: 'completed' | 'in_progress' | 'failed'
  }>> {
    return this.get('/system/backups')
  }

  /**
   * Backup geri yükleme
   */
  async restoreBackup(backupId: string): Promise<void> {
    return this.post(`/system/backups/${backupId}/restore`)
  }

  /**
   * Sistem konfigürasyonunu getirme
   */
  async getSystemConfig(): Promise<{
    [key: string]: any
  }> {
    return this.get('/system/config')
  }

  /**
   * Sistem konfigürasyonunu güncelleme
   */
  async updateSystemConfig(config: { [key: string]: any }): Promise<void> {
    return this.put('/system/config', config)
  }

  /**
   * Cache temizleme
   */
  async clearCache(cacheType?: 'all' | 'modules' | 'permissions' | 'sessions'): Promise<void> {
    return this.post('/system/cache/clear', { type: cacheType || 'all' })
  }

  /**
   * Sistem yeniden başlatma
   */
  async restartSystem(): Promise<void> {
    return this.post('/system/restart')
  }

  /**
   * Lisans bilgilerini getirme
   */
  async getLicenseInfo(): Promise<{
    licenseKey: string
    isValid: boolean
    expiresAt?: string
    features: string[]
    maxUsers: number
    currentUsers: number
  }> {
    return this.get('/system/license')
  }

  /**
   * Lisans güncelleme
   */
  async updateLicense(licenseKey: string): Promise<void> {
    return this.post('/system/license', { licenseKey })
  }
}

export const systemApi = new SystemApi()
export default systemApi