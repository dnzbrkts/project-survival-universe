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
  Paper,
  LinearProgress
} from '@mui/material'
import {
  Search,
  Refresh,
  Warning,
  CheckCircle,
  Error,
  TrendingUp,
  Add
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  fetchStockLevels,
  fetchCategories,
  setStockLevelFilters,
  setSelectedProductForMovement,
  setStockMovementFormOpen,
  clearStockLevelsError
} from '../../../store/slices/inventorySlice'
import { StockLevel, StockLevelFilters } from '../../../services/api/inventoryApi'

// Components
import StockMovementFormDialog from './StockMovementFormDialog'

const StockLevelsTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    stockLevels,
    categories,
    stockLevelsLoading,
    stockLevelsError,
    stockLevelsPagination,
    stockLevelFilters,
    stockMovementFormOpen
  } = useSelector((state: RootState) => state.inventory)

  const [searchTerm, setSearchTerm] = useState(stockLevelFilters.productId?.toString() || '')

  useEffect(() => {
    dispatch(fetchStockLevels(stockLevelFilters))
    dispatch(fetchCategories({ limit: 100 })) // Load categories for filter
  }, [dispatch, stockLevelFilters])

  const handleSearch = () => {
    const productId = searchTerm ? parseInt(searchTerm) : undefined
    dispatch(setStockLevelFilters({ ...stockLevelFilters, productId, page: 1 }))
  }

  const handleFilterChange = (field: keyof StockLevelFilters, value: any) => {
    dispatch(setStockLevelFilters({ ...stockLevelFilters, [field]: value, page: 1 }))
  }

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setStockLevelFilters({ ...stockLevelFilters, page: newPage + 1 }))
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStockLevelFilters({ 
      ...stockLevelFilters, 
      limit: parseInt(event.target.value, 10),
      page: 1 
    }))
  }

  const handleRefresh = () => {
    dispatch(fetchStockLevels(stockLevelFilters))
  }

  const handleAddStockMovement = (stockLevel: StockLevel) => {
    // Create a minimal product object for the stock movement form
    const product = {
      id: stockLevel.productId,
      productCode: stockLevel.productCode,
      productName: stockLevel.productName,
      unit: stockLevel.unit,
      currentStock: stockLevel.currentStock,
      criticalStockLevel: stockLevel.criticalStockLevel,
      // Add required fields with default values
      description: '',
      categoryId: undefined,
      purchasePrice: 0,
      salePrice: 0,
      taxRate: 20,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    }
    
    dispatch(setSelectedProductForMovement(product))
    dispatch(setStockMovementFormOpen(true))
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

  const getStockStatusIcon = (currentStock: number, criticalLevel: number) => {
    if (currentStock <= 0) return <Error />
    if (currentStock <= criticalLevel) return <Warning />
    return <CheckCircle />
  }

  const getStockPercentage = (currentStock: number, criticalLevel: number) => {
    if (criticalLevel === 0) return 100
    const maxStock = criticalLevel * 3 // Assume max stock is 3x critical level for visualization
    return Math.min((currentStock / maxStock) * 100, 100)
  }

  // Calculate summary statistics
  const totalProducts = stockLevels.length
  const criticalProducts = stockLevels.filter(item => item.isCritical).length
  const outOfStockProducts = stockLevels.filter(item => item.currentStock <= 0).length
  const normalProducts = totalProducts - criticalProducts - outOfStockProducts

  if (stockLevelsError) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => dispatch(clearStockLevelsError())}>
            Kapat
          </Button>
        }
      >
        {stockLevelsError}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Toplam Ürün
                  </Typography>
                  <Typography variant="h4">
                    {totalProducts}
                  </Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Normal Stok
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {normalProducts}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Kritik Stok
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {criticalProducts}
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Stokta Yok
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {outOfStockProducts}
                  </Typography>
                </Box>
                <Error color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                label="Ürün ID ile Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                type="number"
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
                  value={stockLevelFilters.categoryId || ''}
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={stockLevelFilters.criticalOnly || false}
                    onChange={(e) => handleFilterChange('criticalOnly', e.target.checked)}
                  />
                }
                label="Sadece Kritik Stok"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Yenile">
                <IconButton onClick={handleRefresh} size="large">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stock Levels Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ürün Kodu</TableCell>
                <TableCell>Ürün Adı</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell align="center">Mevcut Stok</TableCell>
                <TableCell align="center">Kritik Seviye</TableCell>
                <TableCell align="center">Stok Durumu</TableCell>
                <TableCell align="center">Stok Göstergesi</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockLevelsLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : stockLevels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Stok seviyesi bulunamadı
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                stockLevels.map((stockLevel) => (
                  <TableRow key={stockLevel.productId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {stockLevel.productCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {stockLevel.productName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {stockLevel.category ? (
                        <Chip 
                          label={stockLevel.category} 
                          size="small" 
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {stockLevel.currentStock} {stockLevel.unit}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {stockLevel.criticalStockLevel} {stockLevel.unit}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStockStatusText(stockLevel.currentStock, stockLevel.criticalStockLevel)}
                        color={getStockStatusColor(stockLevel.currentStock, stockLevel.criticalStockLevel)}
                        size="small"
                        icon={getStockStatusIcon(stockLevel.currentStock, stockLevel.criticalStockLevel)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ width: '100%', maxWidth: 100, mx: 'auto' }}>
                        <LinearProgress
                          variant="determinate"
                          value={getStockPercentage(stockLevel.currentStock, stockLevel.criticalStockLevel)}
                          color={getStockStatusColor(stockLevel.currentStock, stockLevel.criticalStockLevel)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {Math.round(getStockPercentage(stockLevel.currentStock, stockLevel.criticalStockLevel))}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Stok Hareketi Ekle">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleAddStockMovement(stockLevel)}
                        >
                          <Add />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {stockLevelsPagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={stockLevelsPagination.total}
            rowsPerPage={stockLevelsPagination.limit}
            page={stockLevelsPagination.page - 1}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Sayfa başına satır:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} / ${count !== -1 ? count : `${to}'den fazla`}`
            }
          />
        )}
      </Paper>

      {/* Stock Movement Form Dialog */}
      <StockMovementFormDialog 
        open={stockMovementFormOpen}
        onClose={() => dispatch(setStockMovementFormOpen(false))}
      />
    </Box>
  )
}

export default StockLevelsTab