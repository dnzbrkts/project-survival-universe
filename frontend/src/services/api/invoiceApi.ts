import { BaseApi } from './baseApi'
import { ApiResponse, PaginatedResponse, Invoice, InvoiceItem, Customer, Payment } from '../../types'

export interface InvoiceFilters {
  search?: string
  invoiceType?: 'sales' | 'purchase'
  customerId?: number
  status?: 'draft' | 'approved' | 'paid' | 'cancelled'
  paymentStatus?: 'unpaid' | 'partial' | 'paid'
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface CustomerFilters {
  search?: string
  customerType?: 'customer' | 'supplier' | 'both'
  isActive?: boolean
  page?: number
  limit?: number
}

export interface PaymentFilters {
  search?: string
  customerId?: number
  invoiceId?: number
  paymentMethod?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface CreateInvoiceData {
  invoiceType: 'sales' | 'purchase'
  customerId: number
  invoiceDate: string
  dueDate?: string
  currency?: string
  exchangeRate?: number
  notes?: string
  items: CreateInvoiceItemData[]
}

export interface CreateInvoiceItemData {
  productId?: number
  description: string
  quantity: number
  unitPrice: number
  discountRate?: number
  taxRate: number
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {}

export interface CreateCustomerData {
  customerCode: string
  companyName: string
  customerType: 'customer' | 'supplier' | 'both'
  taxNumber?: string
  taxOffice?: string
  address?: string
  phone?: string
  email?: string
  contactPerson?: string
  paymentTerms?: number
  creditLimit?: number
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {}

export interface CreatePaymentData {
  invoiceId: number
  customerId: number
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'check'
  amount: number
  currency?: string
  exchangeRate?: number
  paymentDate: string
  referenceNumber?: string
  notes?: string
}

export interface InvoiceReportFilters {
  invoiceType?: 'sales' | 'purchase'
  customerId?: number
  startDate?: string
  endDate?: string
  format?: 'json' | 'excel' | 'pdf'
}

class InvoiceApi extends BaseApi {
  // Invoices
  async getInvoices(filters: InvoiceFilters = {}): Promise<PaginatedResponse<Invoice>> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.invoiceType) params.append('invoiceType', filters.invoiceType)
    if (filters.customerId) params.append('customerId', filters.customerId.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    return this.get<PaginatedResponse<Invoice>>(`/invoices?${params.toString()}`)
  }

  async getInvoiceById(id: number): Promise<ApiResponse<Invoice>> {
    return this.get<ApiResponse<Invoice>>(`/invoices/${id}`)
  }

  async createInvoice(data: CreateInvoiceData): Promise<ApiResponse<Invoice>> {
    return this.post<ApiResponse<Invoice>>('/invoices', data)
  }

  async updateInvoice(id: number, data: UpdateInvoiceData): Promise<ApiResponse<Invoice>> {
    return this.put<ApiResponse<Invoice>>(`/invoices/${id}`, data)
  }

  async deleteInvoice(id: number): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`/invoices/${id}`)
  }

  async approveInvoice(id: number): Promise<ApiResponse<Invoice>> {
    return this.post<ApiResponse<Invoice>>(`/invoices/${id}/approve`)
  }

  async cancelInvoice(id: number): Promise<ApiResponse<Invoice>> {
    return this.post<ApiResponse<Invoice>>(`/invoices/${id}/cancel`)
  }

  async printInvoice(id: number): Promise<Blob> {
    const response = await this.client.get(`/invoices/${id}/print`, {
      responseType: 'blob'
    })
    return response.data
  }

  // Customers
  async getCustomers(filters: CustomerFilters = {}): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.customerType) params.append('customerType', filters.customerType)
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    return this.get<PaginatedResponse<Customer>>(`/customers?${params.toString()}`)
  }

  async getCustomerById(id: number): Promise<ApiResponse<Customer>> {
    return this.get<ApiResponse<Customer>>(`/customers/${id}`)
  }

  async createCustomer(data: CreateCustomerData): Promise<ApiResponse<Customer>> {
    return this.post<ApiResponse<Customer>>('/customers', data)
  }

  async updateCustomer(id: number, data: UpdateCustomerData): Promise<ApiResponse<Customer>> {
    return this.put<ApiResponse<Customer>>(`/customers/${id}`, data)
  }

  async deleteCustomer(id: number): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`/customers/${id}`)
  }

  // Payments
  async getPayments(filters: PaymentFilters = {}): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.customerId) params.append('customerId', filters.customerId.toString())
    if (filters.invoiceId) params.append('invoiceId', filters.invoiceId.toString())
    if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    return this.get<PaginatedResponse<Payment>>(`/payments?${params.toString()}`)
  }

  async createPayment(data: CreatePaymentData): Promise<ApiResponse<Payment>> {
    return this.post<ApiResponse<Payment>>('/payments', data)
  }

  // Reports
  async generateInvoiceReport(filters: InvoiceReportFilters = {}): Promise<any> {
    const params = new URLSearchParams()
    
    if (filters.invoiceType) params.append('invoiceType', filters.invoiceType)
    if (filters.customerId) params.append('customerId', filters.customerId.toString())
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.format) params.append('format', filters.format)

    if (filters.format === 'excel' || filters.format === 'pdf') {
      const response = await this.client.get(`/invoices/report?${params.toString()}`, {
        responseType: 'blob'
      })
      return response.data
    }

    return this.get(`/invoices/report?${params.toString()}`)
  }

  // Tax calculation helper
  calculateTax(amount: number, taxRate: number): number {
    return (amount * taxRate) / 100
  }

  // Line total calculation helper
  calculateLineTotal(quantity: number, unitPrice: number, discountRate: number = 0, taxRate: number = 0): number {
    const subtotal = quantity * unitPrice
    const discountAmount = (subtotal * discountRate) / 100
    const discountedAmount = subtotal - discountAmount
    const taxAmount = (discountedAmount * taxRate) / 100
    return discountedAmount + taxAmount
  }

  // Invoice totals calculation helper
  calculateInvoiceTotals(items: InvoiceItem[]): { subtotal: number; taxAmount: number; totalAmount: number } {
    let subtotal = 0
    let taxAmount = 0

    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice
      const discountAmount = (itemSubtotal * item.discountRate) / 100
      const discountedAmount = itemSubtotal - discountAmount
      const itemTaxAmount = (discountedAmount * item.taxRate) / 100

      subtotal += discountedAmount
      taxAmount += itemTaxAmount
    })

    return {
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount
    }
  }
}

export const invoiceApi = new InvoiceApi()
export default invoiceApi