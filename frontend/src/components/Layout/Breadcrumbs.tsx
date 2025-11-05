import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
} from '@mui/material'
import { NavigateNext } from '@mui/icons-material'

import { RootState } from '../../store'

const Breadcrumbs: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { breadcrumbs, pageTitle } = useSelector((state: RootState) => state.ui)

  // Otomatik breadcrumb oluşturma (eğer manuel breadcrumb yoksa)
  const generateAutoBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const autoBreadcrumbs = [
      { label: 'Ana Sayfa', path: '/' }
    ]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Segment'i daha okunabilir hale getir
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      autoBreadcrumbs.push({
        label,
        path: index === pathSegments.length - 1 ? undefined : currentPath
      })
    })

    return autoBreadcrumbs
  }

  const currentBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : generateAutoBreadcrumbs()

  const handleBreadcrumbClick = (path?: string) => {
    if (path) {
      navigate(path)
    }
  }

  return (
    <Box>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 1 }}
      >
        {currentBreadcrumbs.map((breadcrumb, index) => {
          const isLast = index === currentBreadcrumbs.length - 1

          if (isLast || !breadcrumb.path) {
            return (
              <Typography
                key={breadcrumb.label}
                color="text.primary"
                fontWeight={isLast ? 'bold' : 'normal'}
              >
                {breadcrumb.label}
              </Typography>
            )
          }

          return (
            <Link
              key={breadcrumb.label}
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleBreadcrumbClick(breadcrumb.path)
              }}
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {breadcrumb.label}
            </Link>
          )
        })}
      </MuiBreadcrumbs>

      {/* Page Title */}
      <Typography variant="h4" component="h1" fontWeight="bold">
        {pageTitle}
      </Typography>
    </Box>
  )
}

export default Breadcrumbs