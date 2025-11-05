import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountCircle,
  Settings,
  Logout,
  Notifications,
  DarkMode,
  LightMode,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material'

import { RootState } from '../../store'
import { logout } from '../../store/slices/authSlice'
import { 
  toggleSidebar, 
  toggleSidebarCollapsed, 
  toggleDarkMode 
} from '../../store/slices/uiSlice'

const Header: React.FC = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { user } = useSelector((state: RootState) => state.auth)
  const { sidebarOpen, sidebarCollapsed, darkMode } = useSelector((state: RootState) => state.ui)
  const { notifications } = useSelector((state: RootState) => state.ui)
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout() as any)
    handleProfileMenuClose()
    navigate('/login')
  }

  const handleProfile = () => {
    navigate('/profile')
    handleProfileMenuClose()
  }

  const handleSettings = () => {
    navigate('/settings')
    handleProfileMenuClose()
  }

  const unreadNotifications = notifications.filter(n => 
    n.type === 'info' || n.type === 'warning'
  ).length

  return (
    <Toolbar>
      {/* Menu Toggle */}
      <IconButton
        color="inherit"
        aria-label="toggle drawer"
        onClick={() => dispatch(toggleSidebar())}
        edge="start"
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar Collapse Toggle (only when sidebar is open) */}
      {sidebarOpen && (
        <IconButton
          color="inherit"
          aria-label="collapse sidebar"
          onClick={() => dispatch(toggleSidebarCollapsed())}
          sx={{ mr: 2 }}
        >
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      )}

      {/* Title */}
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        İşletme Yönetim Sistemi
      </Typography>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Dark Mode Toggle */}
        <Tooltip title={darkMode ? 'Açık Tema' : 'Koyu Tema'}>
          <IconButton
            color="inherit"
            onClick={() => dispatch(toggleDarkMode())}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Bildirimler">
          <IconButton
            color="inherit"
            onClick={handleNotificationMenuOpen}
          >
            <Badge badgeContent={unreadNotifications} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Profile */}
        <Tooltip title="Profil">
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: theme.palette.secondary.main 
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profil</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ayarlar</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Çıkış Yap</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="h6">
            Bildirimler
          </Typography>
        </Box>
        
        <Divider />
        
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <ListItemText>Yeni bildirim yok</ListItemText>
          </MenuItem>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <MenuItem key={notification.id}>
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  fontWeight: notification.type === 'error' ? 'bold' : 'normal',
                }}
              />
            </MenuItem>
          ))
        )}
        
        {notifications.length > 5 && (
          <>
            <Divider />
            <MenuItem onClick={() => navigate('/notifications')}>
              <ListItemText 
                primary="Tüm bildirimleri görüntüle"
                primaryTypographyProps={{ textAlign: 'center' }}
              />
            </MenuItem>
          </>
        )}
      </Menu>
    </Toolbar>
  )
}

export default Header