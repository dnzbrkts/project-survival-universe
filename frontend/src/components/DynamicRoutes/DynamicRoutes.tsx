import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

import { RootState } from '../../store'
import { DynamicComponentLoader } from '../../core/ModuleSystem'
import ModuleGuard from '../Guards/ModuleGuard'

const DynamicRoutes: React.FC = () => {
  const { activeModules } = useSelector((state: RootState) => state.modules)

  // Loading bileşeni
  const LoadingComponent = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
    >
      <CircularProgress />
    </Box>
  )

  return (
    <Routes>
      {activeModules.map((module) =>
        module.routes.map((route) => {
          // Bileşeni dinamik olarak yükle
          const Component = DynamicComponentLoader.loadComponent(
            module.code,
            route.component
          )

          if (!Component) {
            return null
          }

          return (
            <Route
              key={`${module.code}-${route.path}`}
              path={route.path}
              element={
                <ModuleGuard
                  moduleCode={module.code}
                  permission={route.permissions?.[0]}
                >
                  <Suspense fallback={<LoadingComponent />}>
                    <Component />
                  </Suspense>
                </ModuleGuard>
              }
            />
          )
        })
      )}
    </Routes>
  )
}

export default DynamicRoutes