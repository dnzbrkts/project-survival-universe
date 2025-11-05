import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchInvoices,
  fetchCustomers,
  setInvoiceFormOpen,
  setSelectedInvoice,
  setInvoiceFilters,
  deleteInvoice,
  approveInvoice,
  cancelInvoice,
  printInvoice,
  setInvoicePreviewOpen
} from '../../store/slices/invoiceSlice'
import { Invoice } from '../../types'
import InvoiceForm from './InvoiceForm'
import InvoicePreview from './InvoicePreview'

const InvoiceList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    invoices,
    invoicesLoading,
    invoicesError,
    invoicesPagination,
    invoiceFilters,
    customers,
    invoiceFormOpen,
    invoicePreviewOpen,
    selectedInvoice
  } = useSelector((state: RootState) => state.invoice)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchInvoices(invoiceFilters))
    dispatch(fetchCustomers({ limit: 1000 })) // Load all customers for filter
  }, [dispatch, invoiceFilters])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, invoiceId: number) => {
    setAnchorEl(event.currentTarget)
    setSelectedInvoiceId(invoiceId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedInvoiceId(null)
  }

  const handleEdit = () => {
    if (selectedInvoiceId) {
      const invoice = invoices.find(i => i.id === selectedInvoiceId)
      if (invoice) {
        dispatch(setSelectedInvoice(invoice))
        dispatch(setInvoiceFormOpen(true))
      }
    }
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (selectedInvoiceId) {
      if (window.confirm('Bu faturayı silmek istediğinizden emin misiniz?')) {
        await dispatch(deleteInvoice(selectedInvoiceId))
      }
    }
    handleMenuClose()
  }

  const handleApprove = async () => {
    if (selectedInvoiceId) {
      await dispatch(approveInvoice(selectedInvoiceId))
    }
    handleMenuClose()
  }

  const handleCancel = async () => {
    if (selectedInvoiceId) {
      if (window.confirm('Bu faturayı iptal etmek istediğinizden emin misiniz?')) {
        await dispatch(cancelInvoice(selectedInvoiceId))
      }
    }
    handleMenuClose()
  }

  const handlePrint = async () => {
    if (selectedInvoiceId) {
      await dispatch(printInvoice(selectedInvoiceId))
    }
    handleMenuClose()
  }

  const handlePreview = () => {
    if (selectedInvoiceId) {
      const invoice = invoices.find(i => i.id === selectedInvoiceId)
      if (invoice) {
        dispatch(setSelectedInvoice(invoice))
        dispatch(setInvoicePreviewOpen(true))
      }
    }
    handleMenuClose()
  }

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setInvoiceFilters({ page: newPage + 1 }))
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setInvoiceFilters({ limit: parseInt(event.target.value, 10), page: 1 }))
  }

  const handleFilterChange = (field: string, value: any) => {
    dispatch(setInvoiceFilters({ [field]: value, page: 1 }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default'
      case 'approved': return 'primary'
      case 'paid': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Taslak'
      case 'approved': return 'Onaylandı'
      case 'paid': return 'Ödendi'
      case 'cancelled': return 'İptal'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid': return 'error'
      case 'partial': return 'warning'
      case 'paid': return 'success'
      default: return 'default'
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'unpaid': return 'Ödenmedi'
      case 'partial': return 'Kısmi'
      case 'paid': return 'Ödendi'
      default: return status
    }
  }

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Fatura Yönetimi
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtrele
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => dispatch(setInvoiceFormOpen(true))}
          >
            Yeni Fatura
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Arama"
                  value={invoiceFilters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Fatura Tipi</InputLabel>
                  <Select
                    value={invoiceFilters.invoiceType || ''}
                    onChange={(e) => handleFilterChange('invoiceType', e.target.value)}
                    label="Fatura Tipi"
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    <MenuItem value="sales">Satış</MenuItem>
                    <MenuItem value="purchase">Alış</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Müşteri</InputLabel>
                  <Select
                    value={invoiceFilters.customerId || ''}
                    onChange={(e) => handleFilterChange('customerId', e.target.value)}
                    label="Müşteri"
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.companyName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Durum</InputLabel>
                  <Select
                    value={invoiceFilters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Durum"
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    <MenuItem value="draft">Taslak</MenuItem>
                    <MenuItem value="approved">Onaylandı</MenuItem>
                    <MenuItem value="paid">Ödendi</MenuItem>
                    <MenuItem value="cancelled">İptal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Başlangıç Tarihi"
                  value={invoiceFilters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Bitiş Tarihi"
                  value={invoiceFilters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {invoicesError && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{invoicesError}</Typography>
        </Box>
      )}

      {/* Invoice Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fatura No</TableCell>
                <TableCell>Tip</TableCell>
                <TableCell>Müşteri</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>Vade</TableCell>
                <TableCell align="right">Tutar</TableCell>
                <TableCell>Para Birimi</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Ödeme Durumu</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoicesLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Yükleniyor...
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Fatura bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.invoiceType === 'sales' ? 'Satış' : 'Alış'}
                        color={invoice.invoiceType === 'sales' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{invoice.customer?.companyName}</TableCell>
                    <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                    <TableCell>{invoice.dueDate ? formatDate(invoice.dueDate) : '-'}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </TableCell>
                    <TableCell>{invoice.currency}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(invoice.status)}
                        color={getStatusColor(invoice.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getPaymentStatusLabel(invoice.paymentStatus)}
                        color={getPaymentStatusColor(invoice.paymentStatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            dispatch(setSelectedInvoice(invoice))
                            dispatch(setInvoicePreviewOpen(true))
                          }}
                          title="Önizle"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            dispatch(setSelectedInvoice(invoice))
                            dispatch(setInvoiceFormOpen(true))
                          }}
                          title="Düzenle"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => dispatch(printInvoice(invoice.id))}
                          title="Yazdır"
                        >
                          <PrintIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => handleMenuClick(e, invoice.id)}
                          size="small"
                          title="Diğer İşlemler"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {invoicesPagination && (
          <TablePagination
            component="div"
            count={invoicesPagination.total}
            page={invoicesPagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={invoicesPagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Sayfa başına satır:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
          />
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePreview}>
          <VisibilityIcon sx={{ mr: 1 }} />
          Önizle
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Düzenle
        </MenuItem>
        <MenuItem onClick={handlePrint}>
          <PrintIcon sx={{ mr: 1 }} />
          Yazdır
        </MenuItem>
        {selectedInvoiceId && invoices.find(i => i.id === selectedInvoiceId)?.status === 'draft' && (
          <MenuItem onClick={handleApprove}>
            <CheckIcon sx={{ mr: 1 }} />
            Onayla
          </MenuItem>
        )}
        {selectedInvoiceId && invoices.find(i => i.id === selectedInvoiceId)?.status !== 'cancelled' && (
          <MenuItem onClick={handleCancel}>
            <CancelIcon sx={{ mr: 1 }} />
            İptal Et
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Sil
        </MenuItem>
      </Menu>

      {/* Invoice Form Dialog */}
      <InvoiceForm
        open={invoiceFormOpen}
        onClose={() => dispatch(setInvoiceFormOpen(false))}
      />

      {/* Invoice Preview Dialog */}
      <InvoicePreview
        open={invoicePreviewOpen}
        invoice={selectedInvoice}
        onClose={() => dispatch(setInvoicePreviewOpen(false))}
      />
    </Box>
  )
}

export default InvoiceList