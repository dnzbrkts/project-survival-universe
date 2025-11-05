import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { 
  ModuleSystem, 
  ModuleRegistry, 
  PermissionManager,
  MenuGenerator,
  ModuleDefinition 
} from '../core/ModuleSystem'
import { updateUserMenu } from '../store/slices/authSlice'
import { refreshModuleStatus } from '../store/slices/moduleSlice'

export interface UseModuleSystemResult {
  modules: ModuleDefinition[]
  activeModules: ModuleDefinition[]
  userMenu: any[]
  isLoading: boolean
  error: string | null
  hasModuleAccess: (moduleCode: string) => boolean
  hasPermission: (permission: string) => boolean
  refreshModules: () => void
  toggleModule: (moduleCode: string, activate: boolean) => Promise<void>
}

export const useModuleSystem = (): UseModuleSystemResult => {
  const dispatch = useDispatch()
  const { modules, activeModules, isLoading, error } = useSelector((state: RootState) => state.modules)
  const { userMenu, user } = useSelector((state: RootState) => state.auth)
  const [localError, setLocalError] = useState<string | null>(null)

  // Modül durumunu yenile
  const refreshModules = () => {
    dispatch(refreshModuleStatus() as any)
  }

  // Modül toggle
  const toggleModule = async (moduleCode: string, activate: boolean) => {
    try {
      await ModuleSystem.toggleModule(moduleCode, activate)
      refreshModules()
      
      // Kullanıcı menüsünü yenile
      if (user) {
        const newMenu = MenuGenerator.generateUserMenu()
        dispatch(updateUserMenu(newMenu))
      }
    } catch (error: any) {
      setLocalError(error.message || 'Modül durumu değiştirilemedi')
    }
  }

  // Yetki kontrol fonksiyonları
  const hasModuleAccess = (moduleCode: string): boolean => {
    return PermissionManager.hasModuleAccess(moduleCode)
  }

  const hasPermission = (permission: string): boolean => {
    return PermissionManager.hasPermission(permission)
  }

  // Modül sistemi durumunu izle
  useEffect(() => {
    const interval = setInterval(() => {
      const systemStatus = ModuleSystem.getSystemStatus()
      if (systemStatus.isInitialized) {
        refreshModules()
      }
    }, 30000) // 30 saniyede bir kontrol et

    return () => clearInterval(interval)
  }, [])

  return {
    modules,
    activeModules,
    userMenu,
    isLoading,
    error: error || localError,
    hasModuleAccess,
    hasPermission,
    refreshModules,
    toggleModule,
  }
}

export default useModuleSystem