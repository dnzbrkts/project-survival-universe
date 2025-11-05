import { configureStore } from '@reduxjs/toolkit'

// Slices
import appSlice from './slices/appSlice'
import authSlice from './slices/authSlice'
import moduleSlice from './slices/moduleSlice'
import permissionSlice from './slices/permissionSlice'
import uiSlice from './slices/uiSlice'
import dashboardSlice from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    app: appSlice,
    auth: authSlice,
    modules: moduleSlice,
    permissions: permissionSlice,
    ui: uiSlice,
    dashboard: dashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch