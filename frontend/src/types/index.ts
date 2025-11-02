/**
 * Genel TypeScript Tip Tanımları
 */

// API Response tipleri
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Kullanıcı tipleri
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  permissions: string[];
}

export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  description?: string;
  isSystemRole: boolean;
  isActive: boolean;
  permissions: string[];
}

// Auth tipleri
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Modül tipleri (core'dan import edilenler)
export interface ModuleDefinition {
  code: string;
  name: string;
  version: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'TRIAL' | 'EXPIRED';
  permissions: string[];
  routes: ModuleRoute[];
  menuItems: MenuItem[];
  registeredAt?: string;
  lastActivatedAt?: string;
}

export interface ModuleRoute {
  path: string;
  component: string;
  exact?: boolean;
  permissions?: string[];
}

export interface MenuItem {
  title: string;
  path: string;
  icon?: string;
  permission?: string;
  children?: MenuItem[];
}

// Form tipleri
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'date' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[];
  validation?: any;
}

export interface FormConfig {
  fields: FormField[];
  submitText?: string;
  resetText?: string;
  onSubmit: (data: any) => void | Promise<void>;
  onReset?: () => void;
  initialValues?: Record<string, any>;
  validationSchema?: any;
}

// Tablo tipleri
export interface TableColumn {
  field: string;
  headerName: string;
  width?: number;
  type?: 'string' | 'number' | 'date' | 'boolean' | 'actions';
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (params: any) => React.ReactNode;
  valueGetter?: (params: any) => any;
  valueFormatter?: (params: any) => string;
}

export interface TableConfig {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  onRowClick?: (row: any) => void;
  onRowDoubleClick?: (row: any) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
}

// Notification tipleri
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

// Theme tipleri
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
}

// Layout tipleri
export interface LayoutConfig {
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  headerHeight: number;
  footerHeight: number;
  showBreadcrumbs: boolean;
  showNotifications: boolean;
}

// Filter tipleri
export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn';
  value: any;
  label?: string;
}

export interface FilterConfig {
  filters: FilterOption[];
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Export/Import tipleri
export interface ExportConfig {
  format: 'excel' | 'csv' | 'pdf';
  filename?: string;
  columns?: string[];
  filters?: FilterConfig;
  includeHeaders?: boolean;
}

export interface ImportConfig {
  format: 'excel' | 'csv';
  hasHeaders?: boolean;
  columnMapping?: Record<string, string>;
  validationRules?: Record<string, any>;
}

// Dashboard tipleri
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'table' | 'custom';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config: any;
  permissions?: string[];
}

export interface DashboardConfig {
  widgets: DashboardWidget[];
  layout: 'grid' | 'flex';
  refreshInterval?: number;
  autoRefresh?: boolean;
}

// Chart tipleri
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  data: ChartData;
  options?: any;
  height?: number;
  width?: number;
}

// File Upload tipleri
export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  onError?: (error: string) => void;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Search tipleri
export interface SearchConfig {
  placeholder?: string;
  searchFields: string[];
  onSearch: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  minLength?: number;
}

// Validation tipleri
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  message?: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

// Error tipleri
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  path?: string;
}

// Loading state tipleri
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number;
}

// Generic CRUD tipleri
export interface CrudOperations<T> {
  create: (data: Partial<T>) => Promise<T>;
  read: (id: number | string) => Promise<T>;
  update: (id: number | string, data: Partial<T>) => Promise<T>;
  delete: (id: number | string) => Promise<void>;
  list: (params?: any) => Promise<PaginatedResponse<T>>;
}

// Route tipleri
export interface AppRoute {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  permissions?: string[];
  title?: string;
  breadcrumb?: string;
  meta?: Record<string, any>;
}

// Utility tipleri
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event tipleri
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: number;
  source?: string;
}

export interface EventHandler {
  (event: AppEvent): void;
}

// Configuration tipleri
export interface AppConfig {
  apiBaseUrl: string;
  appName: string;
  version: string;
  theme: ThemeConfig;
  layout: LayoutConfig;
  features: {
    enableDevTools: boolean;
    enableMockData: boolean;
    enableAnalytics: boolean;
  };
  cache: {
    timeout: number;
    maxSize: number;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
  };
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
}