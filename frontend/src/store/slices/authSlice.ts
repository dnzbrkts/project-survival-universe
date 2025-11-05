import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authApi } from '../../services/api/authApi'
import { ModuleSystem, PermissionManager } from '../../core/ModuleSystem'

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  permissions: string[]
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  userMenu: any[]
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  userMenu: [],
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', response.token)
      
      // Kullanıcı oturumunu başlat ve menüyü oluştur
      const userMenu = ModuleSystem.initializeUserSession(
        response.user.permissions,
        response.user.roles
      )
      
      return {
        user: response.user,
        token: response.token,
        userMenu,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Giriş hatası')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token')
    // Kullanıcı yetkilerini temizle
    PermissionManager.loadUserPermissions([], [])
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token bulunamadı')
      }

      const response = await authApi.verifyToken()
      
      // Kullanıcı oturumunu başlat ve menüyü oluştur
      const userMenu = ModuleSystem.initializeUserSession(
        response.user.permissions,
        response.user.roles
      )
      
      return {
        user: response.user,
        token,
        userMenu,
      }
    } catch (error: any) {
      localStorage.removeItem('token')
      return rejectWithValue(error.message || 'Token doğrulama hatası')
    }
  }
)

export const refreshUserMenu = createAsyncThunk(
  'auth/refreshUserMenu',
  async (_, { getState }) => {
    const state = getState() as any
    const user = state.auth.user
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı')
    }
    
    return ModuleSystem.initializeUserSession(user.permissions, user.roles)
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    updateUserMenu: (state, action: PayloadAction<any[]>) => {
      state.userMenu = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.userMenu = action.payload.userMenu
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.userMenu = []
        state.error = null
      })
      
      // Check auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.userMenu = action.payload.userMenu
        state.error = null
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.userMenu = []
        state.error = action.payload as string
      })
      
      // Refresh user menu
      .addCase(refreshUserMenu.fulfilled, (state, action) => {
        state.userMenu = action.payload
      })
  },
})

export const { setError, clearError, updateUserMenu } = authSlice.actions
export default authSlice.reducer