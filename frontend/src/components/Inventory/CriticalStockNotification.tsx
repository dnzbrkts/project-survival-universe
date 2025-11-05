import React, { useEffect, useState } from 'react'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider
} from '@mui/material'
import {
  Warning,
  Close,
  ExpandMore,
  ExpandLess,
  Inventory,
  Refresh
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchCriticalStockAlerts } from '../../store/slices/inventorySlice'

interface CriticalStockNotificationProps {
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}

const CriticalStockNotification: React.FC<CriticalStockNotificationProps> = ({
  autoRefresh = true,
  refreshInterval = 300000 // 5 minutes
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    criticalStockAlerts,
    criticalStockCount,
    criticalStockLoading,
    criticalStockError
  } = useSelector((state: RootState) => state.inventory)

  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Initial fetch
    dispatch(fetchCriticalStockAlerts())

    // Set up auto refresh
    if (autoRefresh) {
      const interval = setInterval(() => {
        dispatch(fetchCriticalStockAlerts())
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [dispatch, autoRefresh, refreshInterval])

  const handleRefresh = () => {
    dispatch(fetchCriticalStockAlerts())
  }

  const handleToggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handleDismiss = () => {
    setDismissed(true)
  }

  // Don't show if dismissed, no alerts, or error
  if (dismissed || criticalStockCount === 0 || criticalStockError) {
    return null
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity="warning"
        icon={<Warning />}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleRefresh}
              disabled={criticalStockLoading}
              title="Yenile"
            >
              <Refresh />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleToggleExpanded}
              title={expanded ? 'Daralt' : 'Genişlet'}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDismiss}
              title="Kapat"
            >
              <Close />
            </IconButton>
          </Box>
        }
      >
        <AlertTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Kritik Stok Uyarısı
            <Chip 
              label={`${criticalStockCount} ürün`} 
              size="small" 
              color="warning" 
              variant="outlined"
            />
          </Box>
        </AlertTitle>
        
        <Typography variant="body2">
          {criticalStockCount} ürün kritik stok seviyesinde veya altında. 
          Stok yenileme işlemi yapmanız önerilir.
        </Typography>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Kritik Stok Ürünleri:
            </Typography>
            
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {criticalStockAlerts.map((alert, index) => (
                <ListItem key={`${alert.productId}-${index}`} divider>
                  <ListItemIcon>
                    <Inventory color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {alert.productName}
                        </Typography>
                        <Chip 
                          label={alert.productCode} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Mevcut: {alert.currentStock} {alert.unit} | 
                          Kritik Seviye: {alert.criticalStockLevel} {alert.unit}
                        </Typography>
                        {alert.category && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            | Kategori: {alert.category}
                          </Typography>
                        )}
                        {alert.lastMovementDate && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Son Hareket: {new Date(alert.lastMovementDate).toLocaleDateString('tr-TR')}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Box sx={{ ml: 2 }}>
                    <Chip
                      label={alert.currentStock <= 0 ? 'Stokta Yok' : 'Kritik'}
                      color={alert.currentStock <= 0 ? 'error' : 'warning'}
                      size="small"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Inventory />}
                onClick={() => {
                  // Navigate to inventory page - this would need routing context
                  window.location.hash = '#/inventory'
                }}
              >
                Stok Yönetimine Git
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Alert>
    </Box>
  )
}

export default CriticalStockNotification