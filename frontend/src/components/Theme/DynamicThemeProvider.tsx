import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { createAppTheme } from '../../theme'
import { RootState } from '../../store'

interface DynamicThemeProviderProps {
  children: React.ReactNode
}

const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({ children }) => {
  const { darkMode, primaryColor } = useSelector((state: RootState) => state.ui)
  
  const theme = createAppTheme(darkMode)
  
  // Primary color'ı dinamik olarak güncelle
  if (primaryColor !== '#1976d2') {
    theme.palette.primary.main = primaryColor
  }

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

export default DynamicThemeProvider