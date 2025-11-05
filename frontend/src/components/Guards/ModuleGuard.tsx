import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Alert, AlertTitle } from '@mui/material'
import { Lock as LockIcon } from '@mui/icons-material'
import { RootState } from '../../store'
import { PermissionManager } from '../../core/ModuleSystem'

interface ModuleGuardProps {
  children: React.ReactNode
  moduleCode: string
  permission?: string
  fallback?: React.ReactNode
}

const ModuleGuard: React.FC<ModuleGuardProps> = ({ 
  children, 
  moduleCode, 
  permission,
  fallback 
}) => {
  const { modules } = useSelector((state: RootState) => state.modules)
  
  // Modül var mı kontrol et
  const module = modules.find(m => m.code === moduleCode)
  if (!module) {
    return (
      <Box p={3}>
        <Alert severity="error" icon={<LockIcon />}>
          <AlertTitle>Modül Bulunamadı</AlertTitle>
          {moduleCode} modülü sistemde bulunamadı.
        </Alert>
      </Box>
    )
  }

  // Modül aktif mi kontrol et
  if (module.status !== 'ACTIVE') {
    return (
      <Box p={3}>
        <Alert severity="warning" icon={<LockIcon />}>
          <AlertTitle>Modül Aktif Değil</AlertTitle>
          {module.name} modülü şu anda aktif değil.
        </Alert>
      </Box>
    )
  }

  // Modül erişimi kontrol et
  if (!PermissionManager.hasModuleAccess(moduleCode)) {
    return fallback || (
      <Box p={3}>
        <Alert severity="error" icon={<LockIcon />}>
          <AlertTitle>Erişim Engellendi</AlertTitle>
          {module.name} modülüne erişim yetkiniz bulunmuyor.
        </Alert>
      </Box>
    )
  }

  // Özel yetki kontrolü
  if (permission && !PermissionManager.hasPermission(permission)) {
    return fallback || (
      <Box p={3}>
        <Alert severity="error" icon={<LockIcon />}>
          <AlertTitle>Yetki Gerekli</AlertTitle>
          Bu işlem için gerekli yetkiniz bulunmuyor.
        </Alert>
      </Box>
    )
  }

  return <>{children}</>
}

export default ModuleGuard