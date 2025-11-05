import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider
} from '@mui/material'
import {
  Print as PrintIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { setInvoicePreviewOpen, printInvoice } from '../../store/slices/invoiceSlice'
import { Invoice } from '../../types'

interface InvoicePreviewProps {
  open: boolean
  invoice: Invoice | null
  onClose: () => void
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ open, invoice, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()

  const handlePrint = async () => {
    if (invoice) {
      await dispatch(printInvoice(invoice.id))
    }
  }

  const handleClose = () => {
    dispatch(setInvoicePreviewOpen(false))
    onClose()
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

  if (!invoice) {
    return null
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Fatura Önizleme - {invoice.invoiceNumber}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ p: 2 }}>
          {/* Company Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              ŞİRKET ADI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Şirket Adresi, Telefon, Email
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Invoice Header */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {invoice.invoiceType === 'sales' ? 'SATIŞ FATURASI' : 'ALIŞ FATURASI'}
              </Typography>
              <Typography variant="body2">
                <strong>Fatura No:</strong> {invoice.invoiceNumber}
              </Typography>
              <Typography variant="body2">
                <strong>Tarih:</strong> {formatDate(invoice.invoiceDate)}
              </Typography>
              {invoice.dueDate && (
                <Typography variant="body2">
                  <strong>Vade Tarihi:</strong> {formatDate(invoice.dueDate)}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                MÜŞTERİ BİLGİLERİ
              </Typography>
              <Typography variant="body2">
                <strong>{invoice.customer?.companyName}</strong>
              </Typography>
              {invoice.customer?.taxNumber && (
                <Typography variant="body2">
                  Vergi No: {invoice.customer.taxNumber}
                </Typography>
              )}
              {invoice.customer?.taxOffice && (
                <Typography variant="body2">
                  Vergi Dairesi: {invoice.customer.taxOffice}
                </Typography>
              )}
              {invoice.customer?.address && (
                <Typography variant="body2">
                  Adres: {invoice.customer.address}
                </Typography>
              )}
              {invoice.customer?.phone && (
                <Typography variant="body2">
                  Telefon: {invoice.customer.phone}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Invoice Items */}
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Açıklama</strong></TableCell>
                  <TableCell align="right"><strong>Miktar</strong></TableCell>
                  <TableCell align="right"><strong>Birim Fiyat</strong></TableCell>
                  <TableCell align="right"><strong>İskonto %</strong></TableCell>
                  <TableCell align="right"><strong>Ara Toplam</strong></TableCell>
                  <TableCell align="right"><strong>KDV %</strong></TableCell>
                  <TableCell align="right"><strong>KDV Tutarı</strong></TableCell>
                  <TableCell align="right"><strong>Toplam</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.items?.map((item, index) => {
                  const subtotal = item.quantity * item.unitPrice
                  const discountAmount = (subtotal * item.discountRate) / 100
                  const discountedAmount = subtotal - discountAmount
                  const taxAmount = (discountedAmount * item.taxRate) / 100
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unitPrice, invoice.currency)}</TableCell>
                      <TableCell align="right">{item.discountRate}%</TableCell>
                      <TableCell align="right">{formatCurrency(discountedAmount, invoice.currency)}</TableCell>
                      <TableCell align="right">{item.taxRate}%</TableCell>
                      <TableCell align="right">{formatCurrency(taxAmount, invoice.currency)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.lineTotal, invoice.currency)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Invoice Totals */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ minWidth: 300 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body1"><strong>Ara Toplam:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    {formatCurrency(invoice.subtotal, invoice.currency)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1"><strong>KDV:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    {formatCurrency(invoice.taxAmount, invoice.currency)}
                  </Typography>
                </Grid>
                <Divider sx={{ width: '100%', my: 1 }} />
                <Grid item xs={6}>
                  <Typography variant="h6" fontWeight="bold">GENEL TOPLAM:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" fontWeight="bold" align="right">
                    {formatCurrency(invoice.totalAmount, invoice.currency)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Notes */}
          {invoice.notes && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notlar
              </Typography>
              <Typography variant="body2">
                {invoice.notes}
              </Typography>
            </Box>
          )}

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Bu fatura elektronik ortamda oluşturulmuştur.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button
          onClick={handleClose}
          startIcon={<CloseIcon />}
        >
          Kapat
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={<PrintIcon />}
        >
          Yazdır
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InvoicePreview