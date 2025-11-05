import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    percentage: string
    trend: 'up' | 'down' | 'flat'
  }
  icon: React.ReactElement
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  loading?: boolean
  subtitle?: string
  progress?: {
    value: number
    max: number
    label?: string
  }
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  loading = false,
  subtitle,
  progress,
}) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return <TrendingUp fontSize="small" />
      case 'down':
        return <TrendingDown fontSize="small" />
      default:
        return <TrendingFlat fontSize="small" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return 'success'
      case 'down':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString('tr-TR')
    }
    return val
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {loading ? '...' : formatValue(value)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}

        {change && !loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip
              label={change.percentage}
              size="small"
              color={getTrendColor(change.trend) as any}
              icon={getTrendIcon(change.trend)}
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              önceki döneme göre
            </Typography>
          </Box>
        )}

        {progress && !loading && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {progress.label || 'İlerleme'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress.value} / {progress.max}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(progress.value / progress.max) * 100}
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        {loading && (
          <LinearProgress sx={{ mt: 2 }} />
        )}
      </CardContent>
    </Card>
  )
}

export default StatsCard