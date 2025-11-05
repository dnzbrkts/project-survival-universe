import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Box,
  Divider,
  IconButton,
  Skeleton,
} from '@mui/material'
import {
  Receipt,
  Inventory,
  People,
  Build,
  Payment,
  Refresh,
  MoreVert,
} from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { RecentActivity } from '../../services/api/dashboardApi'

interface RecentActivitiesListProps {
  activities: RecentActivity[]
  loading?: boolean
  onRefresh?: () => void
  maxItems?: number
}

const iconMap: { [key: string]: React.ReactElement } = {
  invoice: <Receipt />,
  stock: <Inventory />,
  customer: <People />,
  service: <Build />,
  payment: <Payment />,
}

const colorMap: { [key: string]: 'success' | 'warning' | 'error' | 'info' | 'default' } = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
}

const RecentActivitiesList: React.FC<RecentActivitiesListProps> = ({
  activities,
  loading = false,
  onRefresh,
  maxItems = 10,
}) => {
  const getActivityIcon = (type: string) => {
    return iconMap[type] || <Receipt />
  }

  const getStatusColor = (status: string) => {
    return colorMap[status] || 'default'
  }

  const formatAmount = (amount?: number, currency?: string) => {
    if (!amount) return null
    
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency || 'TRY',
    }).format(amount)
  }

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: tr,
      })
    } catch {
      return timestamp
    }
  }

  const displayedActivities = activities.slice(0, maxItems)

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Son Aktiviteler"
        action={
          onRefresh && (
            <IconButton onClick={onRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          )
        }
      />
      <CardContent sx={{ pt: 0, pb: 1 }}>
        {loading ? (
          <List>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="60%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : displayedActivities.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Henüz aktivite bulunmuyor
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {displayedActivities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{ 
                    px: 0,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderRadius: 1,
                    }
                  }}
                  secondaryAction={
                    <IconButton edge="end" size="small">
                      <MoreVert fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: `${getStatusColor(activity.status)}.main`,
                        width: 36,
                        height: 36,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {activity.title}
                        </Typography>
                        <Chip
                          label={activity.status}
                          size="small"
                          color={getStatusColor(activity.status)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(activity.timestamp)}
                          </Typography>
                          {activity.amount && (
                            <Typography variant="caption" fontWeight="medium" color="primary.main">
                              {formatAmount(activity.amount, activity.currency)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < displayedActivities.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivitiesList