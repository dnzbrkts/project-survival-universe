import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material'

import { RootState } from '../../store'
import { setSidebarOpen } from '../../store/slices/uiSlice'

// Components
import Header from './Header'
import Sidebar from './Sidebar'
import Breadcrumbs from './Breadcrumbs'
import NotificationContainer from '../Notifications/NotificationContainer'

interface LayoutProps {
  children: React.ReactNode
}

const DRAWER_WIDTH = 280
const DRAWER_WIDTH_COLLAPSED = 64

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const { sidebarOpen, sidebarCollapsed } = useSelector((state: RootState) => state.ui)
  const { userMenu } = useSelector((state: RootState) => state.auth)

  // Mobil cihazlarda sayfa değiştiğinde sidebar'ı kapat
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      dispatch(setSidebarOpen(false))
    }
  }, [location.pathname, isMobile, dispatch, sidebarOpen])

  const drawerWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(sidebarOpen && !isMobile && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Header />
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Sidebar menuItems={userMenu} collapsed={sidebarCollapsed} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: isMobile ? 0 : sidebarOpen ? 0 : `-${drawerWidth}px`,
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        
        {/* Breadcrumbs */}
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Breadcrumbs />
        </Box>

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>

      {/* Notifications */}
      <NotificationContainer />
    </Box>
  )
}

export default Layout