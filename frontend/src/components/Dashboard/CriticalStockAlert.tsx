import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Box,
  Alert,
  AlertTitle,
  IconButton,
  Skeleton,
  LinearProgress,
} from '@mui/material'
import {
  Warning,
  Inventory,
  Refresh,
  ArrowForward,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface CriticalStockItem {
  id: number
  productCode: string
  productName: string
  currentStock: number
  criticalLevel: number
  unit: string
}

interface CriticalStockAlertProps {
  items: CriticalStockItem[]
  loading?: boolean
  onRefresh?: () => void
  maxItems?: number
}

const CriticalStockAlert: React.FC<CriticalStockAlertProps> = ({
  items,
  loading = false,
  onRefresh,
  maxItems = 5,
}) => {
  const navigate = useNavigate()

  const displayedItems = items.slice(0, maxItems)

  const getStockPercentage = (current: number, critical: number) => {
    if (critical === 0) return 0
    return Math.min((current / critical) * 100, 100)
  }

  const getStockColor = (current: number, critical: number) => {
    const percentage = getStockPercentage(current, critical)
    if (percentage <= 25) return 'error'
    if (percentage <= 50) return 'warning'
    return 'success'
  }

  const handleViewAll = () => {
    navigate('/modules/inventory/products?filter=critical')
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            <Typography variant="h6">Kritik Stok Uyarıları</Typography>
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onRefresh && (
              <IconButton onClick={onRefresh} disabled={loading}>
                <Refresh />
              </IconButton>
            )}
            <IconButton onClick={handleViewAll} size="small">
              <ArrowForward />
            </IconButton>
          </Box>
        }
      />
      <CardContent sx={{ pt: 0, pb: 1 }}>
        {loading ? (
          <List>
            {Array.from({ length: 3 }).map((_, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemText
                  primary={<Skeleton variant="text" width="70%" />}
                  secondary={<Skeleton variant="text" width="50%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : displayedItems.length === 0 ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Harika!</AlertTitle>
            Şu anda kritik seviyede stok bulunmuyor.
          </Alert>
        ) : (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Dikkat!</AlertTitle>
              {items.length} ürün kritik stok seviyesinde.
            </Alert>
            
            <List sx={{ py: 0 }}>
              {displayedItems.map((item, index) => (
                <ListItem
                  key={item.id}
                  sx={{ 
                    px: 0,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderRadius: 1,
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.productName}
                        </Typography>
                        <Chip
                          label={item.productCode}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Mevcut: {item.currentStock} {item.unit}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Kritik: {item.criticalLevel} {item.unit}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getStockPercentage(item.currentStock, item.criticalLevel)}
                          color={getStockColor(item.currentStock, item.criticalLevel)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {items.length > maxItems && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  +{items.length - maxItems} ürün daha
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default CriticalStockAlert