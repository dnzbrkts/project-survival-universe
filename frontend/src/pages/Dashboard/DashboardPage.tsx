import React, { useEffect } from 'react'
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
} from '@mui/icons-material'

import { RootState } from '../../store'
import { setPageInfo } from '../../store/slices/uiSlice'
import { refreshSystemInfo } from '../../store/slices/appSlice'

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { systemInfo } = useSelector((state: RootState) => state.app)
  const { activeModules } = useSelector((state: RootState) => state.modules)

  useEffect(() => {
    dispatch(setPageInfo({
      title: 'Dashboard',
      subtitle: 'Sistem genel durumu ve özet bilgiler'
    }))

    // Sistem bilgilerini yenile
    dispatch(refreshSystemInfo() as any)
  }, [dispatch])

  // Örnek veriler (gerçek uygulamada API'den gelecek)
  const stats = [
    {
      title: 'Toplam Ürün',
      value: '1,234',
      change: '+12%',
      icon: <Inventory />,
      color: 'primary',
    },
    {
      title: 'Aktif Müşteri',
      value: '567',
      change: '+8%',
      icon: <People />,
      color: 'success',
    },
    {
      title: 'Bu Ay Fatura',
      value: '89',
      change: '+15%',
      icon: <Receipt />,
      color: 'info',
    },
    {
      title: 'Kritik Stok',
      value: '23',
      change: '-5%',
      icon: <Warning />,
      color: 'warning',
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'Yeni fatura oluşturuldu',
      description: 'FAT-2024-001 numaralı fatura',
      time: '5 dakika önce',
      type: 'success',
    },
    {
      id: 2,
      title: 'Stok uyarısı',
      description: 'Ürün A kritik seviyede',
      time: '15 dakika önce',
      type: 'warning',
    },
    {
      id: 3,
      title: 'Yeni müşteri kaydı',
      description: 'ABC Şirketi sisteme eklendi',
      time: '1 saat önce',
      type: 'info',
    },
    {
      id: 4,
      title: 'Servis talebi tamamlandı',
      description: 'SRV-2024-015 numaralı talep',
      time: '2 saat önce',
      type: 'success',
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="success" />
      case 'warning':
        return <Warning color="warning" />
      case 'error':
        return <Error color="error" />
      default:
        return <DashboardIcon color="primary" />
    }
  }

  return (
    <Box>
      {/* Hoş Geldin Mesajı */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Hoş geldin, {user?.firstName}! 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            İşletme yönetim sisteminizin genel durumunu buradan takip edebilirsiniz.
          </Typography>
        </CardContent>
      </Card>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}.main`,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={stat.change}
                  size="small"
                  color={stat.change.startsWith('+') ? 'success' : 'error'}
                  icon={<TrendingUp />}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Sistem Durumu */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sistem Durumu
              </Typography>
              
              {systemInfo && (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Toplam Modül: {systemInfo.totalModules}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(systemInfo.activeModules / systemInfo.totalModules) * 100}
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {systemInfo.activeModules} aktif modül
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Yüklü Bileşen: {systemInfo.loadedComponents}
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
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Son Aktiviteler */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Son Aktiviteler
              </Typography>
              
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {activity.description}
                            </Typography>
                            <br />
                            <Typography component="span" variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage