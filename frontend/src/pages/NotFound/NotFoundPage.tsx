import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material'
import {
  Home,
  ArrowBack,
  SearchOff,
} from '@mui/icons-material'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <SearchOff sx={{ fontSize: 120, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h1" component="h1" fontWeight="bold" color="primary" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Sayfa Bulunamadı
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
          Lütfen URL'yi kontrol edin veya ana sayfaya dönün.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            size="large"
          >
            Ana Sayfaya Dön
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            size="large"
          >
            Geri Git
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default NotFoundPage