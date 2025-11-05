import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { dashboardApi, DashboardData, DashboardStats, RecentActivity, QuickAccessItem } from '../../services/api/dashboardApi'

interface DashboardState {
  data: DashboardData | null
  stats: DashboardStats | null
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
  salesPerformance: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string
      borderColor?: string
    }>
  } | null
  stockStatus: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor: string[]
    }>
  } | null
  revenueTrend: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      fill: boolean
    }>
  } | null
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: DashboardState = {
  data: null,
  stats: null,
  recentActivities: [],
  quickAccess: [],
  criticalStockItems: [],
  upcomingTasks: [],
  salesPerformance: null,
  stockStatus: null,
  revenueTrend: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
}

// Async Thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardApi.getDashboardData()
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Dashboard verileri yüklenirken hata oluştu')
    }
  }
)

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await dashboardApi.getDashboardStats()
      return stats
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'İstatistikler yüklenirken hata oluştu')
    }
  }
)

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const activities = await dashboardApi.getRecentActivities(limit)
      return activities
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Son aktiviteler yüklenirken hata oluştu')
    }
  }
)

export const fetchQuickAccessItems = createAsyncThunk(
  'dashboard/fetchQuickAccessItems',
  async (_, { rejectWithValue }) => {
    try {
      const items = await dashboardApi.getQuickAccessItems()
      return items
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Hızlı erişim öğeleri yüklenirken hata oluştu')
    }
  }
)

export const fetchCriticalStockItems = createAsyncThunk(
  'dashboard/fetchCriticalStockItems',
  async (_, { rejectWithValue }) => {
    try {
      const items = await dashboardApi.getCriticalStockItems()
      return items
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kritik stok öğeleri yüklenirken hata oluştu')
    }
  }
)

export const fetchSalesPerformance = createAsyncThunk(
  'dashboard/fetchSalesPerformance',
  async (period: 'week' | 'month' | 'quarter' | 'year' = 'month', { rejectWithValue }) => {
    try {
      const data = await dashboardApi.getSalesPerformance(period)
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Satış performans verileri yüklenirken hata oluştu')
    }
  }
)

export const fetchStockStatus = createAsyncThunk(
  'dashboard/fetchStockStatus',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardApi.getStockStatus()
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Stok durumu verileri yüklenirken hata oluştu')
    }
  }
)

export const fetchRevenueTrend = createAsyncThunk(
  'dashboard/fetchRevenueTrend',
  async (months: number = 12, { rejectWithValue }) => {
    try {
      const data = await dashboardApi.getRevenueTrend(months)
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Gelir trendi verileri yüklenirken hata oluştu')
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.data = null
      state.stats = null
      state.recentActivities = []
      state.quickAccess = []
      state.criticalStockItems = []
      state.upcomingTasks = []
      state.salesPerformance = null
      state.stockStatus = null
      state.revenueTrend = null
      state.error = null
      state.lastUpdated = null
    },
    clearDashboardError: (state) => {
      state.error = null
    },
    updateLastRefresh: (state) => {
      state.lastUpdated = new Date().toISOString()
    },
  },
  extraReducers: (builder) => {
    // Fetch Dashboard Data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<DashboardData>) => {
        state.isLoading = false
        state.data = action.payload
        state.stats = action.payload.stats
        state.recentActivities = action.payload.recentActivities
        state.quickAccess = action.payload.quickAccess
        state.criticalStockItems = action.payload.criticalStockItems
        state.upcomingTasks = action.payload.upcomingTasks
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
        state.isLoading = false
        state.stats = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Recent Activities
    builder
      .addCase(fetchRecentActivities.fulfilled, (state, action: PayloadAction<RecentActivity[]>) => {
        state.recentActivities = action.payload
      })

    // Fetch Quick Access Items
    builder
      .addCase(fetchQuickAccessItems.fulfilled, (state, action: PayloadAction<QuickAccessItem[]>) => {
        state.quickAccess = action.payload
      })

    // Fetch Critical Stock Items
    builder
      .addCase(fetchCriticalStockItems.fulfilled, (state, action) => {
        state.criticalStockItems = action.payload
      })

    // Fetch Sales Performance
    builder
      .addCase(fetchSalesPerformance.fulfilled, (state, action) => {
        state.salesPerformance = action.payload
      })

    // Fetch Stock Status
    builder
      .addCase(fetchStockStatus.fulfilled, (state, action) => {
        state.stockStatus = action.payload
      })

    // Fetch Revenue Trend
    builder
      .addCase(fetchRevenueTrend.fulfilled, (state, action) => {
        state.revenueTrend = action.payload
      })
  },
})

export const { clearDashboardData, clearDashboardError, updateLastRefresh } = dashboardSlice.actions
export default dashboardSlice.reducer