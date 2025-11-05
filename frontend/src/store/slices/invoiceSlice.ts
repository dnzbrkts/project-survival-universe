import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { 
  invoiceApi, 
  InvoiceFilters,
  CustomerFilters,
  PaymentFilters,
  CreateInvoiceData,
  UpdateInvoiceData,
  CreateCustomerData,
  UpdateCustomerData,
  CreatePaymentData
} from '../../services/api/invoiceApi'
import { PaginatedResponse, Invoice, Customer, Payment, InvoiceItem } from '../../types'

interface InvoiceState {
  // Invoices
  invoices: Invoice[]
  selectedInvoice: Invoice | null
  invoicesLoading: boolean
  invoicesError: string | null
  invoicesPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null

  // Customers
  customers: Customer[]
  selectedCustomer: Customer | null
  customersLoading: boolean
  customersError: string | null
  customersPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null

  // Payments
  payments: Payment[]
  paymentsLoading: boolean
  paymentsError: string | null
  paymentsPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null

  // UI State
  invoiceFormOpen: boolean
  customerFormOpen: boolean
  paymentFormOpen: boolean
  invoicePreviewOpen: boolean
  
  // Form State
  currentInvoiceItems: InvoiceItem[]
  invoiceTotals: {
    subtotal: number
    taxAmount: number
    totalAmount: number
  }

  // Filters
  invoiceFilters: InvoiceFilters
  customerFilters: CustomerFilters
  paymentFilters: PaymentFilters
}

const initialState: InvoiceState = {
  // Invoices
  invoices: [],
  selectedInvoice: null,
  invoicesLoading: false,
  invoicesError: null,
  invoicesPagination: null,

  // Customers
  customers: [],
  selectedCustomer: null,
  customersLoading: false,
  customersError: null,
  customersPagination: null,

  // Payments
  payments: [],
  paymentsLoading: false,
  paymentsError: null,
  paymentsPagination: null,

  // UI State
  invoiceFormOpen: false,
  customerFormOpen: false,
  paymentFormOpen: false,
  invoicePreviewOpen: false,

  // Form State
  currentInvoiceItems: [],
  invoiceTotals: {
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0
  },

  // Filters
  invoiceFilters: { page: 1, limit: 10 },
  customerFilters: { page: 1, limit: 10 },
  paymentFilters: { page: 1, limit: 10 }
}

// Async Thunks

// Invoices
export const fetchInvoices = createAsyncThunk(
  'invoice/fetchInvoices',
  async (filters: InvoiceFilters, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.getInvoices(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Faturalar yüklenirken hata oluştu')
    }
  }
)

export const fetchInvoiceById = createAsyncThunk(
  'invoice/fetchInvoiceById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.getInvoiceById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Fatura yüklenirken hata oluştu')
    }
  }
)

export const createInvoice = createAsyncThunk(
  'invoice/createInvoice',
  async (data: CreateInvoiceData, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.createInvoice(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Fatura oluşturulurken hata oluştu')
    }
  }
)

export const updateInvoice = createAsyncThunk(
  'invoice/updateInvoice',
  async ({ id, data }: { id: number; data: UpdateInvoiceData }, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.updateInvoice(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Fatura güncellenirken hata oluştu')
    }
  }
)

export const deleteInvoice = createAsyncThunk(
  'invoice/deleteInvoice',
  async (id: number, { rejectWithValue }) => {
    try {
      await invoiceApi.deleteInvoice(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Fatura silinirken hata oluştu')
    }
  }
)

export const approveInvoice = createAsyncThunk(
  'invoice/approveInvoice',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.approveInvoice(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Fatura onaylanırken hata oluştu')
    }
  }
)

export const cancelInvoice = createAsyncThunk(
  'invoice/cancelInvoice',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.cancelInvoice(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Fatura iptal edilirken hata oluştu')
    }
  }
)

export const printInvoice = createAsyncThunk(
  'invoice/printInvoice',
  async (id: number, { rejectWithValue }) => {
    try {
      const blob = await invoiceApi.printInvoice(id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fatura-${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      return true
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Fatura yazdırılırken hata oluştu')
    }
  }
)

// Customers
export const fetchCustomers = createAsyncThunk(
  'invoice/fetchCustomers',
  async (filters: CustomerFilters, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.getCustomers(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteriler yüklenirken hata oluştu')
    }
  }
)

export const createCustomer = createAsyncThunk(
  'invoice/createCustomer',
  async (data: CreateCustomerData, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.createCustomer(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteri oluşturulurken hata oluştu')
    }
  }
)

export const updateCustomer = createAsyncThunk(
  'invoice/updateCustomer',
  async ({ id, data }: { id: number; data: UpdateCustomerData }, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.updateCustomer(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteri güncellenirken hata oluştu')
    }
  }
)

export const deleteCustomer = createAsyncThunk(
  'invoice/deleteCustomer',
  async (id: number, { rejectWithValue }) => {
    try {
      await invoiceApi.deleteCustomer(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteri silinirken hata oluştu')
    }
  }
)

// Payments
export const fetchPayments = createAsyncThunk(
  'invoice/fetchPayments',
  async (filters: PaymentFilters, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.getPayments(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ödemeler yüklenirken hata oluştu')
    }
  }
)

export const createPayment = createAsyncThunk(
  'invoice/createPayment',
  async (data: CreatePaymentData, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.createPayment(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ödeme oluşturulurken hata oluştu')
    }
  }
)

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    // UI Actions
    setInvoiceFormOpen: (state, action: PayloadAction<boolean>) => {
      state.invoiceFormOpen = action.payload
      if (!action.payload) {
        state.selectedInvoice = null
        state.currentInvoiceItems = []
        state.invoiceTotals = { subtotal: 0, taxAmount: 0, totalAmount: 0 }
      }
    },
    setCustomerFormOpen: (state, action: PayloadAction<boolean>) => {
      state.customerFormOpen = action.payload
      if (!action.payload) {
        state.selectedCustomer = null
      }
    },
    setPaymentFormOpen: (state, action: PayloadAction<boolean>) => {
      state.paymentFormOpen = action.payload
    },
    setInvoicePreviewOpen: (state, action: PayloadAction<boolean>) => {
      state.invoicePreviewOpen = action.payload
    },
    setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.selectedInvoice = action.payload
      if (action.payload) {
        state.currentInvoiceItems = action.payload.items || []
        state.invoiceTotals = {
          subtotal: action.payload.subtotal,
          taxAmount: action.payload.taxAmount,
          totalAmount: action.payload.totalAmount
        }
      }
    },
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload
    },

    // Invoice Items Management
    addInvoiceItem: (state, action: PayloadAction<InvoiceItem>) => {
      state.currentInvoiceItems.push(action.payload)
      state.invoiceTotals = invoiceApi.calculateInvoiceTotals(state.currentInvoiceItems)
    },
    updateInvoiceItem: (state, action: PayloadAction<{ index: number; item: InvoiceItem }>) => {
      const { index, item } = action.payload
      if (index >= 0 && index < state.currentInvoiceItems.length) {
        state.currentInvoiceItems[index] = item
        state.invoiceTotals = invoiceApi.calculateInvoiceTotals(state.currentInvoiceItems)
      }
    },
    removeInvoiceItem: (state, action: PayloadAction<number>) => {
      const index = action.payload
      if (index >= 0 && index < state.currentInvoiceItems.length) {
        state.currentInvoiceItems.splice(index, 1)
        state.invoiceTotals = invoiceApi.calculateInvoiceTotals(state.currentInvoiceItems)
      }
    },
    clearInvoiceItems: (state) => {
      state.currentInvoiceItems = []
      state.invoiceTotals = { subtotal: 0, taxAmount: 0, totalAmount: 0 }
    },
    setInvoiceItems: (state, action: PayloadAction<InvoiceItem[]>) => {
      state.currentInvoiceItems = action.payload
      state.invoiceTotals = invoiceApi.calculateInvoiceTotals(state.currentInvoiceItems)
    },

    // Filter Actions
    setInvoiceFilters: (state, action: PayloadAction<Partial<InvoiceFilters>>) => {
      state.invoiceFilters = { ...state.invoiceFilters, ...action.payload }
    },
    setCustomerFilters: (state, action: PayloadAction<Partial<CustomerFilters>>) => {
      state.customerFilters = { ...state.customerFilters, ...action.payload }
    },
    setPaymentFilters: (state, action: PayloadAction<Partial<PaymentFilters>>) => {
      state.paymentFilters = { ...state.paymentFilters, ...action.payload }
    },

    // Clear Actions
    clearInvoicesError: (state) => {
      state.invoicesError = null
    },
    clearCustomersError: (state) => {
      state.customersError = null
    },
    clearPaymentsError: (state) => {
      state.paymentsError = null
    }
  },
  extraReducers: (builder) => {
    // Invoices
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.invoicesLoading = true
        state.invoicesError = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action: PayloadAction<PaginatedResponse<Invoice>>) => {
        state.invoicesLoading = false
        state.invoices = action.payload.data
        state.invoicesPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.invoicesLoading = false
        state.invoicesError = action.payload as string
      })

    builder
      .addCase(fetchInvoiceById.fulfilled, (state, action: PayloadAction<Invoice>) => {
        state.selectedInvoice = action.payload
        state.currentInvoiceItems = action.payload.items || []
        state.invoiceTotals = {
          subtotal: action.payload.subtotal,
          taxAmount: action.payload.taxAmount,
          totalAmount: action.payload.totalAmount
        }
      })

    builder
      .addCase(createInvoice.fulfilled, (state, action: PayloadAction<Invoice>) => {
        state.invoices.unshift(action.payload)
        state.invoiceFormOpen = false
        state.currentInvoiceItems = []
        state.invoiceTotals = { subtotal: 0, taxAmount: 0, totalAmount: 0 }
      })

    builder
      .addCase(updateInvoice.fulfilled, (state, action: PayloadAction<Invoice>) => {
        const index = state.invoices.findIndex(i => i.id === action.payload.id)
        if (index !== -1) {
          state.invoices[index] = action.payload
        }
        state.selectedInvoice = action.payload
        state.invoiceFormOpen = false
      })

    builder
      .addCase(deleteInvoice.fulfilled, (state, action: PayloadAction<number>) => {
        state.invoices = state.invoices.filter(i => i.id !== action.payload)
      })

    builder
      .addCase(approveInvoice.fulfilled, (state, action: PayloadAction<Invoice>) => {
        const index = state.invoices.findIndex(i => i.id === action.payload.id)
        if (index !== -1) {
          state.invoices[index] = action.payload
        }
        if (state.selectedInvoice?.id === action.payload.id) {
          state.selectedInvoice = action.payload
        }
      })

    builder
      .addCase(cancelInvoice.fulfilled, (state, action: PayloadAction<Invoice>) => {
        const index = state.invoices.findIndex(i => i.id === action.payload.id)
        if (index !== -1) {
          state.invoices[index] = action.payload
        }
        if (state.selectedInvoice?.id === action.payload.id) {
          state.selectedInvoice = action.payload
        }
      })

    // Customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.customersLoading = true
        state.customersError = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<PaginatedResponse<Customer>>) => {
        state.customersLoading = false
        state.customers = action.payload.data
        state.customersPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customersLoading = false
        state.customersError = action.payload as string
      })

    builder
      .addCase(createCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.customers.unshift(action.payload)
        state.customerFormOpen = false
      })

    builder
      .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.customers[index] = action.payload
        }
        state.selectedCustomer = action.payload
        state.customerFormOpen = false
      })

    builder
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<number>) => {
        state.customers = state.customers.filter(c => c.id !== action.payload)
      })

    // Payments
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.paymentsLoading = true
        state.paymentsError = null
      })
      .addCase(fetchPayments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Payment>>) => {
        state.paymentsLoading = false
        state.payments = action.payload.data
        state.paymentsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.paymentsLoading = false
        state.paymentsError = action.payload as string
      })

    builder
      .addCase(createPayment.fulfilled, (state, action: PayloadAction<Payment>) => {
        state.payments.unshift(action.payload)
        state.paymentFormOpen = false
        
        // Update related invoice payment status if available
        if (action.payload.invoice) {
          const invoiceIndex = state.invoices.findIndex(i => i.id === action.payload.invoiceId)
          if (invoiceIndex !== -1) {
            state.invoices[invoiceIndex] = action.payload.invoice
          }
        }
      })
  }
})

export const {
  setInvoiceFormOpen,
  setCustomerFormOpen,
  setPaymentFormOpen,
  setInvoicePreviewOpen,
  setSelectedInvoice,
  setSelectedCustomer,
  addInvoiceItem,
  updateInvoiceItem,
  removeInvoiceItem,
  clearInvoiceItems,
  setInvoiceItems,
  setInvoiceFilters,
  setCustomerFilters,
  setPaymentFilters,
  clearInvoicesError,
  clearCustomersError,
  clearPaymentsError
} = invoiceSlice.actions

export default invoiceSlice.reducer