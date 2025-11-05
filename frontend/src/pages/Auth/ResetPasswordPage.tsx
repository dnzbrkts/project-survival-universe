import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
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
  Container,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Lock,
  Business,
  CheckCircle,
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { authApi } from '../../services/api/authApi'

// Validation schema
const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Şifre gereklidir')
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'
    ),
  confirmPassword: yup
    .string()
    .required('Şifre tekrarı gereklidir')
    .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor'),
})

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  })

  useEffect(() => {
    if (!token) {
      setError('Geçersiz şifre sıfırlama bağlantısı')
    }
  }, [token])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Geçersiz şifre sıfırlama bağlantısı')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await authApi.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })

      setSuccess(true)

      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Şifreniz başarıyla sıfırlandı! Yeni şifrenizle giriş yapabilirsiniz.' 
          } 
        })
      }, 3000)

    } catch (error: any) {
      setError(error.response?.data?.message || 'Şifre sıfırlama sırasında bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Card sx={{ width: '100%', maxWidth: 400 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                Şifre Sıfırlandı!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...
              </Typography>
              <CircularProgress size={30} />
            </CardContent>
          </Card>
        </Box>
      </Container>
    )
  }

  if (!token || error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Card sx={{ width: '100%', maxWidth: 400 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Business sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                Geçersiz Bağlantı
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
              </Typography>
              <Button
                component={Link}
                to="/forgot-password"
                variant="contained"
                fullWidth
              >
                Yeni Bağlantı İste
              </Button>
              <Button
                component={Link}
                to="/login"
                sx={{ mt: 2 }}
                fullWidth
              >
                Giriş Sayfasına Dön
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Logo ve Başlık */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Business sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Yeni Şifre
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Lütfen yeni şifrenizi belirleyin
              </Typography>
            </Box>

            {/* Hata Mesajı */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Reset Password Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('password')}
                fullWidth
                label="Yeni Şifre"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isLoading}
                autoComplete="new-password"
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                {...register('confirmPassword')}
                fullWidth
                label="Yeni Şifre Tekrarı"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={isLoading}
                autoComplete="new-password"
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <Lock />}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isLoading ? 'Şifre Sıfırlanıyor...' : 'Şifreyi Sıfırla'}
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                © 2024 İşletme Yönetim Sistemi
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default ResetPasswordPage