import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { RootState } from '../../store'
import { checkAuth } from '../../store/slices/authSlice'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, isLoading, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Token varsa ama kullanıcı doğrulanmamışsa token'ı kontrol et
    if (token && !isAuthenticated && !isLoading) {
      dispatch(checkAuth() as any)
    }
  }, [dispatch, token, isAuthenticated, isLoading])

  // Loading durumunda spinner göster
  if (isLoading) {
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
        <Box>Kimlik doğrulanıyor...</Box>
      </Box>
    )
  }

  // Kullanıcı doğrulanmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default AuthGuard