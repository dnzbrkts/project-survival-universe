import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Search,
  Refresh,
  Warning,
  Visibility
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  fetchProducts,
  fetchCategories,
  setProductFilters,
  setProductFormOpen,
  setSelectedProduct,
  deleteProduct,
  clearProductsError
} from '../../../store/slices/inventorySlice'
import { Product, ProductFilters } from '../../../services/api/inventoryApi'

// Components
import ProductFormDialog from './ProductFormDialog'
import ConfirmDialog from '../../../components/common/ConfirmDialog'

const ProductsTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    products,
    categories,
    productsLoading,
    productsError,
    productsPagination,
    productFilters,
    productFormOpen
  } = useSelector((state: RootState) => state.inventory)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState(productFilters.search || '')

  useEffect(() => {
    dispatch(fetchProducts(productFilters))
    dispatch(fetchCategories({ limit: 100 })) // Load categories for filter
  }, [dispatch, productFilters])

  const handleSearch = () => {
    dispatch(setProductFilters({ ...productFilters, search: searchTerm, page: 1 }))
  }

  const handleFilterChange = (field: keyof ProductFilters, value: any) => {
    dispatch(setProductFilters({ ...productFilters, [field]: value, page: 1 }))
  }

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setProductFilters({ ...productFilters, page: newPage + 1 }))
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setProductFilters({ 
      ...productFilters, 
      limit: parseInt(event.target.value, 10),
      page: 1 
    }))
  }

  const handleAddProduct = () => {
    dispatch(setSelectedProduct(null))
    dispatch(setProductFormOpen(true))
  }

  const handleEditProduct = (product: Product) => {
    dispatch(setSelectedProduct(product))
    dispatch(setProductFormOpen(true))
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete.id))
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      // Refresh the list
      dispatch(fetchProducts(productFilters))
    }
  }

  const handleRefresh = () => {
    dispatch(fetchProducts(productFilters))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const getStockStatusColor = (currentStock: number, criticalLevel: number) => {
    if (currentStock <= 0) return 'error'
    if (currentStock <= criticalLevel) return 'warning'
    return 'success'
  }

  const getStockStatusText = (currentStock: number, criticalLevel: number) => {
    if (currentStock <= 0) return 'Stokta Yok'
    if (currentStock <= criticalLevel) return 'Kritik Seviye'
    return 'Normal'
  }

  if (productsError) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => dispatch(clearProductsError())}>
            Kapat
          </Button>
        }
      >
        {productsError}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtreler
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Ürün Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch} size="small">
                      <Search />
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={productFilters.categoryId || ''}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                  label="Kategori"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={productFilters.criticalStock || false}
                    onChange={(e) => handleFilterChange('criticalStock', e.target.checked)}
                  />
                }
                label="Sadece Kritik Stok"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={productFilters.isActive !== false}
                    onChange={(e) => handleFilterChange('isActive', e.target.checked)}
                  />
                }
                label="Sadece Aktif"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddProduct}
                  fullWidth
                >
                  Yeni Ürün
                </Button>
                <Tooltip title="Yenile">
                  <IconButton onClick={handleRefresh}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ürün Kodu</TableCell>
                <TableCell>Ürün Adı</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Birim</TableCell>
                <TableCell align="right">Alış Fiyatı</TableCell>
                <TableCell align="right">Satış Fiyatı</TableCell>
                <TableCell align="center">Stok Durumu</TableCell>
                <TableCell align="center">Durum</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ürün bulunamadı
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.productCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.productName}
                      </Typography>
                      {product.description && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {product.description.length > 50 
                            ? `${product.description.substring(0, 50)}...` 
                            : product.description
                          }
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.category ? (
                        <Chip 
                          label={product.category.categoryName} 
                          size="small" 
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.unit}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatPrice(product.purchasePrice)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatPrice(product.salePrice)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStockStatusText(product.currentStock || 0, product.criticalStockLevel)}
                        color={getStockStatusColor(product.currentStock || 0, product.criticalStockLevel)}
                        size="small"
                        icon={product.currentStock && product.currentStock <= product.criticalStockLevel ? <Warning /> : undefined}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        Mevcut: {product.currentStock || 0} {product.unit}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={product.isActive ? 'Aktif' : 'Pasif'}
                        color={product.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Görüntüle">
                          <IconButton size="small" onClick={() => handleEditProduct(product)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Düzenle">
                          <IconButton size="small" onClick={() => handleEditProduct(product)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {productsPagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={productsPagination.total}
            rowsPerPage={productsPagination.limit}
            page={productsPagination.page - 1}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Sayfa başına satır:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} / ${count !== -1 ? count : `${to}'den fazla`}`
            }
          />
        )}
      </Paper>

      {/* Product Form Dialog */}
      <ProductFormDialog 
        open={productFormOpen}
        onClose={() => dispatch(setProductFormOpen(false))}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Ürünü Sil"
        message={`"${productToDelete?.productName}" ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setProductToDelete(null)
        }}
        confirmText="Sil"
        cancelText="İptal"
        severity="error"
      />
    </Box>
  )
}

export default ProductsTab