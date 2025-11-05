import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { 
  inventoryApi, 
  Product, 
  ProductCategory, 
  StockMovement, 
  StockLevel, 
  CriticalStockAlert,
  ProductFilters,
  CategoryFilters,
  StockMovementFilters,
  StockLevelFilters,
  CreateProductData,
  UpdateProductData,
  CreateCategoryData,
  UpdateCategoryData,
  CreateStockMovementData
} from '../../services/api/inventoryApi'
import { PaginatedResponse } from '../../types'

interface InventoryState {
  // Products
  products: Product[]
  selectedProduct: Product | null
  productsLoading: boolean
  productsError: string | null
  productsPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null

  // Categories
  categories: ProductCategory[]
  selectedCategory: ProductCategory | null
  categoriesLoading: boolean
  categoriesError: string | null
  categoriesPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null

  // Stock Movements
  stockMovements: StockMovement[]
  stockMovementsLoading: boolean
  stockMovementsError: string | null
  stockMovementsPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null

  // Stock Levels
  stockLevels: StockLevel[]
  stockLevelsLoading: boolean
  stockLevelsError: string | null
  stockLevelsPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null

  // Critical Stock Alerts
  criticalStockAlerts: CriticalStockAlert[]
  criticalStockCount: number
  criticalStockLoading: boolean
  criticalStockError: string | null

  // UI State
  productFormOpen: boolean
  categoryFormOpen: boolean
  stockMovementFormOpen: boolean
  selectedProductForMovement: Product | null

  // Filters
  productFilters: ProductFilters
  categoryFilters: CategoryFilters
  stockMovementFilters: StockMovementFilters
  stockLevelFilters: StockLevelFilters
}

const initialState: InventoryState = {
  // Products
  products: [],
  selectedProduct: null,
  productsLoading: false,
  productsError: null,
  productsPagination: null,

  // Categories
  categories: [],
  selectedCategory: null,
  categoriesLoading: false,
  categoriesError: null,
  categoriesPagination: null,

  // Stock Movements
  stockMovements: [],
  stockMovementsLoading: false,
  stockMovementsError: null,
  stockMovementsPagination: null,

  // Stock Levels
  stockLevels: [],
  stockLevelsLoading: false,
  stockLevelsError: null,
  stockLevelsPagination: null,

  // Critical Stock Alerts
  criticalStockAlerts: [],
  criticalStockCount: 0,
  criticalStockLoading: false,
  criticalStockError: null,

  // UI State
  productFormOpen: false,
  categoryFormOpen: false,
  stockMovementFormOpen: false,
  selectedProductForMovement: null,

  // Filters
  productFilters: { page: 1, limit: 10 },
  categoryFilters: { page: 1, limit: 10 },
  stockMovementFilters: { page: 1, limit: 10 },
  stockLevelFilters: { page: 1, limit: 10 }
}

// Async Thunks

// Products
export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (filters: ProductFilters, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getProducts(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ürünler yüklenirken hata oluştu')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'inventory/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getProductById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ürün yüklenirken hata oluştu')
    }
  }
)

export const createProduct = createAsyncThunk(
  'inventory/createProduct',
  async (data: CreateProductData, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.createProduct(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ürün oluşturulurken hata oluştu')
    }
  }
)

export const updateProduct = createAsyncThunk(
  'inventory/updateProduct',
  async ({ id, data }: { id: number; data: UpdateProductData }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.updateProduct(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ürün güncellenirken hata oluştu')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'inventory/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await inventoryApi.deleteProduct(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ürün silinirken hata oluştu')
    }
  }
)

// Categories
export const fetchCategories = createAsyncThunk(
  'inventory/fetchCategories',
  async (filters: CategoryFilters, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getCategories(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kategoriler yüklenirken hata oluştu')
    }
  }
)

export const createCategory = createAsyncThunk(
  'inventory/createCategory',
  async (data: CreateCategoryData, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.createCategory(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kategori oluşturulurken hata oluştu')
    }
  }
)

export const updateCategory = createAsyncThunk(
  'inventory/updateCategory',
  async ({ id, data }: { id: number; data: UpdateCategoryData }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.updateCategory(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kategori güncellenirken hata oluştu')
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'inventory/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await inventoryApi.deleteCategory(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kategori silinirken hata oluştu')
    }
  }
)

// Stock Movements
export const createStockMovement = createAsyncThunk(
  'inventory/createStockMovement',
  async (data: CreateStockMovementData, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.createStockMovement(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Stok hareketi oluşturulurken hata oluştu')
    }
  }
)

export const fetchStockMovements = createAsyncThunk(
  'inventory/fetchStockMovements',
  async (filters: StockMovementFilters, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getStockMovements(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Stok hareketleri yüklenirken hata oluştu')
    }
  }
)

// Stock Levels
export const fetchStockLevels = createAsyncThunk(
  'inventory/fetchStockLevels',
  async (filters: StockLevelFilters, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getStockLevels(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Stok seviyeleri yüklenirken hata oluştu')
    }
  }
)

// Critical Stock Alerts
export const fetchCriticalStockAlerts = createAsyncThunk(
  'inventory/fetchCriticalStockAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getCriticalStockAlerts()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kritik stok uyarıları yüklenirken hata oluştu')
    }
  }
)

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // UI Actions
    setProductFormOpen: (state, action: PayloadAction<boolean>) => {
      state.productFormOpen = action.payload
      if (!action.payload) {
        state.selectedProduct = null
      }
    },
    setCategoryFormOpen: (state, action: PayloadAction<boolean>) => {
      state.categoryFormOpen = action.payload
      if (!action.payload) {
        state.selectedCategory = null
      }
    },
    setStockMovementFormOpen: (state, action: PayloadAction<boolean>) => {
      state.stockMovementFormOpen = action.payload
      if (!action.payload) {
        state.selectedProductForMovement = null
      }
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<ProductCategory | null>) => {
      state.selectedCategory = action.payload
    },
    setSelectedProductForMovement: (state, action: PayloadAction<Product | null>) => {
      state.selectedProductForMovement = action.payload
    },

    // Filter Actions
    setProductFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.productFilters = { ...state.productFilters, ...action.payload }
    },
    setCategoryFilters: (state, action: PayloadAction<Partial<CategoryFilters>>) => {
      state.categoryFilters = { ...state.categoryFilters, ...action.payload }
    },
    setStockMovementFilters: (state, action: PayloadAction<Partial<StockMovementFilters>>) => {
      state.stockMovementFilters = { ...state.stockMovementFilters, ...action.payload }
    },
    setStockLevelFilters: (state, action: PayloadAction<Partial<StockLevelFilters>>) => {
      state.stockLevelFilters = { ...state.stockLevelFilters, ...action.payload }
    },

    // Clear Actions
    clearProductsError: (state) => {
      state.productsError = null
    },
    clearCategoriesError: (state) => {
      state.categoriesError = null
    },
    clearStockMovementsError: (state) => {
      state.stockMovementsError = null
    },
    clearStockLevelsError: (state) => {
      state.stockLevelsError = null
    },
    clearCriticalStockError: (state) => {
      state.criticalStockError = null
    }
  },
  extraReducers: (builder) => {
    // Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true
        state.productsError = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<PaginatedResponse<Product>>) => {
        state.productsLoading = false
        state.products = action.payload.data
        state.productsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false
        state.productsError = action.payload as string
      })

    builder
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.selectedProduct = action.payload
      })

    builder
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.unshift(action.payload)
        state.productFormOpen = false
      })

    builder
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        state.selectedProduct = action.payload
        state.productFormOpen = false
      })

    builder
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.products = state.products.filter(p => p.id !== action.payload)
      })

    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true
        state.categoriesError = null
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<PaginatedResponse<ProductCategory>>) => {
        state.categoriesLoading = false
        state.categories = action.payload.data
        state.categoriesPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false
        state.categoriesError = action.payload as string
      })

    builder
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<ProductCategory>) => {
        state.categories.unshift(action.payload)
        state.categoryFormOpen = false
      })

    builder
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<ProductCategory>) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
        state.selectedCategory = action.payload
        state.categoryFormOpen = false
      })

    builder
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.categories = state.categories.filter(c => c.id !== action.payload)
      })

    // Stock Movements
    builder
      .addCase(createStockMovement.fulfilled, (state, action: PayloadAction<StockMovement>) => {
        state.stockMovements.unshift(action.payload)
        state.stockMovementFormOpen = false
        state.selectedProductForMovement = null
      })

    builder
      .addCase(fetchStockMovements.pending, (state) => {
        state.stockMovementsLoading = true
        state.stockMovementsError = null
      })
      .addCase(fetchStockMovements.fulfilled, (state, action: PayloadAction<PaginatedResponse<StockMovement>>) => {
        state.stockMovementsLoading = false
        state.stockMovements = action.payload.data
        state.stockMovementsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.stockMovementsLoading = false
        state.stockMovementsError = action.payload as string
      })

    // Stock Levels
    builder
      .addCase(fetchStockLevels.pending, (state) => {
        state.stockLevelsLoading = true
        state.stockLevelsError = null
      })
      .addCase(fetchStockLevels.fulfilled, (state, action: PayloadAction<PaginatedResponse<StockLevel>>) => {
        state.stockLevelsLoading = false
        state.stockLevels = action.payload.data
        state.stockLevelsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(fetchStockLevels.rejected, (state, action) => {
        state.stockLevelsLoading = false
        state.stockLevelsError = action.payload as string
      })

    // Critical Stock Alerts
    builder
      .addCase(fetchCriticalStockAlerts.pending, (state) => {
        state.criticalStockLoading = true
        state.criticalStockError = null
      })
      .addCase(fetchCriticalStockAlerts.fulfilled, (state, action: PayloadAction<{ alerts: CriticalStockAlert[], count: number }>) => {
        state.criticalStockLoading = false
        state.criticalStockAlerts = action.payload.alerts
        state.criticalStockCount = action.payload.count
      })
      .addCase(fetchCriticalStockAlerts.rejected, (state, action) => {
        state.criticalStockLoading = false
        state.criticalStockError = action.payload as string
      })
  }
})

export const {
  setProductFormOpen,
  setCategoryFormOpen,
  setStockMovementFormOpen,
  setSelectedProduct,
  setSelectedCategory,
  setSelectedProductForMovement,
  setProductFilters,
  setCategoryFilters,
  setStockMovementFilters,
  setStockLevelFilters,
  clearProductsError,
  clearCategoriesError,
  clearStockMovementsError,
  clearStockLevelsError,
  clearCriticalStockError
} = inventorySlice.actions

export default inventorySlice.reducer