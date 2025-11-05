import { BaseApi } from './baseApi'

export interface DashboardStats {
  totalProducts: number
  totalCustomers: number
  monthlyInvoices: number
  criticalStock: number
  totalRevenue: number
  monthlyRevenue: number
  pendingServices: number
  completedServices: number
}

export interface RecentActivity {
  id: number
  type: 'invoice' | 'stock' | 'customer' | 'service' | 'payment'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
  relatedId?: number
  amount?: number
  currency?: string
}

export interface QuickAccessItem {
  id: string
  title: string
  description: string
  icon: string
  path: string
  color: string
  permission?: string
  moduleCode?: string
}

export interface DashboardData {
  stats: DashboardStats
  recentActivities: RecentActivity[]
  quickAccess: QuickAccessItem[]
  criticalStockItems: Array<{
    id: number
    productCode: string
    productName: string
    currentStock: number
    criticalLevel: number
    unit: string
  }>
  upcomingTasks: Array<{
    id: number
    title: string
    description: string
    dueDate: string
    priority: 'low' | 'medium' | 'high'
    type: string
  }>
}

class DashboardApi extends BaseApi {
  /**
   * Dashboard ana verilerini getirme
   */
  async getDashboardData(): Promise<DashboardData> {
    return this.get<DashboardData>('/dashboard')
  }

  /**
   * Dashboard istatistiklerini getirme
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return this.get<DashboardStats>('/dashboard/stats')
  }

  /**
   * Son aktiviteleri getirme
   */
  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    return this.get<RecentActivity[]>('/dashboard/activities', {
      params: { limit }
    })
  }

  /**
   * Hızlı erişim öğelerini getirme
   */
  async getQuickAccessItems(): Promise<QuickAccessItem[]> {
    return this.get<QuickAccessItem[]>('/dashboard/quick-access')
  }

  /**
   * Kritik stok öğelerini getirme
   */
  async getCriticalStockItems(): Promise<Array<{
    id: number
    productCode: string
    productName: string
    currentStock: number
    criticalLevel: number
    unit: string
  }>> {
    return this.get('/dashboard/critical-stock')
  }

  /**
   * Yaklaşan görevleri getirme
   */
  async getUpcomingTasks(): Promise<Array<{
    id: number
    title: string
    description: string
    dueDate: string
    priority: 'low' | 'medium' | 'high'
    type: string
  }>> {
    return this.get('/dashboard/upcoming-tasks')
  }

  /**
   * Satış performans verilerini getirme
   */
  async getSalesPerformance(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<{
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string
      borderColor?: string
    }>
  }> {
    return this.get('/dashboard/sales-performance', {
      params: { period }
    })
  }

  /**
   * Stok durumu grafiği verilerini getirme
   */
  async getStockStatus(): Promise<{
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor: string[]
    }>
  }> {
    return this.get('/dashboard/stock-status')
  }

  /**
   * Müşteri dağılımı verilerini getirme
   */
  async getCustomerDistribution(): Promise<{
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor: string[]
    }>
  }> {
    return this.get('/dashboard/customer-distribution')
  }

  /**
   * Aylık gelir trendi verilerini getirme
   */
  async getRevenueTrend(months: number = 12): Promise<{
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      fill: boolean
    }>
  }> {
    return this.get('/dashboard/revenue-trend', {
      params: { months }
    })
  }
}

export const dashboardApi = new DashboardApi()
export default dashboardApi