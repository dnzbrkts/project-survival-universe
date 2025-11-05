import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Autocomplete,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Print as PrintIcon
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  setInvoiceFormOpen,
  createInvoice,
  updateInvoice,
  fetchCustomers,
  addInvoiceItem,
  updateInvoiceItem,
  removeInvoiceItem,
  clearInvoiceItems,
  setInvoiceItems,
  printInvoice
} from '../../store/slices/invoiceSlice'
import { fetchProducts } from '../../store/slices/inventorySlice'
import { InvoiceItem, Customer } from '../../types'
import { Product } from '../../services/api/inventoryApi'

interface InvoiceFormProps {
  open: boolean
  onClose: () => void
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    selectedInvoice,
    customers,
    currentInvoiceItems,
    invoiceTotals
  } = useSelector((state: RootState) => state.invoice)
  
  const { products } = useSelector((state: RootState) => state.inventory)

  // Form state
  const [formData, setFormData] = useState({
    invoiceType: 'sales' as 'sales' | 'purchase',
    customerId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'TRY',
    exchangeRate: 1,
    notes: ''
  })

  // New item form state
  const [newItem, setNewItem] = useState({
    productId: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    discountRate: 0,
    taxRate: 20
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      dispatch(fetchCustomers({ limit: 1000 }))
      dispatch(fetchProducts({ limit: 1000 }))
      
      if (selectedInvoice) {
        // Edit mode
        setFormData({
          invoiceType: selectedInvoice.invoiceType,
          customerId: selectedInvoice.customerId.toString(),
          invoiceDate: selectedInvoice.invoiceDate,
          dueDate: selectedInvoice.dueDate || '',
          currency: selectedInvoice.currency,
          exchangeRate: selectedInvoice.exchangeRate,
          notes: selectedInvoice.notes || ''
        })
        dispatch(setInvoiceItems(selectedInvoice.items || []))
      } else {
        // Create mode
        resetForm()
      }
    }
  }, [open, selectedInvoice, dispatch])

  const resetForm = () => {
    setFormData({
      invoiceType: 'sales',
      customerId: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      currency: 'TRY',
      exchangeRate: 1,
      notes: ''
    })
    setNewItem({
      productId: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discountRate: 0,
      taxRate: 20
    })
    dispatch(clearInvoiceItems())
    setErrors({})
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleNewItemChange = (field: string, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }))
    
    // Auto-fill product details when product is selected
    if (field === 'productId' && value) {
      const product = products.find(p => p.id === parseInt(value))
      if (product) {
        setNewItem(prev => ({
          ...prev,
          description: product.productName,
          unitPrice: product.salePrice || 0,
          taxRate: product.taxRate || 20
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerId) {
      newErrors.customerId = 'Müşteri seçimi zorunludur'
    }
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Fatura tarihi zorunludur'
    }
    if (currentInvoiceItems.length === 0) {
      newErrors.items = 'En az bir fatura kalemi eklemelisiniz'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateNewItem = () => {
    return newItem.description.trim() !== '' && 
           newItem.quantity > 0 && 
           newItem.unitPrice >= 0
  }

  const addItem = () => {
    if (!validateNewItem()) {
      alert('Lütfen tüm kalem bilgilerini doğru şekilde doldurun')
      return
    }

    const item: InvoiceItem = {
      id: Date.now(), // Temporary ID for new items
      productId: newItem.productId ? parseInt(newItem.productId) : undefined,
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      discountRate: newItem.discountRate,
      taxRate: newItem.taxRate,
      lineTotal: calculateLineTotal(newItem.quantity, newItem.unitPrice, newItem.discountRate, newItem.taxRate)
    }

    dispatch(addInvoiceItem(item))
    
    // Reset new item form
    setNewItem({
      productId: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discountRate: 0,
      taxRate: 20
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItem = { ...currentInvoiceItems[index] }
    ;(updatedItem as any)[field] = value
    
    // Recalculate line total
    updatedItem.lineTotal = calculateLineTotal(
      updatedItem.quantity,
      updatedItem.unitPrice,
      updatedItem.discountRate,
      updatedItem.taxRate
    )

    dispatch(updateInvoiceItem({ index, item: updatedItem }))
  }

  const removeItem = (index: number) => {
    dispatch(removeInvoiceItem(index))
  }

  const calculateLineTotal = (quantity: number, unitPrice: number, discountRate: number, taxRate: number) => {
    const subtotal = quantity * unitPrice
    const discountAmount = (subtotal * discountRate) / 100
    const discountedAmount = subtotal - discountAmount
    const taxAmount = (discountedAmount * taxRate) / 100
    return discountedAmount + taxAmount
  }

  const calculateTaxAmount = (quantity: number, unitPrice: number, discountRate: number, taxRate: number) => {
    const subtotal = quantity * unitPrice
    const discountAmount = (subtotal * discountRate) / 100
    const discountedAmount = subtotal - discountAmount
    return (discountedAmount * taxRate) / 100
  }

  const calculateSubtotal = (quantity: number, unitPrice: number, discountRate: number) => {
    const subtotal = quantity * unitPrice
    const discountAmount = (subtotal * discountRate) / 100
    return subtotal - discountAmount
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const invoiceData = {
        invoiceType: formData.invoiceType,
        customerId: parseInt(formData.customerId),
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate || undefined,
        currency: formData.currency,
        exchangeRate: formData.exchangeRate,
        notes: formData.notes || undefined,
        items: currentInvoiceItems.map(item => ({
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountRate: item.discountRate,
          taxRate: item.taxRate
        }))
      }

      if (selectedInvoice) {
        await dispatch(updateInvoice({ id: selectedInvoice.id, data: invoiceData }))
      } else {
        await dispatch(createInvoice(invoiceData))
      }
      
      onClose()
    } catch (error) {
      console.error('Fatura kaydetme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = async () => {
    if (selectedInvoice) {
      await dispatch(printInvoice(selectedInvoice.id))
    }
  }

  const handleClose = () => {
    dispatch(setInvoiceFormOpen(false))
    onClose()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: formData.currency
    }).format(amount)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {selectedInvoice ? 'Fatura Düzenle' : 'Yeni Fatura'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Basic Invoice Information */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth error={!!errors.invoiceType}>
                <InputLabel>Fatura Tipi</InputLabel>
                <Select
                  value={formData.invoiceType}
                  onChange={(e) => handleFormChange('invoiceType', e.target.value)}
                  label="Fatura Tipi"
                >
                  <MenuItem value="sales">Satış Faturası</MenuItem>
                  <MenuItem value="purchase">Alış Faturası</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth error={!!errors.customerId}>
                <InputLabel>Müşteri</InputLabel>
                <Select
                  value={formData.customerId}
                  onChange={(e) => handleFormChange('customerId', e.target.value)}
                  label="Müşteri"
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id.toString()}>
                      {customer.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.customerId && (
                <Typography variant="caption" color="error">
                  {errors.customerId}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fatura Tarihi"
                value={formData.invoiceDate}
                onChange={(e) => handleFormChange('invoiceDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={!!errors.invoiceDate}
                helperText={errors.invoiceDate}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Vade Tarihi"
                value={formData.dueDate}
                onChange={(e) => handleFormChange('dueDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Para Birimi</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={(e) => handleFormChange('currency', e.target.value)}
                  label="Para Birimi"
                >
                  <MenuItem value="TRY">TRY</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Döviz Kuru"
                value={formData.exchangeRate}
                onChange={(e) => handleFormChange('exchangeRate', parseFloat(e.target.value) || 1)}
                inputProps={{ min: 0, step: 0.0001 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notlar"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Add New Item Section */}
          <Typography variant="h6" gutterBottom>
            Yeni Kalem Ekle
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Ürün</InputLabel>
                <Select
                  value={newItem.productId}
                  onChange={(e) => handleNewItemChange('productId', e.target.value)}
                  label="Ürün"
                >
                  <MenuItem value="">Seçiniz</MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id.toString()}>
                      {product.productName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Açıklama"
                value={newItem.description}
                onChange={(e) => handleNewItemChange('description', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={6} sm={3} md={1}>
              <TextField
                fullWidth
                type="number"
                label="Miktar"
                value={newItem.quantity}
                onChange={(e) => handleNewItemChange('quantity', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                fullWidth
                type="number"
                label="Birim Fiyat"
                value={newItem.unitPrice}
                onChange={(e) => handleNewItemChange('unitPrice', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3} md={1}>
              <TextField
                fullWidth
                type="number"
                label="İskonto %"
                value={newItem.discountRate}
                onChange={(e) => handleNewItemChange('discountRate', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3} md={1}>
              <TextField
                fullWidth
                type="number"
                label="KDV %"
                value={newItem.taxRate}
                onChange={(e) => handleNewItemChange('taxRate', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addItem}
                disabled={!validateNewItem()}
              >
                Ekle
              </Button>
            </Grid>
          </Grid>

          {errors.items && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {errors.items}
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Invoice Items Table */}
          <Typography variant="h6" gutterBottom>
            Fatura Kalemleri
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Açıklama</TableCell>
                  <TableCell align="right">Miktar</TableCell>
                  <TableCell align="right">Birim Fiyat</TableCell>
                  <TableCell align="right">İskonto %</TableCell>
                  <TableCell align="right">Ara Toplam</TableCell>
                  <TableCell align="right">KDV %</TableCell>
                  <TableCell align="right">KDV Tutarı</TableCell>
                  <TableCell align="right">Toplam</TableCell>
                  <TableCell align="center">İşlem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentInvoiceItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      Henüz kalem eklenmedi
                    </TableCell>
                  </TableRow>
                ) : (
                  currentInvoiceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          size="small"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          variant="standard"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          variant="standard"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          variant="standard"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={item.discountRate}
                          onChange={(e) => updateItem(index, 'discountRate', parseFloat(e.target.value) || 0)}
                          variant="standard"
                          inputProps={{ min: 0, max: 100, step: 0.01 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(calculateSubtotal(item.quantity, item.unitPrice, item.discountRate))}
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={item.taxRate}
                          onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                          variant="standard"
                          inputProps={{ min: 0, max: 100, step: 0.01 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(calculateTaxAmount(item.quantity, item.unitPrice, item.discountRate, item.taxRate))}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.lineTotal)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeItem(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Invoice Totals */}
          {currentInvoiceItems.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ minWidth: 300 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Ara Toplam:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      {formatCurrency(invoiceTotals.subtotal)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">KDV:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      {formatCurrency(invoiceTotals.taxAmount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" fontWeight="bold">Genel Toplam:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" fontWeight="bold" align="right">
                      {formatCurrency(invoiceTotals.totalAmount)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button
          onClick={handleClose}
          startIcon={<CancelIcon />}
          disabled={loading}
        >
          İptal
        </Button>
        {selectedInvoice && (
          <Button
            onClick={handlePrint}
            startIcon={<PrintIcon />}
            disabled={loading}
          >
            Yazdır
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : (selectedInvoice ? 'Güncelle' : 'Kaydet')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InvoiceForm