// Global type definitions

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  roles: Role[]
  permissions: string[]
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  code: string
  name: string
  description?: string
  permissions: Permission[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: number
  code: string
  name: string
  description?: string
  category: string
  moduleCode?: string
  createdAt: string
}

export interface SystemModule {
  id: number
  code: string
  name: string
  description?: string
  version: string
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'TRIAL' | 'EXPIRED'
  category: string
  icon?: string
  color?: string
  sortOrder: number
  requiresLicense: boolean
  licenseExpiresAt?: string
  createdAt: string
  updatedAt: string
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'date' | 'textarea'
  required?: boolean
  options?: Array<{ value: any; label: string }>
  validation?: any
  placeholder?: string
  helperText?: string
}

export interface FormConfig {
  fields: FormField[]
  submitLabel?: string
  resetLabel?: string
  layout?: 'vertical' | 'horizontal'
}

// Table types
export interface TableColumn {
  id: string
  label: string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  format?: (value: any) => string
  sortable?: boolean
  filterable?: boolean
}

export interface TableConfig {
  columns: TableColumn[]
  pagination?: boolean
  sorting?: boolean
  filtering?: boolean
  selection?: boolean
  actions?: Array<{
    label: string
    icon?: string
    onClick: (row: any) => void
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  }>
}

// Navigation types
export interface NavigationItem {
  id: string
  label: string
  path?: string
  icon?: string
  children?: NavigationItem[]
  permission?: string
  moduleCode?: string
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
  createdAt: string
}

// Filter types
export interface FilterOption {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between'
  value: any
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  filters?: FilterOption[]
  sort?: SortOption[]
}

// Dashboard types
export interface DashboardWidget {
  id: string
  title: string
  type: 'stat' | 'chart' | 'table' | 'list'
  size: 'small' | 'medium' | 'large'
  data: any
  config?: any
}

export interface DashboardLayout {
  widgets: DashboardWidget[]
  layout: Array<{
    i: string
    x: number
    y: number
    w: number
    h: number
  }>
}

// Export/Import types
export interface ExportConfig {
  format: 'excel' | 'csv' | 'pdf'
  filename?: string
  columns?: string[]
  filters?: FilterOption[]
}

export interface ImportConfig {
  format: 'excel' | 'csv'
  mapping: Record<string, string>
  validation?: Record<string, any>
}

// Audit types
export interface AuditLog {
  id: number
  userId: number
  action: string
  resource: string
  resourceId?: number
  oldValues?: any
  newValues?: any
  ipAddress: string
  userAgent: string
  createdAt: string
}

// System types
export interface SystemInfo {
  version: string
  environment: string
  uptime: number
  memoryUsage: {
    used: number
    total: number
  }
  activeConnections: number
  moduleStatus: {
    total: number
    active: number
    inactive: number
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark'
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  fontSize: number
}

// Settings types
export interface UserSettings {
  theme: ThemeConfig
  language: string
  timezone: string
  dateFormat: string
  timeFormat: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
}

// File types
export interface FileInfo {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  uploadedBy: number
}

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// API endpoint types
export type ApiEndpoint = string
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export interface LoadingProps {
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'inherit'
}

export interface ErrorProps {
  error?: string | null
  onRetry?: () => void
}

// Hook return types
export interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export interface UseFormResult<T> {
  values: T
  errors: Record<keyof T, string>
  touched: Record<keyof T, boolean>
  handleChange: (field: keyof T, value: any) => void
  handleSubmit: (onSubmit: (values: T) => void) => void
  reset: () => void
  isValid: boolean
}

// Event types
export interface AppEvent {
  type: string
  payload?: any
  timestamp: string
}

// Module system types (re-export from core)
export type { 
  ModuleDefinition, 
  ModuleRoute, 
  MenuItem 
} from '../core/ModuleSystem'