import { BaseApi } from './baseApi'
import { ApiResponse, PaginatedResponse } from '../../types'

// Inventory types
export interface Product {
  id: number
  productCode: string
  productName: string
  description?: string
  categoryId?: number
  category?: ProductCategory
  unit: string
  criticalStockLevel: number
  purchasePrice: number
  salePrice: number
  taxRate: number
  currentStock?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: number
  categoryCode: string
  categoryName: string
  description?: string
  parentCategoryId?: number
  parentCategory?: ProductCategory
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface StockMovement {
  id: number
  productId: number
  product?: Product
  movementType: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  unitPrice?: number
  currency: string
  referenceType?: string
  referenceId?: number
  description?: string
  userId: number
  user?: {
    id: number
    firstName: string
    lastName: string
  }
  createdAt: string
}

export interface StockLevel {
  productId: number
  productCode: string
  productName: string
  currentStock: number
  criticalStockLevel: number
  isCritical: boolean
  unit: string
  category?: string
}

export interface CriticalStockAlert {
  productId: number
  productCode: string
  productName: string
  currentStock: number
  criticalStockLevel: number
  unit: string
  category?: string
  lastMovementDate?: string
}

export interface ProductFilters {
  search?: string
  categoryId?: number
  isActive?: boolean
  criticalStock?: boolean
  page?: number
  limit?: number
}

export interface CategoryFilters {
  search?: string
  isActive?: boolean
  parentId?: number
  page?: number
  limit?: number
}

export interface StockMovementFilters {
  productId?: number
  movementType?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface StockLevelFilters {
  productId?: number
  categoryId?: number
  criticalOnly?: boolean
  page?: number
  limit?: number
}

export interface CreateProductData {
  productCode: string
  productName: string
  description?: string
  categoryId?: number
  unit: string
  criticalStockLevel?: number
  purchasePrice?: number
  salePrice?: number
  taxRate?: number
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface CreateCategoryData {
  categoryCode: string
  categoryName: string
  description?: string
  parentCategoryId?: number
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CreateStockMovementData {
  productId: number
  movementType: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  unitPrice?: number
  currency?: string
  referenceType?: string
  referenceId?: number
  description?: string
}

export interface StockReportFilters {
  categoryId?: number
  includeMovements?: boolean
  startDate?: string
  endDate?: string
  format?: 'json' | 'excel' | 'pdf'
}

class InventoryApi extends BaseApi {
  // Products
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString())
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    if (filters.criticalStock !== undefined) params.append('criticalStock', filters.criticalStock.toString())
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    return this.get<PaginatedResponse<Product>>(`/inventory/products?${params.toString()}`)
  }

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    return this.get<ApiResponse<Product>>(`/inventory/products/${id}`)
  }

  async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    return this.post<ApiResponse<Product>>('/inventory/products', data)
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<ApiResponse<Product>> {
    return this.put<ApiResponse<Product>>(`/inventory/products/${id}`, data)
  }

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`/inventory/products/${id}`)
  }

  // Categories
  async getCategories(filters: CategoryFilters = {}): Promise<PaginatedResponse<ProductCategory>> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    if (filters.parentId) params.append('parentId', filters.parentId.toString())
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    return this.get<PaginatedResponse<ProductCategory>>(`/inventory/categories?${params.toString()}`)
  }

  async getCategoryById(id: number): Promise<ApiResponse<ProductCategory>> {
    return this.get<ApiResponse<ProductCategory>>(`/inventory/categories/${id}`)
  }

  async createCategory(data: CreateCategoryData): Promise<ApiResponse<ProductCategory>> {
    return this.post<ApiResponse<ProductCategory>>('/inventory/categories', data)
  }

  async updateCategory(id: number, data: UpdateCategoryData): Promise<ApiResponse<ProductCategory>> {
    return this.put<ApiResponse<ProductCategory>>(`/inventory/categories/${id}`, data)
  }

  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`/inventory/categories/${id}`)
  }

  // Stock Movements
  async createStockMovement(data: CreateStockMovementData): Promise<ApiResponse<StockMovement>> {
    return this.post<ApiResponse<StockMovement>>('/inventory/stock-movements', data)
  }

  async getStockMovements(filters: StockMovementFilters = {}): Promise<PaginatedResponse<StockMovement>> {
    const params = new URLSearchParams()
    
    if (filters.productId) params.append('productId', filters.productId.toString())
    if (filters.movementType) params.append('movementType', filters.movementType)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    return this.get<PaginatedResponse<StockMovement>>(`/inventory/stock-movements?${params.toString()}`)
  }

  // Stock Levels
  async getStockLevels(filters: StockLevelFilters = {}): Promise<PaginatedResponse<StockLevel>> {
    const params = new URLSearchParams()
    
    if (filters.productId) params.append('productId', filters.productId.toString())
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString())
    if (filters.criticalOnly !== undefined) params.append('criticalOnly', filters.criticalOnly.toString())
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    return this.get<PaginatedResponse<StockLevel>>(`/inventory/stock-levels?${params.toString()}`)
  }

  // Critical Stock Alerts
  async getCriticalStockAlerts(): Promise<ApiResponse<{ alerts: CriticalStockAlert[], count: number }>> {
    return this.get<ApiResponse<{ alerts: CriticalStockAlert[], count: number }>>('/inventory/critical-stock-alerts')
  }

  // Stock Reports
  async generateStockReport(filters: StockReportFilters = {}): Promise<any> {
    const params = new URLSearchParams()
    
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString())
    if (filters.includeMovements !== undefined) params.append('includeMovements', filters.includeMovements.toString())
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.format) params.append('format', filters.format)

    if (filters.format === 'excel' || filters.format === 'pdf') {
      // For file downloads, return blob
      const response = await this.client.get(`/inventory/stock-report?${params.toString()}`, {
        responseType: 'blob'
      })
      return response.data
    }

    return this.get(`/inventory/stock-report?${params.toString()}`)
  }
}

export const inventoryApi = new InventoryApi()
export default inventoryApi