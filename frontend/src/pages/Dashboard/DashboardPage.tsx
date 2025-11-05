import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  IconButton,
  Skeleton,
  Alert,
  AlertTitle,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  Inventory,
  People,
  Receipt,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Settings,
  Build,
  Assessment,
  ShoppingCart,
  AccountBalance,
} from '@mui/icons-material'

import { RootState } from '../../store'
import { setPageInfo } from '../../store/slices/uiSlice'
import { refreshSystemInfo } from '../../store/slices/appSlice'
import {
  fetchDashboardData,
  fetchDashboardStats,
  fetchRecentActivities,
  fetchQuickAccessItems,
  fetchCriticalStockItems,
} from '../../store/slices/dashboardSlice'

// Dashboard Components
import StatsCard from '../../components/Dashboard/StatsCard'
import QuickAccessCard from '../../components/Dashboard/QuickAccessCard'
import RecentActivitiesList from '../../components/Dashboard/RecentActivitiesList'
import CriticalStockAlert from '../../components/Dashboard/CriticalStockAlert'
import CriticalStockNotification from '../../components/Inventory/CriticalStockNotification'

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { systemInfo } = useSelector((state: RootState) => state.app)
  const { activeModules } = useSelector((state: RootState) => state.modules)
  const {
    stats,
    recentActivities,
    quickAccess,
    criticalStockItems,
    isLoading,
    error,
    lastUpdated,
  } = useSelector((state: RootState) => state.dashboard)

  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    dispatch(setPageInfo({
      title: 'Dashboard',
      subtitle: 'Sistem genel durumu ve özet bilgiler'
    }))

    // Dashboard verilerini yükle
    loadDashboardData()
  }, [dispatch])

  const loadDashboardData = async () => {
    try {
      setRefreshing(true)
      await Promise.all([
        dispatch(fetchDashboardStats() as any),
        dispatch(fetchRecentActivities(10) as any),
        dispatch(fetchQuickAccessItems() as any),
        dispatch(fetchCriticalStockItems() as any),
        dispatch(refreshSystemInfo() as any),
      ])
    } finally {
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadDashboardData()
  }

  // Fallback veriler (API'den veri gelmezse)
  const fallbackStats = [
    {
      title: 'Toplam Ürün',
      value: stats?.totalProducts || 0,
      change: { value: 12, percentage: '+12%', trend: 'up' as const },
      icon: <Inventory />,
      color: 'primary' as const,
    },
    {
      title: 'Aktif Müşteri',
      value: stats?.totalCustomers || 0,
      change: { value: 8, percentage: '+8%', trend: 'up' as const },
      icon: <People />,
      color: 'success' as const,
    },
    {
      title: 'Bu Ay Fatura',
      value: stats?.monthlyInvoices || 0,
      change: { value: 15, percentage: '+15%', trend: 'up' as const },
      icon: <Receipt />,
      color: 'info' as const,
    },
    {
      title: 'Kritik Stok',
      value: stats?.criticalStock || 0,
      change: { value: -5, percentage: '-5%', trend: 'down' as const },
      icon: <Warning />,
      color: 'warning' as const,
    },
  ]

  // Fallback hızlı erişim öğeleri
  const fallbackQuickAccess = [
    {
      id: 'inventory',
      title: 'Stok Yönetimi',
      description: 'Ürün ve stok işlemleri',
      icon: 'inventory',
      path: '/modules/inventory',
      color: '#2196F3',
      moduleCode: 'INVENTORY',
    },
    {
      id: 'customers',
      title: 'Müşteri Yönetimi',
      description: 'Müşteri ve cari hesaplar',
      icon: 'people',
      path: '/modules/customers',
      color: '#4CAF50',
      moduleCode: 'CUSTOMERS',
    },
    {
      id: 'invoices',
      title: 'Fatura İşlemleri',
      description: 'Satış ve alış faturaları',
      icon: 'receipt',
      path: '/modules/invoices',
      color: '#FF9800',
      moduleCode: 'INVOICES',
    },
    {
      id: 'services',
      title: 'Servis Yönetimi',
      description: 'Servis talepleri ve takip',
      icon: 'build',
      path: '/modules/services',
      color: '#9C27B0',
      moduleCode: 'SERVICES',
    },
    {
      id: 'reports',
      title: 'Raporlar',
      description: 'Analitik ve raporlama',
      icon: 'assessment',
      path: '/modules/reports',
      color: '#607D8B',
      moduleCode: 'REPORTS',
    },
    {
      id: 'pos',
      title: 'POS Sistemi',
      description: 'Satış noktası işlemleri',
      icon: 'shopping_cart',
      path: '/modules/pos',
      color: '#E91E63',
      moduleCode: 'POS',
    },
  ]

  return (
    <Box>
      {/* Kritik Stok Uyarısı */}
      <CriticalStockNotification />

      {/* Hata Durumu */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch({ type: 'dashboard/clearDashboardError' })}>
          <AlertTitle>Hata</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Hoş Geldin Mesajı */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Hoş geldin, {user?.firstName || 'Kullanıcı'}! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                İşletme yönetim sisteminizin genel durumunu buradan takip edebilirsiniz.
              </Typography>
              {lastUpdated && (
                <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                  Son güncelleme: {new Date(lastUpdated).toLocaleString('tr-TR')}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ color: 'white' }}
            >
              <Refresh />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {fallbackStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
              loading={isLoading || refreshing}
            />
          </Grid>
        ))}
      </Grid>

      {/* Hızlı Erişim */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Hızlı Erişim
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {(quickAccess.length > 0 ? quickAccess : fallbackQuickAccess).slice(0, 6).map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={item.id}>
            <QuickAccessCard item={item} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Sistem Durumu */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Sistem Durumu
                </Typography>
                <IconButton size="small" onClick={handleRefresh} disabled={refreshing}>
                  <Refresh />
                </IconButton>
              </Box>
              
              {systemInfo ? (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Toplam Modül: {systemInfo.totalModules || activeModules.length}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={((systemInfo.activeModules || activeModules.length) / (systemInfo.totalModules || activeModules.length || 1)) * 100}
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {systemInfo.activeModules || activeModules.length} aktif modül
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Yüklü Bileşen: {systemInfo.loadedComponents || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {activeModules.slice(0, 5).map((module) => (
                      <Chip
                        key={module.code}
                        label={module.name}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {activeModules.length > 5 && (
                      <Chip
                        label={`+${activeModules.length - 5} daha`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="rectangular" height={6} sx={{ my: 1 }} />
                  <Skeleton variant="text" width="40%" />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Son Aktiviteler */}
        <Grid item xs={12} md={6} lg={4}>
          <RecentActivitiesList
            activities={recentActivities}
            loading={isLoading || refreshing}
            onRefresh={handleRefresh}
            maxItems={5}
          />
        </Grid>

        {/* Kritik Stok Uyarıları */}
        <Grid item xs={12} md={12} lg={4}>
          <CriticalStockAlert
            items={criticalStockItems}
            loading={isLoading || refreshing}
            onRefresh={handleRefresh}
            maxItems={5}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage