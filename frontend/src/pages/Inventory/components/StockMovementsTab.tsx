import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Search,
  Refresh,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Build,
  Add
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  fetchStockMovements,
  fetchProducts,
  setStockMovementFilters,
  setStockMovementFormOpen,
  clearStockMovementsError
} from '../../../store/slices/inventorySlice'
import { StockMovement, StockMovementFilters } from '../../../services/api/inventoryApi'

// Components
import StockMovementFormDialog from './StockMovementFormDialog'

const StockMovementsTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    stockMovements,
    products,
    stockMovementsLoading,
    stockMovementsError,
    stockMovementsPagination,
    stockMovementFilters,
    stockMovementFormOpen
  } = useSelector((state: RootState) => state.inventory)

  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [startDate, setStartDate] = useState(stockMovementFilters.startDate || '')
  const [endDate, setEndDate] = useState(stockMovementFilters.endDate || '')

  useEffect(() => {
    dispatch(fetchStockMovements(stockMovementFilters))
    dispatch(fetchProducts({ limit: 100 })) // Load products for filter
  }, [dispatch, stockMovementFilters])

  const handleFilterChange = (field: keyof StockMovementFilters, value: any) => {
    dispatch(setStockMovementFilters({ ...stockMovementFilters, [field]: value, page: 1 }))
  }

  const handleDateFilter = () => {
    dispatch(setStockMovementFilters({ 
      ...stockMovementFilters, 
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page: 1 
    }))
  }

  const handleProductSearch = () => {
    const productId = productSearchTerm ? parseInt(productSearchTerm) : undefined
    dispatch(setStockMovementFilters({ ...stockMovementFilters, productId, page: 1 }))
  }

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setStockMovementFilters({ ...stockMovementFilters, page: newPage + 1 }))
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStockMovementFilters({ 
      ...stockMovementFilters, 
      limit: parseInt(event.target.value, 10),
      page: 1 
    }))
  }

  const handleRefresh = () => {
    dispatch(fetchStockMovements(stockMovementFilters))
  }

  const handleAddStockMovement = () => {
    dispatch(setStockMovementFormOpen(true))
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
        return 'Giriş'
      case 'out':
        return 'Çıkış'
      case 'transfer':
        return 'Transfer'
      case 'adjustment':
        return 'Düzeltme'
      default:
        return type
    }
  }

  const formatPrice = (price: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  // Calculate summary statistics
  const totalMovements = stockMovements.length
  const inMovements = stockMovements.filter(m => m.movementType === 'in').length
  const outMovements = stockMovements.filter(m => m.movementType === 'out').length
  const otherMovements = totalMovements - inMovements - outMovements

  if (stockMovementsError) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => dispatch(clearStockMovementsError())}>
            Kapat
          </Button>
        }
      >
        {stockMovementsError}
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
                    Toplam Hareket
                  </Typography>
                  <Typography variant="h4">
                    {totalMovements}
                  </Typography>
                </Box>
                <SwapHoriz color="primary" sx={{ fontSize: 40 }} />
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
                    Stok Girişi
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {inMovements}
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
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
                    Stok Çıkışı
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {outMovements}
                  </Typography>
                </Box>
                <TrendingDown color="error" sx={{ fontSize: 40 }} />
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
                    Diğer
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {otherMovements}
                  </Typography>
                </Box>
                <Build color="info" sx={{ fontSize: 40 }} />
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
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Ürün ID"
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleProductSearch()}
                type="number"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleProductSearch} size="small">
                      <Search />
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Hareket Tipi</InputLabel>
                <Select
                  value={stockMovementFilters.movementType || ''}
                  onChange={(e) => handleFilterChange('movementType', e.target.value || undefined)}
                  label="Hareket Tipi"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="in">Giriş</MenuItem>
                  <MenuItem value="out">Çıkış</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                  <MenuItem value="adjustment">Düzeltme</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Başlangıç Tarihi"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Bitiş Tarihi"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleDateFilter}
              >
                Tarih Filtrele
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddStockMovement}
                  fullWidth
                >
                  Yeni Hareket
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

      {/* Stock Movements Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tarih</TableCell>
                <TableCell>Ürün</TableCell>
                <TableCell align="center">Hareket Tipi</TableCell>
                <TableCell align="right">Miktar</TableCell>
                <TableCell align="right">Birim Fiyat</TableCell>
                <TableCell align="right">Toplam</TableCell>
                <TableCell>Referans</TableCell>
                <TableCell>Kullanıcı</TableCell>
                <TableCell>Açıklama</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockMovementsLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : stockMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Stok hareketi bulunamadı
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                stockMovements.map((movement) => (
                  <TableRow key={movement.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(movement.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {movement.product?.productName || `Ürün ID: ${movement.productId}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {movement.product?.productCode || ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getMovementTypeText(movement.movementType)}
                        color={getMovementTypeColor(movement.movementType) as any}
                        size="small"
                        icon={getMovementTypeIcon(movement.movementType)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {movement.movementType === 'out' ? '-' : '+'}{movement.quantity}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {movement.product?.unit || ''}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {movement.unitPrice ? formatPrice(movement.unitPrice, movement.currency) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {movement.unitPrice ? formatPrice(movement.quantity * movement.unitPrice, movement.currency) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {movement.referenceType ? (
                        <Box>
                          <Typography variant="body2">
                            {movement.referenceType}
                          </Typography>
                          {movement.referenceId && (
                            <Typography variant="caption" color="text.secondary">
                              ID: {movement.referenceId}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {movement.user ? `${movement.user.firstName} ${movement.user.lastName}` : `ID: ${movement.userId}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {movement.description ? (
                          movement.description.length > 30 
                            ? `${movement.description.substring(0, 30)}...` 
                            : movement.description
                        ) : '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {stockMovementsPagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={stockMovementsPagination.total}
            rowsPerPage={stockMovementsPagination.limit}
            page={stockMovementsPagination.page - 1}
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

export default StockMovementsTab