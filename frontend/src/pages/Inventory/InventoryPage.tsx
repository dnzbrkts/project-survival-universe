import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper
} from '@mui/material'
import { Inventory, Category, TrendingUp, Assignment } from '@mui/icons-material'

// Components
import ProductsTab from './components/ProductsTab'
import CategoriesTab from './components/CategoriesTab'
import StockLevelsTab from './components/StockLevelsTab'
import StockMovementsTab from './components/StockMovementsTab'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `inventory-tab-${index}`,
    'aria-controls': `inventory-tabpanel-${index}`,
  }
}

const InventoryPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stok Yönetimi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ürünlerinizi, kategorilerinizi ve stok hareketlerinizi yönetin
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="inventory tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<Inventory />} 
              label="Ürünler" 
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<Category />} 
              label="Kategoriler" 
              {...a11yProps(1)} 
            />
            <Tab 
              icon={<TrendingUp />} 
              label="Stok Seviyeleri" 
              {...a11yProps(2)} 
            />
            <Tab 
              icon={<Assignment />} 
              label="Stok Hareketleri" 
              {...a11yProps(3)} 
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ProductsTab />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <CategoriesTab />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <StockLevelsTab />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <StockMovementsTab />
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default InventoryPage