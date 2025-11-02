# Tasarım Belgesi

## Genel Bakış

İşletme Yönetim Sistemi, dinamik modüler mimari ile tasarlanmış web tabanlı bir uygulamadır. Sistem, React.js frontend, Node.js/Express.js backend ve PostgreSQL veritabanı kullanarak geliştirilecektir. Her modül bağımsız olarak aktif/pasif edilebilir ve detaylı yetki kontrolü ile yönetilir. Modüler kod organizasyonu ile tam ölçeklenebilirlik sağlanacaktır.

### Dinamik Modül Sistemi Özellikleri

- **Modül Aktivasyon/Deaktivasyon**: Her modül runtime'da açılıp kapatılabilir
- **Granüler Yetki Kontrolü**: Modül, sayfa ve işlem seviyesinde yetki yönetimi
- **Dinamik Menü Sistemi**: Aktif modüllere göre otomatik menü oluşturma
- **Lisans Tabanlı Modül Kontrolü**: Modüller lisans durumuna göre aktifleştirilebilir
- **Rol Bazlı Modül Erişimi**: Kullanıcı rollerine göre modül görünürlüğü

## Mimari

### Sistem Mimarisi

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Veritabanı    │
│   (React.js)    │◄──►│  (Node.js/      │◄──►│  (PostgreSQL)   │
│                 │    │   Express.js)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Katmanlı Mimari

1. **Sunum Katmanı (Frontend)**
   - React.js ile SPA (Single Page Application)
   - Material-UI veya Ant Design bileşen kütüphanesi
   - Redux Toolkit ile state yönetimi
   - React Router ile sayfa yönlendirme

2. **İş Mantığı Katmanı (Backend)**
   - Express.js REST API
   - JWT tabanlı kimlik doğrulama
   - Middleware'ler ile yetkilendirme kontrolü
   - Modüler servis katmanı

3. **Veri Katmanı**
   - PostgreSQL ilişkisel veritabanı
   - Sequelize ORM
   - Veritabanı migrasyonları ve seed'ler

## Dinamik Modül Sistemi Detayları

### Modül Yapısı

Her modül aşağıdaki standart yapıya sahip olacak:

```javascript
// Modül tanımı
const ModuleDefinition = {
  code: 'STOK_YONETIMI',
  name: 'Stok Yönetimi',
  version: '1.0.0',
  category: 'OPERASYON',
  icon: 'inventory',
  color: '#2196F3',
  description: 'Ürün ve stok yönetimi modülü',
  dependencies: [], // Bağımlı modüller
  permissions: [
    'stok.urun.liste',
    'stok.urun.ekle',
    'stok.urun.duzenle',
    'stok.hareket.liste',
    'stok.rapor.goruntule'
  ],
  routes: [
    { path: '/stok', component: 'StokModule' },
    { path: '/stok/urunler', component: 'UrunListesi' },
    { path: '/stok/hareketler', component: 'StokHareketleri' }
  ],
  menuItems: [
    {
      title: 'Ürünler',
      path: '/stok/urunler',
      permission: 'stok.urun.liste',
      icon: 'product'
    }
  ]
};
```

### Yetki Sistemi Hiyerarşisi

```
Sistem Seviyesi
├── Modül Seviyesi (stok, fatura, cari, vb.)
│   ├── Sayfa Seviyesi (liste, detay, rapor)
│   │   ├── İşlem Seviyesi (ekle, düzenle, sil)
│   │   └── Veri Seviyesi (kendi verisi, departman verisi, tüm veri)
```

### Modül Durumları

- **INACTIVE**: Modül kapalı, erişim yok
- **ACTIVE**: Modül açık, normal erişim
- **MAINTENANCE**: Bakım modu, sadece admin erişimi
- **TRIAL**: Deneme sürümü, sınırlı özellik
- **EXPIRED**: Lisans süresi dolmuş, salt okunur

### Dinamik Menü Oluşturma

```javascript
// Menü oluşturma algoritması
const generateMenu = (user, activeModules) => {
  return activeModules
    .filter(module => hasModulePermission(user, module.code))
    .map(module => ({
      ...module.menuConfig,
      children: module.menuItems.filter(item => 
        hasPermission(user, item.permission)
      )
    }))
    .sort((a, b) => a.order - b.order);
};
```

## Bileşenler ve Arayüzler

### Frontend Bileşenleri

#### Ana Bileşenler
- **AppLayout**: Dinamik menü ile ana sayfa düzeni
- **AuthGuard**: Çoklu yetki kontrolü wrapper'ı
- **ModuleGuard**: Modül erişim kontrolü wrapper'ı
- **DynamicDashboard**: Aktif modüllere göre dashboard
- **ModuleContainer**: Dinamik modül yükleme container'ı
- **PermissionProvider**: Yetki context provider'ı
- **ModuleProvider**: Modül durumu context provider'ı

#### Dinamik Sistem Bileşenleri
- **DynamicNavigation**: Aktif modüllere göre menü oluşturma
- **ModuleLoader**: Lazy loading ile modül yükleme
- **PermissionChecker**: Yetki kontrolü utility bileşeni
- **ModuleStatusIndicator**: Modül durumu gösterge
- **LicenseManager**: Lisans durumu yönetimi
- **SystemSettings**: Modül aktivasyon/deaktivasyon arayüzü

#### Modül Bileşenleri
- **InventoryModule**: Stok yönetimi ve barkod sistemi arayüzü
- **ServiceModule**: Servis takip arayüzü
- **InvoiceModule**: Fatura oluşturma, e-fatura ve e-arşiv yönetimi
- **CustomerModule**: Müşteri hesap yönetimi
- **AccountingModule**: Muhasebe işlemleri
- **AuthorizationModule**: Kullanıcı ve rol yönetimi
- **CurrencyModule**: Döviz kuru yönetimi
- **EmployeeModule**: İnsan kaynakları ve bordro yönetimi
- **ReportingModule**: Analitik raporlar ve dashboard
- **CRMModule**: Müşteri ilişkileri yönetimi
- **BarcodeModule**: Barkod oluşturma ve okuma sistemi
- **MobileModule**: Mobil uygulama arayüzü
- **MonitoringModule**: Sistem izleme ve güvenlik
- **B2BModule**: Kurumsal müşteri ve özel fiyatlandırma yönetimi
- **CouponModule**: İndirim kuponu yönetimi
- **CommunicationModule**: SMS/Email otomasyonu ve kampanya yönetimi
- **CustomerPortalModule**: Müşteri self-servis portalı
- **QuotationModule**: Fiyat teklifi hazırlama ve yönetimi
- **SalesOrderModule**: Satış siparişi işleme ve takibi
- **DeliveryModule**: İrsaliye ve sevkiyat yönetimi
- **POSModule**: Perakende satış noktası sistemi
- **SalesChannelModule**: Satış kanalı yönetimi ve performans takibi
- **ECommerceModule**: E-ticaret platform entegrasyonu ve yönetimi
- **CargoModule**: Kargo şirketi entegrasyonu ve sevkiyat yönetimi
- **OmnichannelModule**: Çoklu kanal yönetimi ve senkronizasyon
- **IntegrationModule**: Dış sistem entegrasyonları ve webhook yönetimi

### Backend API Yapısı

#### Main API Routes
```
/api/auth          - Authentication
/api/system        - System management and module control
/api/modules       - Dynamic module management
/api/permissions   - Permission management
/api/users         - User management
/api/roles         - Role management
/api/logs          - System logs and audit trail
/api/exports       - Data export management

-- Dynamic Module APIs (accessible when module is active)
/api/inventory     - Inventory operations
/api/services      - Service operations
/api/invoices      - Invoice operations
/api/customers     - Customer account operations
/api/accounting    - Accounting operations
/api/currencies    - Exchange rate operations
/api/reports       - Reporting and analytics
/api/employees     - Human resources
/api/payroll       - Payroll operations
/api/crm           - Customer relationship management
/api/barcodes      - Barcode operations
/api/e-invoice     - E-invoice integration
/api/mobile        - Mobile API
/api/monitoring    - System monitoring
/api/notifications - Notifications
/api/integrations  - External system integrations

-- New Module APIs
/api/b2b           - B2B customer management and pricing
/api/coupons       - Discount coupon management
/api/communications - SMS/Email automation
/api/customer-portal - Customer self-service portal
/api/quotations    - Price quotation management
/api/sales-orders  - Sales order processing
/api/delivery-notes - Delivery note (İrsaliye) management
/api/pos           - Point of sale operations
/api/sales-channels - Sales channel management
/api/ecommerce     - E-commerce platform integration
/api/cargo         - Cargo company integration
/api/omnichannel   - Cross-channel management
/api/webhooks      - Integration webhooks
```

#### Customer Portal API Routes
```
/api/portal/auth          - Customer portal authentication
/api/portal/profile       - Customer profile management
/api/portal/services      - Customer service requests view
/api/portal/invoices      - Customer invoices view
/api/portal/payments      - Customer payment history
/api/portal/notifications - Customer notifications
/api/portal/support       - Customer support tickets
```

#### Sales and POS API Routes
```
/api/quotations/create    - Create new quotation
/api/quotations/convert   - Convert quotation to invoice/order
/api/sales-orders/create  - Create sales order
/api/sales-orders/fulfill - Fulfill order with delivery
/api/delivery-notes/create - Create delivery note
/api/delivery-notes/track  - Track delivery status
/api/pos/sales/create     - Create POS sale
/api/pos/sessions/open    - Open cash register session
/api/pos/sessions/close   - Close cash register session
/api/pos/reports/daily    - Daily sales reports
```

#### E-Commerce Integration API Routes
```
/api/ecommerce/platforms          - Manage e-commerce platforms
/api/ecommerce/products/sync      - Sync products to platforms
/api/ecommerce/orders/import      - Import orders from platforms
/api/ecommerce/inventory/sync     - Sync inventory levels
/api/ecommerce/prices/sync        - Sync pricing information
/api/ecommerce/webhooks/receive   - Receive platform webhooks

-- Platform Specific Routes
/api/ecommerce/trendyol/*         - Trendyol integration
/api/ecommerce/hepsiburada/*      - Hepsiburada integration
/api/ecommerce/n11/*              - N11 integration
/api/ecommerce/amazon/*           - Amazon integration
/api/ecommerce/shopify/*          - Shopify integration
```

#### Cargo Integration API Routes
```
/api/cargo/companies              - Manage cargo companies
/api/cargo/shipments/create       - Create new shipment
/api/cargo/shipments/track        - Track shipment status
/api/cargo/labels/generate        - Generate shipping labels
/api/cargo/pricing/calculate      - Calculate shipping costs
/api/cargo/addresses/validate     - Validate shipping addresses

-- Cargo Company Specific Routes
/api/cargo/mng/*                  - MNG Kargo integration
/api/cargo/yurtici/*              - Yurtiçi Kargo integration
/api/cargo/aras/*                 - Aras Kargo integration
/api/cargo/ptt/*                  - PTT Kargo integration
/api/cargo/ups/*                  - UPS integration
```

#### Omnichannel API Routes
```
/api/omnichannel/inventory        - Cross-channel inventory management
/api/omnichannel/pricing          - Cross-channel pricing management
/api/omnichannel/customers        - Unified customer profiles
/api/omnichannel/orders           - Cross-channel order management
/api/omnichannel/analytics        - Cross-channel analytics
```

#### Export API Endpoints
```
/api/exports/inventory/products     - Export products to Excel/CSV
/api/exports/inventory/movements    - Export stock movements
/api/exports/customers/list         - Export customer list
/api/exports/customers/balances     - Export customer balances
/api/exports/invoices/sales         - Export sales invoices
/api/exports/invoices/purchases     - Export purchase invoices
/api/exports/services/requests      - Export service requests
/api/exports/reports/custom         - Export custom reports
/api/exports/logs/system            - Export system logs
/api/exports/logs/security          - Export security events
```

#### Dinamik Modül Middleware'leri
- **moduleAccessMiddleware**: Modül erişim kontrolü
- **permissionMiddleware**: Granüler yetki kontrolü
- **moduleStatusMiddleware**: Modül aktiflik kontrolü
- **licenseMiddleware**: Lisans doğrulama
- **auditMiddleware**: Modül erişim kayıtları

#### Middleware'ler
- **authMiddleware**: JWT token doğrulama
- **roleMiddleware**: Rol bazlı yetkilendirme
- **validationMiddleware**: Giriş verisi doğrulama
- **errorMiddleware**: Hata yakalama ve işleme
- **loggingMiddleware**: İşlem kayıtları

## Veri Modelleri

### Dynamic Module and Authorization System

```sql
-- System modules table
CREATE TABLE system_modules (
    id SERIAL PRIMARY KEY,
    module_code VARCHAR(50) UNIQUE NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0.0',
    is_active BOOLEAN DEFAULT false,
    requires_license BOOLEAN DEFAULT false,
    license_expires_at DATE,
    sort_order INTEGER DEFAULT 0,
    icon VARCHAR(50),
    color VARCHAR(20),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module features table
CREATE TABLE module_features (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES system_modules(id),
    feature_code VARCHAR(50) NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module_id, feature_code)
);

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_code VARCHAR(50) UNIQUE NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-role relationship (multi-role support)
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    starts_at DATE DEFAULT CURRENT_DATE,
    expires_at DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

-- Permission categories table
CREATE TABLE permission_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES permission_categories(id),
    module_id INTEGER REFERENCES system_modules(id),
    permission_type VARCHAR(20) DEFAULT 'action', -- 'module', 'page', 'action', 'data'
    parent_permission_id INTEGER REFERENCES permissions(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role-permission relationship
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id),
    permission_id INTEGER REFERENCES permissions(id),
    access_type VARCHAR(20) DEFAULT 'allow', -- 'allow', 'deny'
    conditions JSONB, -- Conditional permission rules
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- User specific permissions (non-role permissions)
CREATE TABLE user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    permission_id INTEGER REFERENCES permissions(id),
    access_type VARCHAR(20) DEFAULT 'allow',
    starts_at DATE DEFAULT CURRENT_DATE,
    expires_at DATE,
    conditions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, permission_id)
);

-- Module access logs
CREATE TABLE module_access_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    module_id INTEGER REFERENCES system_modules(id),
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    is_successful BOOLEAN DEFAULT true,
    error_message TEXT
);
```

### Inventory Management

```sql
-- Product categories table
CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INTEGER REFERENCES product_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES product_categories(id),
    unit VARCHAR(20) NOT NULL,
    critical_stock_level INTEGER DEFAULT 0,
    purchase_price DECIMAL(15,4) DEFAULT 0,
    sale_price DECIMAL(15,4) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock movements table
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'transfer', 'adjustment'
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,4),
    currency VARCHAR(3) DEFAULT 'TRY',
    reference_type VARCHAR(50), -- 'purchase', 'sale', 'transfer', 'adjustment'
    reference_id INTEGER,
    description TEXT,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Current stock levels view
CREATE VIEW current_stock_levels AS
SELECT 
    p.id as product_id,
    p.product_code,
    p.product_name,
    COALESCE(SUM(CASE WHEN sm.movement_type IN ('in', 'adjustment') THEN sm.quantity 
                      WHEN sm.movement_type IN ('out') THEN -sm.quantity 
                      ELSE 0 END), 0) as current_stock,
    p.critical_stock_level,
    CASE WHEN COALESCE(SUM(CASE WHEN sm.movement_type IN ('in', 'adjustment') THEN sm.quantity 
                                WHEN sm.movement_type IN ('out') THEN -sm.quantity 
                                ELSE 0 END), 0) <= p.critical_stock_level 
         THEN true ELSE false END as is_critical
FROM products p
LEFT JOIN stock_movements sm ON p.id = sm.product_id
WHERE p.is_active = true
GROUP BY p.id, p.product_code, p.product_name, p.critical_stock_level;
```

### Service Management

```sql
-- Service requests table
CREATE TABLE service_requests (
    id SERIAL PRIMARY KEY,
    request_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    issue_description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    priority VARCHAR(10) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    assigned_technician_id INTEGER REFERENCES users(id),
    estimated_cost DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service activities table
CREATE TABLE service_activities (
    id SERIAL PRIMARY KEY,
    service_request_id INTEGER REFERENCES service_requests(id),
    activity_type VARCHAR(50) NOT NULL, -- 'diagnosis', 'repair', 'part_replacement', 'testing'
    description TEXT NOT NULL,
    duration_minutes INTEGER,
    cost DECIMAL(15,2),
    technician_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service parts used table
CREATE TABLE service_parts_used (
    id SERIAL PRIMARY KEY,
    service_request_id INTEGER REFERENCES service_requests(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,4),
    total_price DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Invoice and Customer Management

```sql
-- Customers table (Customers and Suppliers)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    customer_type VARCHAR(20) NOT NULL, -- 'customer', 'supplier', 'both'
    tax_number VARCHAR(20),
    tax_office VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    payment_terms INTEGER DEFAULT 30, -- days
    credit_limit DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(30) UNIQUE NOT NULL,
    invoice_type VARCHAR(20) NOT NULL, -- 'sales', 'purchase'
    customer_id INTEGER REFERENCES customers(id),
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15,4) NOT NULL,
    tax_amount DECIMAL(15,4) NOT NULL,
    total_amount DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    exchange_rate DECIMAL(10,6) DEFAULT 1.0,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'approved', 'paid', 'cancelled'
    payment_status VARCHAR(20) DEFAULT 'unpaid', -- 'unpaid', 'partial', 'paid'
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice items table
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    product_id INTEGER REFERENCES products(id),
    description TEXT,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    line_total DECIMAL(15,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_number VARCHAR(30) UNIQUE NOT NULL,
    invoice_id INTEGER REFERENCES invoices(id),
    customer_id INTEGER REFERENCES customers(id),
    payment_method VARCHAR(50) NOT NULL, -- 'cash', 'bank_transfer', 'credit_card', 'check'
    amount DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    exchange_rate DECIMAL(10,6) DEFAULT 1.0,
    payment_date DATE NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer account balance view
CREATE VIEW customer_balances AS
SELECT 
    c.id as customer_id,
    c.customer_code,
    c.company_name,
    COALESCE(SUM(CASE WHEN i.invoice_type = 'sales' THEN i.total_amount ELSE -i.total_amount END), 0) as total_invoiced,
    COALESCE(SUM(p.amount), 0) as total_paid,
    COALESCE(SUM(CASE WHEN i.invoice_type = 'sales' THEN i.total_amount ELSE -i.total_amount END), 0) - COALESCE(SUM(p.amount), 0) as balance
FROM customers c
LEFT JOIN invoices i ON c.id = i.customer_id AND i.status != 'cancelled'
LEFT JOIN payments p ON c.id = p.customer_id
WHERE c.is_active = true
GROUP BY c.id, c.customer_code, c.company_name;
```

### Currency Management

```sql
-- Exchange rates table
CREATE TABLE exchange_rates (
    id SERIAL PRIMARY KEY,
    currency_code VARCHAR(3) NOT NULL,
    buy_rate DECIMAL(10,6) NOT NULL,
    sell_rate DECIMAL(10,6) NOT NULL,
    rate_date DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'manual', -- 'manual', 'tcmb', 'api'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(currency_code, rate_date)
);

-- Currencies table
CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    currency_code VARCHAR(3) UNIQUE NOT NULL,
    currency_name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10),
    decimal_places INTEGER DEFAULT 2,
    is_base_currency BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Human Resources

```sql
-- Departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id INTEGER REFERENCES employees(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_number VARCHAR(20) UNIQUE NOT NULL,
    national_id VARCHAR(11) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    gender VARCHAR(10),
    marital_status VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    department_id INTEGER REFERENCES departments(id),
    position VARCHAR(100),
    hire_date DATE NOT NULL,
    termination_date DATE,
    base_salary DECIMAL(15,2),
    social_security_number VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payroll table
CREATE TABLE payrolls (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    payroll_period VARCHAR(7) NOT NULL, -- YYYY-MM format
    gross_salary DECIMAL(15,2) NOT NULL,
    social_security_deduction DECIMAL(15,2) DEFAULT 0,
    tax_deduction DECIMAL(15,2) DEFAULT 0,
    net_salary DECIMAL(15,2) NOT NULL,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    overtime_pay DECIMAL(15,2) DEFAULT 0,
    bonus DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee leave requests table
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    leave_type VARCHAR(50) NOT NULL, -- 'annual', 'sick', 'maternity', 'personal'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### CRM and Customer Management

```sql
-- Customer activities table
CREATE TABLE customer_activities (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    activity_type VARCHAR(50) NOT NULL, -- 'call', 'email', 'meeting', 'visit', 'support'
    subject VARCHAR(200) NOT NULL,
    description TEXT,
    activity_date TIMESTAMP NOT NULL,
    responsible_user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'completed', -- 'scheduled', 'completed', 'cancelled'
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer segments table
CREATE TABLE customer_segments (
    id SERIAL PRIMARY KEY,
    segment_name VARCHAR(100) NOT NULL,
    segment_criteria JSONB, -- Segmentation criteria
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer-segment relationship
CREATE TABLE customer_segment_assignments (
    customer_id INTEGER REFERENCES customers(id),
    segment_id INTEGER REFERENCES customer_segments(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id, segment_id)
);

-- Sales opportunities table
CREATE TABLE sales_opportunities (
    id SERIAL PRIMARY KEY,
    opportunity_name VARCHAR(200) NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    estimated_value DECIMAL(15,2),
    probability DECIMAL(5,2), -- 0-100
    stage VARCHAR(50) NOT NULL, -- 'lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
    expected_close_date DATE,
    assigned_to INTEGER REFERENCES users(id),
    source VARCHAR(50), -- 'website', 'referral', 'cold_call', 'marketing'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Barcode System

```sql
-- Barcodes table
CREATE TABLE barcodes (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    barcode_value VARCHAR(50) UNIQUE NOT NULL,
    barcode_type VARCHAR(20) DEFAULT 'EAN13', -- 'EAN13', 'EAN8', 'CODE128', 'QR'
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Barcode scan logs table
CREATE TABLE barcode_scan_logs (
    id SERIAL PRIMARY KEY,
    barcode_id INTEGER REFERENCES barcodes(id),
    user_id INTEGER REFERENCES users(id),
    scan_type VARCHAR(50) NOT NULL, -- 'inventory_in', 'inventory_out', 'price_check', 'sale'
    quantity INTEGER DEFAULT 1,
    location VARCHAR(100),
    device_info TEXT,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### E-Invoice System

```sql
-- E-invoice records table
CREATE TABLE e_invoice_records (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    e_invoice_uuid VARCHAR(36) UNIQUE,
    gib_status VARCHAR(50), -- 'sent', 'approved', 'rejected', 'cancelled'
    envelope_uuid VARCHAR(36),
    sent_at TIMESTAMP,
    response_received_at TIMESTAMP,
    error_message TEXT,
    xml_content TEXT,
    pdf_content BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- E-archive invoice records table
CREATE TABLE e_archive_records (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    archive_uuid VARCHAR(36) UNIQUE,
    archive_status VARCHAR(50), -- 'created', 'sent', 'delivered'
    recipient_email VARCHAR(100),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    xml_content TEXT,
    pdf_content BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### B2B and Corporate Customer Management

```sql
-- B2B customer categories table
CREATE TABLE b2b_customer_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_rate DECIMAL(5,2) DEFAULT 0, -- Default discount percentage
    credit_limit DECIMAL(15,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 30, -- days
    minimum_order_amount DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- B2B customer assignments table
CREATE TABLE b2b_customer_assignments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    category_id INTEGER REFERENCES b2b_customer_categories(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(customer_id, category_id)
);

-- B2B special pricing table
CREATE TABLE b2b_special_pricing (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    category_id INTEGER REFERENCES b2b_customer_categories(id),
    price_type VARCHAR(20) NOT NULL, -- 'fixed', 'discount_percentage', 'discount_amount'
    price_value DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    minimum_quantity INTEGER DEFAULT 1,
    starts_at DATE DEFAULT CURRENT_DATE,
    expires_at DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- B2B contracts table
CREATE TABLE b2b_contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    contract_name VARCHAR(200) NOT NULL,
    contract_type VARCHAR(50) NOT NULL, -- 'volume_discount', 'fixed_pricing', 'exclusive_deal'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    terms_and_conditions TEXT,
    annual_commitment DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'expired', 'terminated'
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Discount and Coupon System

```sql
-- Discount coupons table
CREATE TABLE discount_coupons (
    id SERIAL PRIMARY KEY,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    coupon_name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
    discount_value DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    minimum_order_amount DECIMAL(15,2) DEFAULT 0,
    maximum_discount_amount DECIMAL(15,2), -- For percentage discounts
    usage_limit INTEGER, -- NULL for unlimited
    usage_count INTEGER DEFAULT 0,
    usage_limit_per_customer INTEGER DEFAULT 1,
    applicable_to VARCHAR(20) DEFAULT 'all', -- 'all', 'specific_products', 'specific_categories'
    starts_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupon applicable products table
CREATE TABLE coupon_applicable_products (
    coupon_id INTEGER REFERENCES discount_coupons(id),
    product_id INTEGER REFERENCES products(id),
    PRIMARY KEY (coupon_id, product_id)
);

-- Coupon applicable categories table
CREATE TABLE coupon_applicable_categories (
    coupon_id INTEGER REFERENCES discount_coupons(id),
    category_id INTEGER REFERENCES product_categories(id),
    PRIMARY KEY (coupon_id, category_id)
);

-- Coupon usage history table
CREATE TABLE coupon_usage_history (
    id SERIAL PRIMARY KEY,
    coupon_id INTEGER REFERENCES discount_coupons(id),
    customer_id INTEGER REFERENCES customers(id),
    invoice_id INTEGER REFERENCES invoices(id),
    discount_amount DECIMAL(15,4) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Communication and Notification System

```sql
-- Communication templates table
CREATE TABLE communication_templates (
    id SERIAL PRIMARY KEY,
    template_code VARCHAR(50) UNIQUE NOT NULL,
    template_name VARCHAR(200) NOT NULL,
    template_type VARCHAR(20) NOT NULL, -- 'sms', 'email', 'push'
    subject VARCHAR(500), -- For email templates
    content TEXT NOT NULL,
    variables JSONB, -- Available template variables
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Automated communication rules table
CREATE TABLE communication_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(200) NOT NULL,
    trigger_event VARCHAR(100) NOT NULL, -- 'invoice_created', 'service_completed', 'payment_overdue'
    template_id INTEGER REFERENCES communication_templates(id),
    recipient_type VARCHAR(50) NOT NULL, -- 'customer', 'employee', 'admin'
    delay_minutes INTEGER DEFAULT 0, -- Delay before sending
    conditions JSONB, -- Additional conditions
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication queue table
CREATE TABLE communication_queue (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES communication_templates(id),
    recipient_type VARCHAR(20) NOT NULL, -- 'sms', 'email'
    recipient_address VARCHAR(255) NOT NULL, -- Phone number or email
    subject VARCHAR(500),
    content TEXT NOT NULL,
    priority INTEGER DEFAULT 5, -- 1-10, 1 is highest
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication logs table
CREATE TABLE communication_logs (
    id SERIAL PRIMARY KEY,
    queue_id INTEGER REFERENCES communication_queue(id),
    customer_id INTEGER REFERENCES customers(id),
    user_id INTEGER REFERENCES users(id),
    communication_type VARCHAR(20) NOT NULL,
    recipient_address VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    content TEXT,
    status VARCHAR(20) NOT NULL,
    provider_response TEXT,
    cost DECIMAL(10,4), -- Cost of SMS/email
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Customer Portal System

```sql
-- Customer portal users table
CREATE TABLE customer_portal_users (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    is_primary_contact BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer portal sessions table
CREATE TABLE customer_portal_sessions (
    id SERIAL PRIMARY KEY,
    portal_user_id INTEGER REFERENCES customer_portal_users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer service requests view (for portal)
CREATE VIEW customer_service_requests_view AS
SELECT 
    sr.id,
    sr.request_number,
    sr.issue_description,
    sr.status,
    sr.priority,
    sr.estimated_cost,
    sr.actual_cost,
    sr.started_at,
    sr.completed_at,
    sr.created_at,
    sr.updated_at,
    p.product_name,
    u.first_name || ' ' || u.last_name as technician_name,
    c.company_name
FROM service_requests sr
LEFT JOIN products p ON sr.product_id = p.id
LEFT JOIN users u ON sr.assigned_technician_id = u.id
LEFT JOIN customers c ON sr.customer_id = c.id;

-- Customer portal notifications table
CREATE TABLE customer_portal_notifications (
    id SERIAL PRIMARY KEY,
    portal_user_id INTEGER REFERENCES customer_portal_users(id),
    notification_type VARCHAR(50) NOT NULL, -- 'service_update', 'invoice_ready', 'payment_reminder'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    reference_type VARCHAR(50), -- 'service_request', 'invoice', 'payment'
    reference_id INTEGER,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sales and Quotation System

```sql
-- Quotations table
CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    quotation_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    quotation_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    subtotal DECIMAL(15,4) NOT NULL,
    tax_amount DECIMAL(15,4) NOT NULL,
    total_amount DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    exchange_rate DECIMAL(10,6) DEFAULT 1.0,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'
    notes TEXT,
    terms_and_conditions TEXT,
    converted_to_invoice_id INTEGER REFERENCES invoices(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quotation items table
CREATE TABLE quotation_items (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER REFERENCES quotations(id),
    product_id INTEGER REFERENCES products(id),
    description TEXT,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    line_total DECIMAL(15,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales orders table
CREATE TABLE sales_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    quotation_id INTEGER REFERENCES quotations(id),
    order_date DATE NOT NULL,
    delivery_date DATE,
    subtotal DECIMAL(15,4) NOT NULL,
    tax_amount DECIMAL(15,4) NOT NULL,
    total_amount DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    exchange_rate DECIMAL(10,6) DEFAULT 1.0,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    payment_status VARCHAR(20) DEFAULT 'unpaid', -- 'unpaid', 'partial', 'paid'
    delivery_address TEXT,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales order items table
CREATE TABLE sales_order_items (
    id SERIAL PRIMARY KEY,
    sales_order_id INTEGER REFERENCES sales_orders(id),
    product_id INTEGER REFERENCES products(id),
    description TEXT,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    line_total DECIMAL(15,4) NOT NULL,
    delivered_quantity DECIMAL(10,3) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Delivery Note (İrsaliye) System

```sql
-- Delivery notes table
CREATE TABLE delivery_notes (
    id SERIAL PRIMARY KEY,
    delivery_note_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    sales_order_id INTEGER REFERENCES sales_orders(id),
    invoice_id INTEGER REFERENCES invoices(id),
    delivery_date DATE NOT NULL,
    delivery_type VARCHAR(20) DEFAULT 'shipment', -- 'shipment', 'pickup', 'digital'
    carrier_name VARCHAR(100),
    tracking_number VARCHAR(100),
    delivery_address TEXT,
    recipient_name VARCHAR(100),
    recipient_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'prepared', -- 'prepared', 'shipped', 'in_transit', 'delivered', 'returned'
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delivery note items table
CREATE TABLE delivery_note_items (
    id SERIAL PRIMARY KEY,
    delivery_note_id INTEGER REFERENCES delivery_notes(id),
    product_id INTEGER REFERENCES products(id),
    sales_order_item_id INTEGER REFERENCES sales_order_items(id),
    description TEXT,
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20),
    serial_numbers TEXT[], -- Array of serial numbers if applicable
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delivery tracking table
CREATE TABLE delivery_tracking (
    id SERIAL PRIMARY KEY,
    delivery_note_id INTEGER REFERENCES delivery_notes(id),
    status VARCHAR(50) NOT NULL,
    location VARCHAR(200),
    description TEXT,
    tracked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);
```

### POS (Point of Sale) System

```sql
-- POS terminals table
CREATE TABLE pos_terminals (
    id SERIAL PRIMARY KEY,
    terminal_code VARCHAR(20) UNIQUE NOT NULL,
    terminal_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POS sales table
CREATE TABLE pos_sales (
    id SERIAL PRIMARY KEY,
    sale_number VARCHAR(30) UNIQUE NOT NULL,
    terminal_id INTEGER REFERENCES pos_terminals(id),
    customer_id INTEGER REFERENCES customers(id), -- NULL for walk-in customers
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(15,4) NOT NULL,
    tax_amount DECIMAL(15,4) NOT NULL,
    discount_amount DECIMAL(15,4) DEFAULT 0,
    total_amount DECIMAL(15,4) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'cash', 'credit_card', 'debit_card', 'mobile_payment'
    payment_reference VARCHAR(100),
    cashier_id INTEGER REFERENCES users(id),
    receipt_printed BOOLEAN DEFAULT false,
    is_refunded BOOLEAN DEFAULT false,
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POS sale items table
CREATE TABLE pos_sale_items (
    id SERIAL PRIMARY KEY,
    pos_sale_id INTEGER REFERENCES pos_sales(id),
    product_id INTEGER REFERENCES products(id),
    barcode_scanned VARCHAR(50),
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    line_total DECIMAL(15,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cash register sessions table
CREATE TABLE cash_register_sessions (
    id SERIAL PRIMARY KEY,
    terminal_id INTEGER REFERENCES pos_terminals(id),
    cashier_id INTEGER REFERENCES users(id),
    session_date DATE NOT NULL,
    opening_cash DECIMAL(15,2) NOT NULL,
    closing_cash DECIMAL(15,2),
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_cash_sales DECIMAL(15,2) DEFAULT 0,
    total_card_sales DECIMAL(15,2) DEFAULT 0,
    cash_difference DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed'
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    notes TEXT
);

-- Payment methods table
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    method_code VARCHAR(20) UNIQUE NOT NULL,
    method_name VARCHAR(50) NOT NULL,
    method_type VARCHAR(20) NOT NULL, -- 'cash', 'card', 'digital', 'bank_transfer'
    is_active BOOLEAN DEFAULT true,
    requires_reference BOOLEAN DEFAULT false,
    processing_fee_rate DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sales Channel Management

```sql
-- Sales channels table
CREATE TABLE sales_channels (
    id SERIAL PRIMARY KEY,
    channel_code VARCHAR(20) UNIQUE NOT NULL,
    channel_name VARCHAR(100) NOT NULL,
    channel_type VARCHAR(20) NOT NULL, -- 'retail', 'wholesale', 'online', 'b2b', 'pos', 'marketplace'
    commission_rate DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales performance tracking
CREATE TABLE sales_performance (
    id SERIAL PRIMARY KEY,
    sales_person_id INTEGER REFERENCES users(id),
    channel_id INTEGER REFERENCES sales_channels(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    target_amount DECIMAL(15,2),
    actual_amount DECIMAL(15,2) DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    commission_earned DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### E-Commerce Platform Integration

```sql
-- E-commerce platforms table
CREATE TABLE ecommerce_platforms (
    id SERIAL PRIMARY KEY,
    platform_code VARCHAR(50) UNIQUE NOT NULL,
    platform_name VARCHAR(100) NOT NULL,
    platform_type VARCHAR(20) NOT NULL, -- 'marketplace', 'own_store', 'social_commerce'
    api_endpoint VARCHAR(500),
    api_version VARCHAR(20),
    authentication_type VARCHAR(50), -- 'api_key', 'oauth2', 'basic_auth'
    is_active BOOLEAN DEFAULT true,
    configuration JSONB, -- Platform specific configuration
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- E-commerce platform credentials table
CREATE TABLE ecommerce_credentials (
    id SERIAL PRIMARY KEY,
    platform_id INTEGER REFERENCES ecommerce_platforms(id),
    credential_name VARCHAR(100) NOT NULL,
    credential_value TEXT NOT NULL, -- Encrypted
    credential_type VARCHAR(50) NOT NULL, -- 'api_key', 'secret', 'token', 'username', 'password'
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- E-commerce product mappings table
CREATE TABLE ecommerce_product_mappings (
    id SERIAL PRIMARY KEY,
    platform_id INTEGER REFERENCES ecommerce_platforms(id),
    product_id INTEGER REFERENCES products(id),
    platform_product_id VARCHAR(100) NOT NULL,
    platform_sku VARCHAR(100),
    platform_barcode VARCHAR(100),
    sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'synced', 'error'
    last_sync_at TIMESTAMP,
    sync_error_message TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform_id, platform_product_id)
);

-- E-commerce orders table
CREATE TABLE ecommerce_orders (
    id SERIAL PRIMARY KEY,
    platform_id INTEGER REFERENCES ecommerce_platforms(id),
    platform_order_id VARCHAR(100) NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    sales_order_id INTEGER REFERENCES sales_orders(id),
    order_date TIMESTAMP NOT NULL,
    platform_status VARCHAR(50) NOT NULL,
    internal_status VARCHAR(20) DEFAULT 'new', -- 'new', 'processing', 'shipped', 'delivered', 'cancelled'
    total_amount DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    shipping_cost DECIMAL(15,4) DEFAULT 0,
    commission_rate DECIMAL(5,2) DEFAULT 0,
    commission_amount DECIMAL(15,4) DEFAULT 0,
    customer_name VARCHAR(200),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    shipping_address JSONB,
    billing_address JSONB,
    platform_data JSONB, -- Raw platform order data
    sync_status VARCHAR(20) DEFAULT 'pending',
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform_id, platform_order_id)
);

-- E-commerce order items table
CREATE TABLE ecommerce_order_items (
    id SERIAL PRIMARY KEY,
    ecommerce_order_id INTEGER REFERENCES ecommerce_orders(id),
    product_id INTEGER REFERENCES products(id),
    platform_product_id VARCHAR(100),
    platform_sku VARCHAR(100),
    product_name VARCHAR(200) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    total_price DECIMAL(15,4) NOT NULL,
    platform_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- E-commerce sync logs table
CREATE TABLE ecommerce_sync_logs (
    id SERIAL PRIMARY KEY,
    platform_id INTEGER REFERENCES ecommerce_platforms(id),
    sync_type VARCHAR(50) NOT NULL, -- 'products', 'orders', 'inventory', 'prices'
    sync_direction VARCHAR(20) NOT NULL, -- 'import', 'export', 'bidirectional'
    status VARCHAR(20) NOT NULL, -- 'started', 'completed', 'failed'
    records_processed INTEGER DEFAULT 0,
    records_success INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    sync_data JSONB,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

### Cargo and Shipping Integration

```sql
-- Cargo companies table
CREATE TABLE cargo_companies (
    id SERIAL PRIMARY KEY,
    company_code VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    api_endpoint VARCHAR(500),
    api_version VARCHAR(20),
    authentication_type VARCHAR(50),
    service_types JSONB, -- Available service types (express, standard, etc.)
    coverage_areas JSONB, -- Supported cities/regions
    pricing_model VARCHAR(20) DEFAULT 'api', -- 'api', 'manual', 'contract'
    is_active BOOLEAN DEFAULT true,
    configuration JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cargo company credentials table
CREATE TABLE cargo_credentials (
    id SERIAL PRIMARY KEY,
    cargo_company_id INTEGER REFERENCES cargo_companies(id),
    credential_name VARCHAR(100) NOT NULL,
    credential_value TEXT NOT NULL, -- Encrypted
    credential_type VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping methods table
CREATE TABLE shipping_methods (
    id SERIAL PRIMARY KEY,
    method_code VARCHAR(50) UNIQUE NOT NULL,
    method_name VARCHAR(100) NOT NULL,
    cargo_company_id INTEGER REFERENCES cargo_companies(id),
    service_type VARCHAR(50), -- 'standard', 'express', 'same_day', 'next_day'
    estimated_delivery_days INTEGER,
    base_cost DECIMAL(15,4) DEFAULT 0,
    cost_calculation_type VARCHAR(20) DEFAULT 'weight', -- 'weight', 'volume', 'fixed', 'api'
    weight_ranges JSONB, -- Weight-based pricing
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments table
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    shipment_number VARCHAR(50) UNIQUE NOT NULL,
    delivery_note_id INTEGER REFERENCES delivery_notes(id),
    sales_order_id INTEGER REFERENCES sales_orders(id),
    ecommerce_order_id INTEGER REFERENCES ecommerce_orders(id),
    cargo_company_id INTEGER REFERENCES cargo_companies(id),
    shipping_method_id INTEGER REFERENCES shipping_methods(id),
    tracking_number VARCHAR(100),
    cargo_barcode VARCHAR(100),
    sender_info JSONB,
    recipient_info JSONB,
    package_info JSONB, -- Weight, dimensions, contents
    shipping_cost DECIMAL(15,4),
    insurance_value DECIMAL(15,4) DEFAULT 0,
    cod_amount DECIMAL(15,4) DEFAULT 0, -- Cash on delivery
    status VARCHAR(20) DEFAULT 'created', -- 'created', 'picked_up', 'in_transit', 'delivered', 'returned'
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cargo_response JSONB, -- Raw cargo company response
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipment tracking table
CREATE TABLE shipment_tracking (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER REFERENCES shipments(id),
    tracking_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    status_description TEXT,
    location VARCHAR(200),
    event_date TIMESTAMP NOT NULL,
    cargo_data JSONB, -- Raw tracking data from cargo company
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cargo pricing table
CREATE TABLE cargo_pricing (
    id SERIAL PRIMARY KEY,
    cargo_company_id INTEGER REFERENCES cargo_companies(id),
    shipping_method_id INTEGER REFERENCES shipping_methods(id),
    from_city VARCHAR(100),
    to_city VARCHAR(100),
    weight_min DECIMAL(8,3) DEFAULT 0,
    weight_max DECIMAL(8,3),
    volume_min DECIMAL(8,3) DEFAULT 0,
    volume_max DECIMAL(8,3),
    price DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_until DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Address validation table
CREATE TABLE address_validations (
    id SERIAL PRIMARY KEY,
    original_address TEXT NOT NULL,
    validated_address JSONB,
    city VARCHAR(100),
    district VARCHAR(100),
    neighborhood VARCHAR(100),
    postal_code VARCHAR(10),
    coordinates POINT, -- Latitude, longitude
    validation_source VARCHAR(50), -- 'google_maps', 'yandex_maps', 'cargo_company'
    validation_score DECIMAL(3,2), -- 0.00 to 1.00
    is_valid BOOLEAN DEFAULT false,
    validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Omnichannel Management

```sql
-- Channel inventory table
CREATE TABLE channel_inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    channel_id INTEGER REFERENCES sales_channels(id),
    platform_id INTEGER REFERENCES ecommerce_platforms(id),
    available_quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    sync_enabled BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, channel_id, platform_id)
);

-- Channel pricing table
CREATE TABLE channel_pricing (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    channel_id INTEGER REFERENCES sales_channels(id),
    platform_id INTEGER REFERENCES ecommerce_platforms(id),
    base_price DECIMAL(15,4) NOT NULL,
    sale_price DECIMAL(15,4),
    currency VARCHAR(3) DEFAULT 'TRY',
    margin_rate DECIMAL(5,2),
    commission_rate DECIMAL(5,2),
    effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effective_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cross-channel customer mapping table
CREATE TABLE cross_channel_customers (
    id SERIAL PRIMARY KEY,
    master_customer_id INTEGER REFERENCES customers(id),
    platform_id INTEGER REFERENCES ecommerce_platforms(id),
    platform_customer_id VARCHAR(100),
    platform_email VARCHAR(100),
    platform_phone VARCHAR(20),
    first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_order_at TIMESTAMP,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(15,4) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(platform_id, platform_customer_id)
);

-- Integration webhooks table
CREATE TABLE integration_webhooks (
    id SERIAL PRIMARY KEY,
    platform_id INTEGER REFERENCES ecommerce_platforms(id),
    cargo_company_id INTEGER REFERENCES cargo_companies(id),
    webhook_type VARCHAR(50) NOT NULL, -- 'order_created', 'order_updated', 'shipment_status'
    webhook_url VARCHAR(500) NOT NULL,
    secret_key VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### System Monitoring and Logging

```sql
-- Comprehensive system logs table
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(100),
    action_type VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import'
    module_code VARCHAR(50),
    table_name VARCHAR(50),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    request_url TEXT,
    request_method VARCHAR(10),
    response_status INTEGER,
    execution_time_ms INTEGER,
    error_message TEXT,
    additional_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance metrics table
CREATE TABLE performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metric_unit VARCHAR(20),
    metric_category VARCHAR(50), -- 'database', 'api', 'memory', 'cpu'
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Export/Import logs table
CREATE TABLE export_import_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    operation_type VARCHAR(20) NOT NULL, -- 'export', 'import'
    module_code VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    file_format VARCHAR(20) NOT NULL, -- 'excel', 'csv', 'pdf', 'json'
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    record_count INTEGER,
    filters_applied JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_message TEXT,
    download_url TEXT,
    expires_at TIMESTAMP,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- User sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Security events table
CREATE TABLE security_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- 'failed_login', 'suspicious_activity', 'permission_denied', 'data_breach_attempt'
    user_id INTEGER REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    description TEXT,
    additional_data JSONB,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data export templates table
CREATE TABLE export_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    module_code VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    columns_config JSONB NOT NULL, -- Column selection and formatting
    filters_config JSONB, -- Default filters
    format_config JSONB, -- Formatting options
    is_public BOOLEAN DEFAULT false,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Hata Yönetimi

### Frontend Hata Yönetimi
- React Error Boundary ile component seviyesinde hata yakalama
- Axios interceptor'ları ile API hata yönetimi
- Toast notification'lar ile kullanıcı bilgilendirme
- Form validasyon hataları için inline mesajlar

### Backend Hata Yönetimi
- Global error handler middleware
- Özel hata sınıfları (ValidationError, AuthenticationError, etc.)
- Structured logging ile hata kayıtları
- HTTP status kodları ile standart hata yanıtları

### Hata Kodları
```javascript
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  AUTHORIZATION_FAILED: 'AUTHORIZATION_FAILED',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION'
};
```

## Test Stratejisi

### Frontend Testleri
- **Unit Testler**: Jest + React Testing Library
  - Component render testleri
  - Hook testleri
  - Utility function testleri
- **Integration Testler**: 
  - API entegrasyonu testleri
  - Form submission testleri
- **E2E Testler**: Cypress
  - Kritik kullanıcı akışları
  - Cross-browser testleri

### Backend Testleri
- **Unit Testler**: Jest + Supertest
  - Service layer testleri
  - Utility function testleri
  - Middleware testleri
- **Integration Testler**:
  - API endpoint testleri
  - Veritabanı işlem testleri
- **Load Testler**: Artillery.js
  - API performans testleri

### Test Veritabanı
- Test ortamı için ayrı PostgreSQL instance
- Test öncesi seed data yükleme
- Test sonrası cleanup işlemleri

## Güvenlik Önlemleri

### Kimlik Doğrulama ve Yetkilendirme
- JWT token tabanlı authentication
- Refresh token mekanizması
- Role-based access control (RBAC)
- Session timeout yönetimi

### Veri Güvenliği
- Şifre hashleme (bcrypt)
- SQL injection koruması (parameterized queries)
- XSS koruması (input sanitization)
- CSRF token koruması
- Rate limiting

### API Güvenliği
- HTTPS zorunluluğu
- CORS yapılandırması
- Request validation
- API key authentication (external services için)

## Performans Optimizasyonları

### Frontend
- Code splitting ve lazy loading
- Memoization (React.memo, useMemo)
- Virtual scrolling (büyük listeler için)
- Image optimization
- Bundle size optimization

### Backend
- Database indexing
- Query optimization
- Caching (Redis)
- Connection pooling
- Pagination

### Veritabanı
- Proper indexing strategy
- Query performance monitoring
- Regular maintenance tasks
- Backup ve recovery planı