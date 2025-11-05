import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  Typography
} from '@mui/material'
import { Warning, Error, Info, CheckCircle } from '@mui/icons-material'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  severity?: 'error' | 'warning' | 'info' | 'success'
  loading?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  severity = 'warning',
  loading = false
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <Error color="error" sx={{ fontSize: 48 }} />
      case 'warning':
        return <Warning color="warning" sx={{ fontSize: 48 }} />
      case 'info':
        return <Info color="info" sx={{ fontSize: 48 }} />
      case 'success':
        return <CheckCircle color="success" sx={{ fontSize: 48 }} />
      default:
        return <Warning color="warning" sx={{ fontSize: 48 }} />
    }
  }

  const getConfirmButtonColor = () => {
    switch (severity) {
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      case 'success':
        return 'success'
      default:
        return 'primary'
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          {getIcon()}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pt: 1 }}>
        <DialogContentText sx={{ fontSize: '1rem', color: 'text.primary' }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 3, px: 3 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getConfirmButtonColor()}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {loading ? 'İşleniyor...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog