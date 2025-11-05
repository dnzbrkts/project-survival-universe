import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ModuleDefinition, ModuleRegistry, ModuleSystem } from '../../core/ModuleSystem'
import { systemApi } from '../../services/api/systemApi'

interface ModuleState {
  modules: ModuleDefinition[]
  activeModules: ModuleDefinition[]
  isLoading: boolean
  error: string | null
  selectedModule: ModuleDefinition | null
}

const initialState: ModuleState = {
  modules: [],
  activeModules: [],
  isLoading: false,
  error: null,
  selectedModule: null,
}

// Async thunks
export const loadModules = createAsyncThunk(
  'modules/loadModules',
  async (_, { rejectWithValue }) => {
    try {
      const modules = await systemApi.getModules()
      return modules
    } catch (error: any) {
      return rejectWithValue(error.message || 'Modüller yüklenemedi')
    }
  }
)

export const toggleModule = createAsyncThunk(
  'modules/toggleModule',
  async (
    { moduleCode, activate }: { moduleCode: string; activate: boolean },
    { rejectWithValue }
  ) => {
    try {
      // Backend'e modül durumu güncelleme isteği gönder
      await systemApi.updateModuleStatus(moduleCode, activate ? 'ACTIVE' : 'INACTIVE')
      
      // Frontend modül sistemini güncelle
      await ModuleSystem.toggleModule(moduleCode, activate)
      
      return { moduleCode, activate }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Modül durumu güncellenemedi')
    }
  }
)

export const updateModuleConfig = createAsyncThunk(
  'modules/updateModuleConfig',
  async (
    { moduleCode, config }: { moduleCode: string; config: any },
    { rejectWithValue }
  ) => {
    try {
      await systemApi.updateModuleConfig(moduleCode, config)
      return { moduleCode, config }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Modül konfigürasyonu güncellenemedi')
    }
  }
)

export const refreshModuleStatus = createAsyncThunk(
  'modules/refreshModuleStatus',
  async () => {
    const allModules = ModuleRegistry.getAllModules()
    const activeModules = ModuleRegistry.getActiveModules()
    
    return {
      modules: allModules,
      activeModules,
    }
  }
)

const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setSelectedModule: (state, action: PayloadAction<ModuleDefinition | null>) => {
      state.selectedModule = action.payload
    },
    updateModuleStatus: (state, action: PayloadAction<{ moduleCode: string; status: ModuleDefinition['status'] }>) => {
      const { moduleCode, status } = action.payload
      const module = state.modules.find(m => m.code === moduleCode)
      if (module) {
        module.status = status
      }
      
      // Aktif modüller listesini güncelle
      if (status === 'ACTIVE') {
        if (!state.activeModules.find(m => m.code === moduleCode)) {
          state.activeModules.push(module!)
        }
      } else {
        state.activeModules = state.activeModules.filter(m => m.code !== moduleCode)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load modules
      .addCase(loadModules.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadModules.fulfilled, (state, action) => {
        state.isLoading = false
        state.modules = action.payload
        state.activeModules = action.payload.filter(m => m.status === 'ACTIVE')
        state.error = null
      })
      .addCase(loadModules.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Toggle module
      .addCase(toggleModule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(toggleModule.fulfilled, (state, action) => {
        state.isLoading = false
        const { moduleCode, activate } = action.payload
        
        const module = state.modules.find(m => m.code === moduleCode)
        if (module) {
          module.status = activate ? 'ACTIVE' : 'INACTIVE'
        }
        
        // Aktif modüller listesini güncelle
        if (activate) {
          if (!state.activeModules.find(m => m.code === moduleCode)) {
            state.activeModules.push(module!)
          }
        } else {
          state.activeModules = state.activeModules.filter(m => m.code !== moduleCode)
        }
        
        state.error = null
      })
      .addCase(toggleModule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Update module config
      .addCase(updateModuleConfig.fulfilled, (state, action) => {
        const { moduleCode, config } = action.payload
        const module = state.modules.find(m => m.code === moduleCode)
        if (module) {
          // Config'i modül objesine ekle (eğer ModuleDefinition interface'i genişletilirse)
          ;(module as any).config = config
        }
      })
      
      // Refresh module status
      .addCase(refreshModuleStatus.fulfilled, (state, action) => {
        state.modules = action.payload.modules
        state.activeModules = action.payload.activeModules
      })
  },
})

export const { 
  setError, 
  clearError, 
  setSelectedModule, 
  updateModuleStatus 
} = moduleSlice.actions

export default moduleSlice.reducer