import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Avatar,
  Box,
  Chip,
} from '@mui/material'
import {
  Inventory,
  People,
  Receipt,
  Build,
  Assessment,
  Settings,
  ShoppingCart,
  AccountBalance,
  LocalShipping,
  Notifications,
} from '@mui/icons-material'
import { QuickAccessItem } from '../../services/api/dashboardApi'

interface QuickAccessCardProps {
  item: QuickAccessItem
  onClick?: () => void
}

const iconMap: { [key: string]: React.ReactElement } = {
  inventory: <Inventory />,
  people: <People />,
  receipt: <Receipt />,
  build: <Build />,
  assessment: <Assessment />,
  settings: <Settings />,
  shopping_cart: <ShoppingCart />,
  account_balance: <AccountBalance />,
  local_shipping: <LocalShipping />,
  notifications: <Notifications />,
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ item, onClick }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (item.path) {
      navigate(item.path)
    }
  }

  const getIcon = () => {
    return iconMap[item.icon] || <Settings />
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        }
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Avatar
            sx={{
              bgcolor: item.color || 'primary.main',
              width: 56,
              height: 56,
              mx: 'auto',
              mb: 2,
            }}
          >
            {getIcon()}
          </Avatar>
          
          <Typography variant="h6" component="h3" gutterBottom>
            {item.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              minHeight: 40,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.description}
          </Typography>

          {item.moduleCode && (
            <Box sx={{ mt: 2 }}>
              <Chip
                label={item.moduleCode}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default QuickAccessCard