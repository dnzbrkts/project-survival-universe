import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Search,
  Refresh,
  Folder,
  FolderOpen
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  fetchCategories,
  setCategoryFilters,
  setCategoryFormOpen,
  setSelectedCategory,
  deleteCategory,
  clearCategoriesError
} from '../../../store/slices/inventorySlice'
import { ProductCategory, CategoryFilters } from '../../../services/api/inventoryApi'

// Components
import CategoryFormDialog from './CategoryFormDialog'
import ConfirmDialog from '../../../components/common/ConfirmDialog'

const CategoriesTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    categories,
    categoriesLoading,
    categoriesError,
    categoriesPagination,
    categoryFilters,
    categoryFormOpen
  } = useSelector((state: RootState) => state.inventory)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null)
  const [searchTerm, setSearchTerm] = useState(categoryFilters.search || '')

  useEffect(() => {
    dispatch(fetchCategories(categoryFilters))
  }, [dispatch, categoryFilters])

  const handleSearch = () => {
    dispatch(setCategoryFilters({ ...categoryFilters, search: searchTerm, page: 1 }))
  }

  const handleFilterChange = (field: keyof CategoryFilters, value: any) => {
    dispatch(setCategoryFilters({ ...categoryFilters, [field]: value, page: 1 }))
  }

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setCategoryFilters({ ...categoryFilters, page: newPage + 1 }))
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCategoryFilters({ 
      ...categoryFilters, 
      limit: parseInt(event.target.value, 10),
      page: 1 
    }))
  }

  const handleAddCategory = () => {
    dispatch(setSelectedCategory(null))
    dispatch(setCategoryFormOpen(true))
  }

  const handleEditCategory = (category: ProductCategory) => {
    dispatch(setSelectedCategory(category))
    dispatch(setCategoryFormOpen(true))
  }

  const handleDeleteClick = (category: ProductCategory) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      await dispatch(deleteCategory(categoryToDelete.id))
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      // Refresh the list
      dispatch(fetchCategories(categoryFilters))
    }
  }

  const handleRefresh = () => {
    dispatch(fetchCategories(categoryFilters))
  }

  if (categoriesError) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => dispatch(clearCategoriesError())}>
            Kapat
          </Button>
        }
      >
        {categoriesError}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtreler
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Kategori Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch} size="small">
                      <Search />
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={categoryFilters.isActive !== false}
                    onChange={(e) => handleFilterChange('isActive', e.target.checked)}
                  />
                }
                label="Sadece Aktif"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddCategory}
                  fullWidth
                >
                  Yeni Kategori
                </Button>
                <Tooltip title="Yenile">
                  <IconButton onClick={handleRefresh}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kategori Kodu</TableCell>
                <TableCell>Kategori Adı</TableCell>
                <TableCell>Açıklama</TableCell>
                <TableCell>Üst Kategori</TableCell>
                <TableCell align="center">Durum</TableCell>
                <TableCell align="center">Oluşturma Tarihi</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriesLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Kategori bulunamadı
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.parentCategoryId ? <Folder color="action" /> : <FolderOpen color="primary" />}
                        <Typography variant="body2" fontWeight="medium">
                          {category.categoryCode}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {category.categoryName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.description ? (
                          category.description.length > 50 
                            ? `${category.description.substring(0, 50)}...` 
                            : category.description
                        ) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {category.parentCategory ? (
                        <Chip 
                          label={category.parentCategory.categoryName} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      ) : (
                        <Chip 
                          label="Ana Kategori" 
                          size="small" 
                          color="success"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={category.isActive ? 'Aktif' : 'Pasif'}
                        color={category.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Düzenle">
                          <IconButton size="small" onClick={() => handleEditCategory(category)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteClick(category)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {categoriesPagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={categoriesPagination.total}
            rowsPerPage={categoriesPagination.limit}
            page={categoriesPagination.page - 1}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Sayfa başına satır:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} / ${count !== -1 ? count : `${to}'den fazla`}`
            }
          />
        )}
      </Paper>

      {/* Category Form Dialog */}
      <CategoryFormDialog 
        open={categoryFormOpen}
        onClose={() => dispatch(setCategoryFormOpen(false))}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Kategoriyi Sil"
        message={`"${categoryToDelete?.categoryName}" kategorisini silmek istediğinizden emin misiniz? Bu kategoriye bağlı ürünler varsa önce onları başka bir kategoriye taşımanız gerekir.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setCategoryToDelete(null)
        }}
        confirmText="Sil"
        cancelText="İptal"
        severity="error"
      />
    </Box>
  )
}

export default CategoriesTab