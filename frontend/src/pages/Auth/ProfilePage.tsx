import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
  Divider,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Save,
  Edit,
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import { RootState } from '../../store'
import { authApi } from '../../services/api/authApi'
import { checkAuth } from '../../store/slices/authSlice'

// Profile validation schema
const profileSchema = yup.object({
  firstName: yup
    .string()
    .required('Ad gereklidir')
    .min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: yup
    .string()
    .required('Soyad gereklidir')
    .min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: yup
    .string()
    .required('E-posta gereklidir')
    .email('Geçerli bir e-posta adresi giriniz'),
})

// Password validation schema
const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Mevcut şifre gereklidir'),
  newPassword: yup
    .string()
    .required('Yeni şifre gereklidir')
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'
    ),
  confirmPassword: yup
    .string()
    .required('Şifre tekrarı gereklidir')
    .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor'),
})

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [activeTab, setActiveTab] = useState(0)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  })

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsProfileLoading(true)

      await authApi.updateProfile(data)
      
      // Kullanıcı bilgilerini yenile
      await dispatch(checkAuth() as any)
      
      toast.success('Profil bilgileri başarıyla güncellendi')

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu')
    } finally {
      setIsProfileLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsPasswordLoading(true)

      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })
      
      resetPassword()
      toast.success('Şifre başarıyla değiştirildi')

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profil Ayarları
      </Typography>

      <Card>
        <CardContent>
          {/* Kullanıcı Bilgileri Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ 
                width: 80, 
                height: 80, 
                mr: 3,
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" component="h2">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                @{user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Tabs */}
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Profil Bilgileri" icon={<Person />} />
            <Tab label="Şifre Değiştir" icon={<Lock />} />
          </Tabs>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box component="form" onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...registerProfile('firstName')}
                    fullWidth
                    label="Ad"
                    variant="outlined"
                    error={!!profileErrors.firstName}
                    helperText={profileErrors.firstName?.message}
                    disabled={isProfileLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...registerProfile('lastName')}
                    fullWidth
                    label="Soyad"
                    variant="outlined"
                    error={!!profileErrors.lastName}
                    helperText={profileErrors.lastName?.message}
                    disabled={isProfileLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...registerProfile('email')}
                    fullWidth
                    label="E-posta"
                    type="email"
                    variant="outlined"
                    error={!!profileErrors.email}
                    helperText={profileErrors.email?.message}
                    disabled={isProfileLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Kullanıcı Adı"
                    value={user.username}
                    variant="outlined"
                    disabled
                    helperText="Kullanıcı adı değiştirilemez"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isProfileLoading}
                  startIcon={isProfileLoading ? <CircularProgress size={20} /> : <Save />}
                >
                  {isProfileLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </Box>
            </Box>
          )}

          {/* Password Tab */}
          {activeTab === 1 && (
            <Box component="form" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    {...registerPassword('currentPassword')}
                    fullWidth
                    label="Mevcut Şifre"
                    type={showCurrentPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={!!passwordErrors.currentPassword}
                    helperText={passwordErrors.currentPassword?.message}
                    disabled={isPasswordLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle current password visibility"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...registerPassword('newPassword')}
                    fullWidth
                    label="Yeni Şifre"
                    type={showNewPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword?.message}
                    disabled={isPasswordLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle new password visibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...registerPassword('confirmPassword')}
                    fullWidth
                    label="Yeni Şifre Tekrarı"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword?.message}
                    disabled={isPasswordLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isPasswordLoading}
                  startIcon={isPasswordLoading ? <CircularProgress size={20} /> : <Lock />}
                >
                  {isPasswordLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProfilePage