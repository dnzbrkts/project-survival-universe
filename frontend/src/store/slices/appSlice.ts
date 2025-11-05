import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ModuleSystem } from '../../core/ModuleSystem'
import { systemApi } from '../../services/api/systemApi'

interface AppState {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  version: string
  systemInfo: {
    totalModules: number
    activeModules: number
    loadedComponents: number
  } | null
}

const initialState: AppState = {
  isInitialized: false,
  isLoading: false,
  error: null,
  version: '1.0.0',
  systemInfo: null,
}

// Async thunks
export const initializeApp = createAsyncThunk(
  'app/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // Sistem bilgilerini al
      const systemInfo = await systemApi.getSystemInfo()
      
      // Modülleri al ve modül sistemini başlat
      const modules = await systemApi.getModules()
      await ModuleSystem.initialize(modules)
      
      return {
        systemInfo: ModuleSystem.getSystemStatus(),
        modules,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sistem başlatma hatası')
    }
  }
)

export const refreshSystemInfo = createAsyncThunk(
  'app/refreshSystemInfo',
  async () => {
    return ModuleSystem.getSystemStatus()
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize app
      .addCase(initializeApp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoading = false
        state.isInitialized = true
        state.systemInfo = action.payload.systemInfo
        state.error = null
      })
      .addCase(initializeApp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Refresh system info
      .addCase(refreshSystemInfo.fulfilled, (state, action) => {
        state.systemInfo = action.payload
      })
  },
})

export const { setError, clearError, setLoading } = appSlice.actions
export default appSlice.reducer