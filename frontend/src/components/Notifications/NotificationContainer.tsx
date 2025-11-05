import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Snackbar,
  Alert,
  AlertTitle,
  Button,
  Box,
} from '@mui/material'

import { RootState } from '../../store'
import { removeNotification } from '../../store/slices/uiSlice'

const NotificationContainer: React.FC = () => {
  const dispatch = useDispatch()
  const { notifications } = useSelector((state: RootState) => state.ui)

  // Otomatik kapanma için timer
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration !== 0) { // 0 = manuel kapanma
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id))
        }, notification.duration || 4000)

        return () => clearTimeout(timer)
      }
    })
  }, [notifications, dispatch])

  const handleClose = (notificationId: string) => {
    dispatch(removeNotification(notificationId))
  }

  // En son bildirimi göster (stack mantığı)
  const currentNotification = notifications[notifications.length - 1]

  if (!currentNotification) {
    return null
  }

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }} // AppBar'ın altında göster
    >
      <Alert
        severity={currentNotification.type}
        onClose={() => handleClose(currentNotification.id)}
        sx={{ 
          minWidth: 300,
          maxWidth: 500,
        }}
        action={
          currentNotification.actions && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {currentNotification.actions.map((action, index) => (
                <Button
                  key={index}
                  size="small"
                  onClick={() => {
                    action.action()
                    handleClose(currentNotification.id)
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          )
        }
      >
        <AlertTitle>{currentNotification.title}</AlertTitle>
        {currentNotification.message}
      </Alert>
    </Snackbar>
  )
}

export default NotificationContainer