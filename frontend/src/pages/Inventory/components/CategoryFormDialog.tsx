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
  Divider
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  createCategory,
  updateCategory,
  fetchCategories
} from '../../../store/slices/inventorySlice'
import { CreateCategoryData, UpdateCategoryData } from '../../../services/api/inventoryApi'

interface CategoryFormDialogProps {
  open: boolean
  onClose: () => void
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedCategory, categories, categoriesLoading } = useSelector((state: RootState) => state.inventory)

  const [formData, setFormData] = useState<CreateCategoryData>({
    categoryCode: '',
    categoryName: '',
    description: '',
    parentCategoryId: undefined
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      // Load all categories for parent selection
      dispatch(fetchCategories({ limit: 100 }))
      
      if (selectedCategory) {
        setFormData({
          categoryCode: selectedCategory.categoryCode,
          categoryName: selectedCategory.categoryName,
          description: selectedCategory.description || '',
          parentCategoryId: selectedCategory.parentCategoryId
        })
      } else {
        setFormData({
          categoryCode: '',
          categoryName: '',
          description: '',
          parentCategoryId: undefined
        })
      }
      setErrors({})
    }
  }, [open, selectedCategory, dispatch])

  const handleInputChange = (field: keyof CreateCategoryData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.categoryCode.trim()) {
      newErrors.categoryCode = 'Kategori kodu gerekli'
    } else if (formData.categoryCode.length > 50) {
      newErrors.categoryCode = 'Kategori kodu maksimum 50 karakter olabilir'
    }

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Kategori adı gerekli'
    } else if (formData.categoryName.length > 100) {
      newErrors.categoryName = 'Kategori adı maksimum 100 karakter olabilir'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Açıklama maksimum 500 karakter olabilir'
    }

    // Check if parent category is not the same as current category (for edit mode)
    if (selectedCategory && formData.parentCategoryId === selectedCategory.id) {
      newErrors.parentCategoryId = 'Kategori kendisinin alt kategorisi olamaz'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (selectedCategory) {
        await dispatch(updateCategory({ 
          id: selectedCategory.id, 
          data: formData as UpdateCategoryData 
        })).unwrap()
      } else {
        await dispatch(createCategory(formData)).unwrap()
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

  const isEditMode = !!selectedCategory

  // Filter out current category from parent options (for edit mode)
  const availableParentCategories = categories.filter(cat => 
    !selectedCategory || cat.id !== selectedCategory.id
  )

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle>
        {isEditMode ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ py: 1 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Kategori Bilgileri
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kategori Kodu *"
                value={formData.categoryCode}
                onChange={(e) => handleInputChange('categoryCode', e.target.value)}
                error={!!errors.categoryCode}
                helperText={errors.categoryCode}
                disabled={isSubmitting}
                placeholder="KAT001"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kategori Adı *"
                value={formData.categoryName}
                onChange={(e) => handleInputChange('categoryName', e.target.value)}
                error={!!errors.categoryName}
                helperText={errors.categoryName}
                disabled={isSubmitting}
                placeholder="Elektronik"
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
                placeholder="Kategori açıklaması..."
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                error={!!errors.parentCategoryId} 
                disabled={isSubmitting || categoriesLoading}
              >
                <InputLabel>Üst Kategori</InputLabel>
                <Select
                  value={formData.parentCategoryId || ''}
                  onChange={(e) => handleInputChange('parentCategoryId', e.target.value || undefined)}
                  label="Üst Kategori"
                >
                  <MenuItem value="">Ana Kategori (Üst kategori yok)</MenuItem>
                  {availableParentCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName} ({category.categoryCode})
                    </MenuItem>
                  ))}
                </Select>
                {errors.parentCategoryId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.parentCategoryId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Information Note */}
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'info.light', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'info.main'
              }}>
                <Typography variant="body2" color="info.contrastText">
                  <strong>Bilgi:</strong> Kategoriler hiyerarşik yapıda organize edilebilir. 
                  Üst kategori seçmezseniz bu kategori ana kategori olarak oluşturulur.
                </Typography>
              </Box>
            </Grid>
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

export default CategoryFormDialog