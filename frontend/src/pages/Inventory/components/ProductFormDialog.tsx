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
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  createProduct,
  updateProduct,
  fetchCategories,
  setProductFormOpen
} from '../../../store/slices/inventorySlice'
import { CreateProductData, UpdateProductData } from '../../../services/api/inventoryApi'

interface ProductFormDialogProps {
  open: boolean
  onClose: () => void
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedProduct, categories, categoriesLoading } = useSelector((state: RootState) => state.inventory)

  const [formData, setFormData] = useState<CreateProductData>({
    productCode: '',
    productName: '',
    description: '',
    categoryId: undefined,
    unit: '',
    criticalStockLevel: 0,
    purchasePrice: 0,
    salePrice: 0,
    taxRate: 20
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      dispatch(fetchCategories({ limit: 100 }))
      
      if (selectedProduct) {
        setFormData({
          productCode: selectedProduct.productCode,
          productName: selectedProduct.productName,
          description: selectedProduct.description || '',
          categoryId: selectedProduct.categoryId,
          unit: selectedProduct.unit,
          criticalStockLevel: selectedProduct.criticalStockLevel,
          purchasePrice: selectedProduct.purchasePrice,
          salePrice: selectedProduct.salePrice,
          taxRate: selectedProduct.taxRate
        })
      } else {
        setFormData({
          productCode: '',
          productName: '',
          description: '',
          categoryId: undefined,
          unit: '',
          criticalStockLevel: 0,
          purchasePrice: 0,
          salePrice: 0,
          taxRate: 20
        })
      }
      setErrors({})
    }
  }, [open, selectedProduct, dispatch])

  const handleInputChange = (field: keyof CreateProductData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.productCode.trim()) {
      newErrors.productCode = 'Ürün kodu gerekli'
    } else if (formData.productCode.length > 50) {
      newErrors.productCode = 'Ürün kodu maksimum 50 karakter olabilir'
    }

    if (!formData.productName.trim()) {
      newErrors.productName = 'Ürün adı gerekli'
    } else if (formData.productName.length > 200) {
      newErrors.productName = 'Ürün adı maksimum 200 karakter olabilir'
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Açıklama maksimum 1000 karakter olabilir'
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Birim gerekli'
    } else if (formData.unit.length > 20) {
      newErrors.unit = 'Birim maksimum 20 karakter olabilir'
    }

    if (formData.criticalStockLevel < 0) {
      newErrors.criticalStockLevel = 'Kritik stok seviyesi negatif olamaz'
    }

    if (formData.purchasePrice < 0) {
      newErrors.purchasePrice = 'Alış fiyatı negatif olamaz'
    }

    if (formData.salePrice < 0) {
      newErrors.salePrice = 'Satış fiyatı negatif olamaz'
    }

    if (formData.taxRate < 0 || formData.taxRate > 100) {
      newErrors.taxRate = 'KDV oranı 0-100 arası olmalı'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (selectedProduct) {
        await dispatch(updateProduct({ 
          id: selectedProduct.id, 
          data: formData as UpdateProductData 
        })).unwrap()
      } else {
        await dispatch(createProduct(formData)).unwrap()
      }
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

  const isEditMode = !!selectedProduct

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        {isEditMode ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ py: 1 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Temel Bilgiler
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ürün Kodu *"
                value={formData.productCode}
                onChange={(e) => handleInputChange('productCode', e.target.value)}
                error={!!errors.productCode}
                helperText={errors.productCode}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ürün Adı *"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                error={!!errors.productName}
                helperText={errors.productName}
                disabled={isSubmitting}
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
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.categoryId} disabled={isSubmitting || categoriesLoading}>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={formData.categoryId || ''}
                  onChange={(e) => handleInputChange('categoryId', e.target.value || undefined)}
                  label="Kategori"
                >
                  <MenuItem value="">Kategori Seçin</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birim *"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                error={!!errors.unit}
                helperText={errors.unit}
                disabled={isSubmitting}
                placeholder="Adet, Kg, Lt, vb."
              />
            </Grid>

            {/* Stock Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Stok Bilgileri
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kritik Stok Seviyesi"
                type="number"
                value={formData.criticalStockLevel}
                onChange={(e) => handleInputChange('criticalStockLevel', parseInt(e.target.value) || 0)}
                error={!!errors.criticalStockLevel}
                helperText={errors.criticalStockLevel || 'Bu seviyenin altında uyarı verilir'}
                disabled={isSubmitting}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            {/* Pricing Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Fiyat Bilgileri
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Alış Fiyatı"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                error={!!errors.purchasePrice}
                helperText={errors.purchasePrice}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Satış Fiyatı"
                type="number"
                value={formData.salePrice}
                onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                error={!!errors.salePrice}
                helperText={errors.salePrice}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="KDV Oranı (%)"
                type="number"
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                error={!!errors.taxRate}
                helperText={errors.taxRate}
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { min: 0, max: 100, step: 0.01 }
                }}
              />
            </Grid>

            {/* Price Summary */}
            {formData.salePrice > 0 && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Fiyat Özeti:</strong><br />
                    Satış Fiyatı (KDV Hariç): {formData.salePrice.toFixed(2)} ₺<br />
                    KDV Tutarı: {(formData.salePrice * formData.taxRate / 100).toFixed(2)} ₺<br />
                    <strong>Toplam Fiyat (KDV Dahil): {(formData.salePrice * (1 + formData.taxRate / 100)).toFixed(2)} ₺</strong>
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
          {isSubmitting ? 'Kaydediliyor...' : (isEditMode ? 'Güncelle' : 'Kaydet')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductFormDialog