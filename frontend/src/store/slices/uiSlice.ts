import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}

interface UIState {
  // Layout
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Theme
  darkMode: boolean
  primaryColor: string
  
  // Loading states
  globalLoading: boolean
  loadingStates: Record<string, boolean>
  
  // Notifications
  notifications: Notification[]
  
  // Modals
  modals: Record<string, {
    open: boolean
    data?: any
  }>
  
  // Breadcrumbs
  breadcrumbs: Array<{
    label: string
    path?: string
  }>
  
  // Page settings
  pageTitle: string
  pageSubtitle?: string
}

const initialState: UIState = {
  // Layout
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  // Theme
  darkMode: localStorage.getItem('darkMode') === 'true',
  primaryColor: localStorage.getItem('primaryColor') || '#1976d2',
  
  // Loading
  globalLoading: false,
  loadingStates: {},
  
  // Notifications
  notifications: [],
  
  // Modals
  modals: {},
  
  // Breadcrumbs
  breadcrumbs: [],
  
  // Page
  pageTitle: 'İşletme Yönetim Sistemi',
  pageSubtitle: undefined,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Layout actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    
    // Theme actions
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode.toString())
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
      localStorage.setItem('darkMode', action.payload.toString())
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload
      localStorage.setItem('primaryColor', action.payload)
    },
    
    // Loading actions
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      const { key, loading } = action.payload
      if (loading) {
        state.loadingStates[key] = true
      } else {
        delete state.loadingStates[key]
      }
    },
    clearAllLoading: (state) => {
      state.globalLoading = false
      state.loadingStates = {}
    },
    
    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...action.payload,
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    // Modal actions
    openModal: (state, action: PayloadAction<{ key: string; data?: any }>) => {
      const { key, data } = action.payload
      state.modals[key] = { open: true, data }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const key = action.payload
      if (state.modals[key]) {
        state.modals[key].open = false
        state.modals[key].data = undefined
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key].open = false
        state.modals[key].data = undefined
      })
    },
    
    // Breadcrumb actions
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; path?: string }>>) => {
      state.breadcrumbs = action.payload
    },
    addBreadcrumb: (state, action: PayloadAction<{ label: string; path?: string }>) => {
      state.breadcrumbs.push(action.payload)
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = []
    },
    
    // Page actions
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload
    },
    setPageSubtitle: (state, action: PayloadAction<string | undefined>) => {
      state.pageSubtitle = action.payload
    },
    setPageInfo: (state, action: PayloadAction<{ title: string; subtitle?: string }>) => {
      state.pageTitle = action.payload.title
      state.pageSubtitle = action.payload.subtitle
    },
  },
})

export const {
  // Layout
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  
  // Theme
  toggleDarkMode,
  setDarkMode,
  setPrimaryColor,
  
  // Loading
  setGlobalLoading,
  setLoading,
  clearAllLoading,
  
  // Notifications
  addNotification,
  removeNotification,
  clearNotifications,
  
  // Modals
  openModal,
  closeModal,
  closeAllModals,
  
  // Breadcrumbs
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
  
  // Page
  setPageTitle,
  setPageSubtitle,
  setPageInfo,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectIsLoading = (key: string) => (state: any) => {
  return state.ui.loadingStates[key] || false
}

export const selectModalState = (key: string) => (state: any) => {
  return state.ui.modals[key] || { open: false, data: undefined }
}