import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

// Store
import { RootState } from './store'
import { initializeApp } from './store/slices/appSlice'
import { checkAuth } from './store/slices/authSlice'

// Components
import Layout from './components/Layout/Layout'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import ProfilePage from './pages/Auth/ProfilePage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ModuleManagementPage from './pages/System/ModuleManagementPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'

// Guards
import AuthGuard from './components/Guards/AuthGuard'
import ModuleGuard from './components/Guards/ModuleGuard'

// Dynamic Routes
import DynamicRoutes from './components/DynamicRoutes/DynamicRoutes'

function App() {
  const dispatch = useDispatch()
  const { isInitialized, isLoading } = useSelector((state: RootState) => state.app)
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Uygulama başlatma
    dispatch(initializeApp() as any)
    
    // Token varsa kullanıcı doğrulaması yap
    if (token && !isAuthenticated) {
      dispatch(checkAuth() as any)
    }
  }, [dispatch, token, isAuthenticated])

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
      <Route 
        path="/register" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <ForgotPasswordPage />
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <ResetPasswordPage />
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
                
                {/* Profile */}
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* System Management */}
                <Route
                  path="/system/modules"
                  element={
                    <ModuleGuard moduleCode="SYSTEM" permission="system.modules.view">
                      <ModuleManagementPage />
                    </ModuleGuard>
                  }
                />

                {/* Dynamic Module Routes */}
                <Route path="/modules/*" element={<DynamicRoutes />} />
                
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