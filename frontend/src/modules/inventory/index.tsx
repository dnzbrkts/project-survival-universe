import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const InventoryModule: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Stok Yönetimi
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Stok Modülü
          </Typography>
          <Typography variant="body1">
            Bu sayfa dinamik olarak yüklenen stok yönetimi modülüdür.
            Modül sistemi başarıyla çalışıyor!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default InventoryModule