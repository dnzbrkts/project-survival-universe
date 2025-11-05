import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PermissionManager } from '../../core/ModuleSystem'
import { authApi } from '../../services/api/authApi'

interface Permission {
  id: number
  code: string
  name: string
  description?: string
  category: string
  moduleCode?: string
}

interface Role {
  id: number
  code: string
  name: string
  description?: string
  permissions: string[]
}

interface PermissionState {
  userPermissions: string[]
  userRoles: string[]
  allPermissions: Permission[]
  allRoles: Role[]
  isLoading: boolean
  error: string | null
}

const initialState: PermissionState = {
  userPermissions: [],
  userRoles: [],
  allPermissions: [],
  allRoles: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const loadUserPermissions = createAsyncThunk(
  'permissions/loadUserPermissions',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await authApi.getUserPermissions(userId)
      
      // Permission Manager'ı güncelle
      PermissionManager.loadUserPermissions(
        response.permissions,
        response.roles
      )
      
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Kullanıcı yetkileri yüklenemedi')
    }
  }
)

export const loadAllPermissions = createAsyncThunk(
  'permissions/loadAllPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getAllPermissions()
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Yetkiler yüklenemedi')
    }
  }
)

export const loadAllRoles = createAsyncThunk(
  'permissions/loadAllRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getAllRoles()
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Roller yüklenemedi')
    }
  }
)

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    updateUserPermissions: (state, action: PayloadAction<{ permissions: string[]; roles: string[] }>) => {
      state.userPermissions = action.payload.permissions
      state.userRoles = action.payload.roles
      
      // Permission Manager'ı güncelle
      PermissionManager.loadUserPermissions(
        action.payload.permissions,
        action.payload.roles
      )
    },
    clearUserPermissions: (state) => {
      state.userPermissions = []
      state.userRoles = []
      
      // Permission Manager'ı temizle
      PermissionManager.loadUserPermissions([], [])
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user permissions
      .addCase(loadUserPermissions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadUserPermissions.fulfilled, (state, action) => {
        state.isLoading = false
        state.userPermissions = action.payload.permissions
        state.userRoles = action.payload.roles
        state.error = null
      })
      .addCase(loadUserPermissions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Load all permissions
      .addCase(loadAllPermissions.fulfilled, (state, action) => {
        state.allPermissions = action.payload
      })
      .addCase(loadAllPermissions.rejected, (state, action) => {
        state.error = action.payload as string
      })
      
      // Load all roles
      .addCase(loadAllRoles.fulfilled, (state, action) => {
        state.allRoles = action.payload
      })
      .addCase(loadAllRoles.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { 
  setError, 
  clearError, 
  updateUserPermissions, 
  clearUserPermissions 
} = permissionSlice.actions

export default permissionSlice.reducer

// Selectors
export const selectHasPermission = (permission: string) => (state: any) => {
  return PermissionManager.hasPermission(permission)
}

export const selectHasModuleAccess = (moduleCode: string) => (state: any) => {
  return PermissionManager.hasModuleAccess(moduleCode)
}

export const selectHasRouteAccess = (moduleCode: string, routePath: string) => (state: any) => {
  return PermissionManager.hasRouteAccess(moduleCode, routePath)
}