import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { PermissionManager } from '../core/ModuleSystem'

export interface UsePermissionsResult {
  userPermissions: string[]
  userRoles: string[]
  hasPermission: (permission: string) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasModuleAccess: (moduleCode: string) => boolean
  hasRouteAccess: (moduleCode: string, routePath: string) => boolean
  isLoading: boolean
}

export const usePermissions = (): UsePermissionsResult => {
  const { userPermissions, userRoles, isLoading } = useSelector((state: RootState) => state.permissions)

  const hasPermission = (permission: string): boolean => {
    return PermissionManager.hasPermission(permission)
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return PermissionManager.hasAllPermissions(permissions)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return PermissionManager.hasAnyPermission(permissions)
  }

  const hasModuleAccess = (moduleCode: string): boolean => {
    return PermissionManager.hasModuleAccess(moduleCode)
  }

  const hasRouteAccess = (moduleCode: string, routePath: string): boolean => {
    return PermissionManager.hasRouteAccess(moduleCode, routePath)
  }

  return {
    userPermissions,
    userRoles,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasModuleAccess,
    hasRouteAccess,
    isLoading,
  }
}

export default usePermissions