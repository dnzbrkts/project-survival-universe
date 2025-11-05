import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Divider,
  InputAdornment,
  Alert,
  Chip
} from '@mui/material'
import { TrendingUp, TrendingDown, SwapHoriz, Build } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  createStockMovement,
  fetchStockLevels
} from '../../../store/slices/inventorySlice'
import { CreateStockMovementData } from '../../../services/api/inventoryApi'

interface StockMovementFormDialogProps {
  open: boolean
  onClose: () => void
}

const StockMovementFormDialog: React.FC<StockMovementFormDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedProductForMovement, stockLevelFilters } = useSelector((state: RootState) => state.inventory)

  const [formData, setFormData] = useState<CreateStockMovementData>({
    productId: 0,
    movementType: 'in',
    quantity: 1,
    unitPrice: 0,
    currency: 'TRY',
    referenceType: '',
    referenceId: undefined,
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && selectedProductForMovement) {
      setFormData({
        productId: selectedProductForMovement.id,
        movementType: 'in',
        quantity: 1,
        unitPrice: selectedProductForMovement.purchasePrice || 0,
        currency: 'TRY',
        referenceType: '',
        referenceId: undefined,
        description: ''
      })
      setErrors({})
    }
  }, [open, selectedProductForMovement])

  const handleInputChange = (field: keyof CreateStockMovementData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.productId) {
      newErrors.productId = 'Ürün seçimi gerekli'
    }

    if (!formData.movementType) {
      newErrors.movementType = 'Hareket tipi seçimi gerekli'
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Miktar pozitif bir sayı olmalı'
    }

    if (formData.unitPrice && formData.unitPrice < 0) {
      newErrors.unitPrice = 'Birim fiyat negatif olamaz'
    }

    if (formData.referenceId && formData.referenceId <= 0) {
      newErrors.referenceId = 'Referans ID pozitif bir sayı olmalı'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Açıklama maksimum 500 karakter olabilir'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await dispatch(createStockMovement(formData)).unwrap()
      // Refresh stock levels after successful movement
      dispatch(fetchStockLevels(stockLevelFilters))
      onClose()
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp color="success" />
      case 'out':
        return <TrendingDown color="error" />
      case 'transfer':
        return <SwapHoriz color="info" />
      case 'adjustment':
        return <Build color="warning" />
      default:
        return null
    }
  }

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'success'
      case 'out':
        return 'error'
      case 'transfer':
        return 'info'
      case 'adjustment':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getMovementTypeText = (type: string) => {
    switch (type) {
      case 'in':
        return 'Stok Girişi'
      case 'out':
        return 'Stok Çıkışı'
      case 'transfer':
        return 'Transfer'
      case 'adjustment':
        return 'Düzeltme'
      default:
        return type
    }
  }

  const calculateTotal = () => {
    return (formData.quantity * (formData.unitPrice || 0)).toFixed(2)
  }

  if (!selectedProductForMovement) {
    return null
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle>
        Stok Hareketi Ekle
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ py: 1 }}>
          {/* Product Information */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Seçili Ürün:</strong> {selectedProductForMovement.productName} ({selectedProductForMovement.productCode})
              <br />
              <strong>Mevcut Stok:</strong> {selectedProductForMovement.currentStock} {selectedProductForMovement.unit}
              <br />
              <strong>Kritik Seviye:</strong> {selectedProductForMovement.criticalStockLevel} {selectedProductForMovement.unit}
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            {/* Movement Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Hareket Bilgileri
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.movementType} disabled={isSubmitting}>
                <InputLabel>Hareket Tipi *</InputLabel>
                <Select
                  value={formData.movementType}
                  onChange={(e) => handleInputChange('movementType', e.target.value)}
                  label="Hareket Tipi *"
                  renderValue={(value) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getMovementTypeIcon(value)}
                      {getMovementTypeText(value)}
                    </Box>
                  )}
                >
                  <MenuItem value="in">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp color="success" />
                      Stok Girişi
                    </Box>
                  </MenuItem>
                  <MenuItem value="out">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingDown color="error" />
                      Stok Çıkışı
                    </Box>
                  </MenuItem>
                  <MenuItem value="transfer">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SwapHoriz color="info" />
                      Transfer
                    </Box>
                  </MenuItem>
                  <MenuItem value="adjustment">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Build color="warning" />
                      Düzeltme
                    </Box>
                  </MenuItem>
                </Select>
                {errors.movementType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.movementType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Miktar *"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                error={!!errors.quantity}
                helperText={errors.quantity}
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{selectedProductForMovement.unit}</InputAdornment>,
                  inputProps: { min: 1 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birim Fiyat"
                type="number"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                error={!!errors.unitPrice}
                helperText={errors.unitPrice}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Para Birimi</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  label="Para Birimi"
                >
                  <MenuItem value="TRY">TRY (Türk Lirası)</MenuItem>
                  <MenuItem value="USD">USD (Amerikan Doları)</MenuItem>
                  <MenuItem value="EUR">EUR (Euro)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Reference Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Referans Bilgileri (Opsiyonel)
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Referans Tipi"
                value={formData.referenceType}
                onChange={(e) => handleInputChange('referenceType', e.target.value)}
                disabled={isSubmitting}
                placeholder="purchase, sale, transfer, vb."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Referans ID"
                type="number"
                value={formData.referenceId || ''}
                onChange={(e) => handleInputChange('referenceId', e.target.value ? parseInt(e.target.value) : undefined)}
                error={!!errors.referenceId}
                helperText={errors.referenceId}
                disabled={isSubmitting}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={3}
                disabled={isSubmitting}
                placeholder="Hareket açıklaması..."
              />
            </Grid>

            {/* Summary */}
            {formData.quantity > 0 && formData.unitPrice > 0 && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Hareket Özeti:</strong><br />
                    Hareket Tipi: <Chip 
                      label={getMovementTypeText(formData.movementType)} 
                      color={getMovementTypeColor(formData.movementType) as any}
                      size="small" 
                      sx={{ mx: 0.5 }}
                    /><br />
                    Miktar: {formData.quantity} {selectedProductForMovement.unit}<br />
                    Birim Fiyat: {formData.unitPrice} {formData.currency}<br />
                    <strong>Toplam Tutar: {calculateTotal()} {formData.currency}</strong><br />
                    <strong>Hareket Sonrası Tahmini Stok: {
                      formData.movementType === 'in' 
                        ? (selectedProductForMovement.currentStock || 0) + formData.quantity
                        : formData.movementType === 'out'
                        ? Math.max(0, (selectedProductForMovement.currentStock || 0) - formData.quantity)
                        : selectedProductForMovement.currentStock || 0
                    } {selectedProductForMovement.unit}</strong>
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={isSubmitting}
        >
          İptal
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Hareket Ekle'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StockMovementFormDialog