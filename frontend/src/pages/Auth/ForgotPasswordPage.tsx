import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material'
import {
  Email,
  Business,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { authApi } from '../../services/api/authApi'

// Validation schema
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('E-posta gereklidir')
    .email('Geçerli bir e-posta adresi giriniz'),
})

interface ForgotPasswordFormData {
  email: string
}

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      await authApi.requestPasswordReset(data.email)
      setSuccess(true)

    } catch (error: any) {
      setError(error.response?.data?.message || 'Şifre sıfırlama isteği gönderilirken bir hata oluştu')
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
                E-posta Gönderildi
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. 
                Lütfen e-postanızı kontrol edin.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                startIcon={<ArrowBack />}
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
                Şifremi Unuttum
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
              </Typography>
            </Box>

            {/* Hata Mesajı */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Forgot Password Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('email')}
                fullWidth
                label="E-posta Adresi"
                type="email"
                variant="outlined"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <Email sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <Email />}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<ArrowBack />}
                  disabled={isLoading}
                >
                  Giriş Sayfasına Dön
                </Button>
              </Box>
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

export default ForgotPasswordPage