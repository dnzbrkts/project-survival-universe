import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

// Store
import { RootState } from './store'
import { initializeApp } from './store/slices/appSlice'

// Components
import Layout from './components/Layout/Layout'
import LoginPage from './pages/Auth/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ModuleManagementPage from './pages/System/ModuleManagementPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'

// Guards
import AuthGuard from './components/Guards/AuthGuard'
import ModuleGuard from './components/Guards/ModuleGuard'

function App() {
  const dispatch = useDispatch()
  const { isInitialized, isLoading } = useSelector((state: RootState) => state.app)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(initializeApp())
  }, [dispatch])

  // Uygulama henüz başlatılmadıysa loading göster
  if (!isInitialized || isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Box>İşletme Yönetim Sistemi yükleniyor...</Box>
      </Box>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } 
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <AuthGuard>
            <Layout>
              <Routes>
                {/* Dashboard */}
                <Route path="/" element={<DashboardPage />} />
                
                {/* System Management */}
                <Route
                  path="/system/modules"
                  element={
                    <ModuleGuard moduleCode="SYSTEM" permission="system.modules.view">
                      <ModuleManagementPage />
                    </ModuleGuard>
                  }
                />

                {/* Dynamic Module Routes will be added here */}
                
                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </AuthGuard>
        }
      />
    </Routes>
  )
}

export default App