import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  Tooltip,
  Chip,
} from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  Inventory,
  Receipt,
  People,
  AccountBalance,
  Build,
  Assessment,
  Settings,
  Business,
  LocalShipping,
  ShoppingCart,
  CurrencyExchange,
} from '@mui/icons-material'

import { MenuItem } from '../../core/ModuleSystem'

interface SidebarProps {
  menuItems: MenuItem[]
  collapsed: boolean
}

// Icon mapping
const iconMap: Record<string, React.ReactElement> = {
  dashboard: <Dashboard />,
  inventory: <Inventory />,
  receipt: <Receipt />,
  people: <People />,
  account_balance: <AccountBalance />,
  build: <Build />,
  assessment: <Assessment />,
  settings: <Settings />,
  business: <Business />,
  local_shipping: <LocalShipping />,
  shopping_cart: <ShoppingCart />,
  currency_exchange: <CurrencyExchange />,
}

const getIcon = (iconName?: string) => {
  if (!iconName) return <Dashboard />
  return iconMap[iconName] || <Dashboard />
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // Alt menü varsa expand/collapse yap
      const isExpanded = expandedItems.includes(item.title)
      if (isExpanded) {
        setExpandedItems(prev => prev.filter(title => title !== item.title))
      } else {
        setExpandedItems(prev => [...prev, item.title])
      }
    } else if (item.path) {
      // Sayfa yönlendirmesi yap
      navigate(item.path)
    }
  }

  const isItemActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const isActive = item.path ? isItemActive(item.path) : false

    return (
      <React.Fragment key={item.title}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip 
            title={collapsed ? item.title : ''} 
            placement="right"
            disableHoverListener={!collapsed}
          >
            <ListItemButton
              onClick={() => handleItemClick(item)}
              selected={isActive}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'initial',
                px: 2.5,
                pl: level > 0 ? 4 + (level * 2) : 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 'auto' : 3,
                  justifyContent: 'center',
                }}
              >
                {getIcon(item.icon)}
              </ListItemIcon>
              
              {!collapsed && (
                <>
                  <ListItemText 
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: level > 0 ? '0.875rem' : '1rem',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  />
                  
                  {hasChildren && (
                    isExpanded ? <ExpandLess /> : <ExpandMore />
                  )}
                </>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Alt menü öğeleri */}
        {hasChildren && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  // Menü öğelerini kategoriye göre grupla
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    // Basit implementasyon - gelecekte kategori bilgisi eklenebilir
    const category = 'Ana Menü'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Title Area */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: 64,
        }}
      >
        {!collapsed ? (
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              İYS
            </Typography>
            <Typography variant="caption" color="text.secondary">
              v1.0.0
            </Typography>
          </Box>
        ) : (
          <Tooltip title="İşletme Yönetim Sistemi" placement="right">
            <Typography variant="h5" component="div" fontWeight="bold">
              İYS
            </Typography>
          </Tooltip>
        )}
      </Box>

      <Divider />

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {Object.entries(groupedMenuItems).map(([category, items]) => (
          <React.Fragment key={category}>
            {!collapsed && (
              <Box sx={{ px: 2, py: 1 }}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                >
                  {category}
                </Typography>
              </Box>
            )}
            
            <List>
              {items.map(item => renderMenuItem(item))}
            </List>
            
            {!collapsed && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </Box>

      {/* Footer */}
      {!collapsed && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Aktif Modüller
            </Typography>
            <Chip 
              label={menuItems.length} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Sidebar