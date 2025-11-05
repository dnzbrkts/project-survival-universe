import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
} from '@mui/material'
import {
  Settings,
  CheckCircle,
  Error,
  Warning,
  Pause,
  Info,
} from '@mui/icons-material'

import { RootState } from '../../store'
import { setPageInfo } from '../../store/slices/uiSlice'
import { loadModules, toggleModule } from '../../store/slices/moduleSlice'
import { ModuleDefinition } from '../../core/ModuleSystem'

const ModuleManagementPage: React.FC = () => {
  const dispatch = useDispatch()
  const { modules, isLoading } = useSelector((state: RootState) => state.modules)
  const [selectedModule, setSelectedModule] = useState<ModuleDefinition | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(setPageInfo({
      title: 'Modül Yönetimi',
      subtitle: 'Sistem modüllerini yönetin ve yapılandırın'
    }))

    // Modülleri yükle
    dispatch(loadModules() as any)
  }, [dispatch])

  const handleModuleToggle = async (moduleCode: string, currentStatus: string) => {
    const activate = currentStatus !== 'ACTIVE'
    await dispatch(toggleModule({ moduleCode, activate }) as any)
  }

  const handleModuleDetail = (module: ModuleDefinition) => {
    setSelectedModule(module)
    setDetailDialogOpen(true)
  }

  const getStatusColor = (status: ModuleDefinition['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'INACTIVE':
        return 'default'
      case 'MAINTENANCE':
        return 'warning'
      case 'TRIAL':
        return 'info'
      case 'EXPIRED':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: ModuleDefinition['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle />
      case 'INACTIVE':
        return <Pause />
      case 'MAINTENANCE':
        return <Warning />
      case 'TRIAL':
        return <Info />
      case 'EXPIRED':
        return <Error />
      default:
        return <Pause />
    }
  }

  const getStatusText = (status: ModuleDefinition['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktif'
      case 'INACTIVE':
        return 'Pasif'
      case 'MAINTENANCE':
        return 'Bakımda'
      case 'TRIAL':
        return 'Deneme'
      case 'EXPIRED':
        return 'Süresi Dolmuş'
      default:
        return 'Bilinmiyor'
    }
  }

  // Modülleri kategoriye göre grupla
  const groupedModules = modules.reduce((acc, module) => {
    const category = module.category || 'GENERAL'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(module)
    return acc
  }, {} as Record<string, ModuleDefinition[]>)

  const categoryNames: Record<string, string> = {
    'CORE': 'Temel Modüller',
    'OPERASYON': 'Operasyon Modülleri',
    'SATIS': 'Satış Modülleri',
    'MUHASEBE': 'Muhasebe Modülleri',
    'IK': 'İnsan Kaynakları',
    'ENTEGRASYON': 'Entegrasyon Modülleri',
    'SISTEM': 'Sistem Modülleri',
    'GENERAL': 'Genel Modüller',
  }

  return (
    <Box>
      {/* Özet Bilgiler */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {modules.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Modül
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {modules.filter(m => m.status === 'ACTIVE').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktif Modül
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {modules.filter(m => m.status === 'MAINTENANCE').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bakımda
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {modules.filter(m => m.status === 'EXPIRED').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Süresi Dolmuş
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modül Listesi */}
      {Object.entries(groupedModules).map(([category, categoryModules]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {categoryNames[category] || category}
          </Typography>
          
          <Grid container spacing={2}>
            {categoryModules.map((module) => (
              <Grid item xs={12} sm={6} md={4} key={module.code}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: module.color || 'primary.main',
                          mr: 2,
                        }}
                      >
                        {module.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" noWrap>
                          {module.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          v{module.version}
                        </Typography>
                      </Box>
                      <Switch
                        checked={module.status === 'ACTIVE'}
                        onChange={() => handleModuleToggle(module.code, module.status)}
                        disabled={isLoading || module.status === 'EXPIRED'}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        icon={getStatusIcon(module.status)}
                        label={getStatusText(module.status)}
                        color={getStatusColor(module.status)}
                        size="small"
                      />
                      
                      <Button
                        size="small"
                        startIcon={<Settings />}
                        onClick={() => handleModuleDetail(module)}
                      >
                        Detay
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Modül Detay Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedModule?.name} - Modül Detayları
        </DialogTitle>
        <DialogContent>
          {selectedModule && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {selectedModule.description}
                </Typography>
              </Alert>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Modül Kodu
                  </Typography>
                  <Typography variant="body1">
                    {selectedModule.code}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sürüm
                  </Typography>
                  <Typography variant="body1">
                    {selectedModule.version}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Kategori
                  </Typography>
                  <Typography variant="body1">
                    {categoryNames[selectedModule.category] || selectedModule.category}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Durum
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedModule.status)}
                    label={getStatusText(selectedModule.status)}
                    color={getStatusColor(selectedModule.status)}
                    size="small"
                  />
                </Grid>
              </Grid>

              {selectedModule.permissions.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Gerekli Yetkiler
                  </Typography>
                  <List dense>
                    {selectedModule.permissions.map((permission, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={permission} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {selectedModule.routes.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Modül Sayfaları
                  </Typography>
                  <List dense>
                    {selectedModule.routes.map((route, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={route.path}
                            secondary={route.component}
                          />
                        </ListItem>
                        {index < selectedModule.routes.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ModuleManagementPage