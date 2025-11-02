# İşletme Yönetim Sistemi (Business Management System)

## 📋 Proje Hakkında

İşletme Yönetim Sistemi, küçük ve orta ölçekli işletmelerin tüm operasyonlarını tek bir platformda yönetebilmesi için tasarlanmış kapsamlı bir ERP ve e-ticaret çözümüdür. Sistem, modern web teknolojileri kullanılarak geliştirilmiş olup, dinamik modül yapısı sayesinde işletmelerin ihtiyaçlarına göre özelleştirilebilir.

## 🚀 Temel Özellikler

### 💼 İş Yönetimi Modülleri
- **Stok Yönetimi**: Ürün katalog yönetimi, stok takibi, barkod sistemi
- **Satış Yönetimi**: Fiyat teklifleri, siparişler, faturalar, irsaliyeler
- **Müşteri Yönetimi**: CRM, müşteri segmentasyonu, iletişim geçmişi
- **Servis Yönetimi**: Servis talepleri, teknisyen atama, takip sistemi
- **Muhasebe**: Mali kayıtlar, raporlar, bilanço, gelir tablosu
- **İnsan Kaynakları**: Personel yönetimi, bordro, izin takibi

### 🛒 E-Ticaret Entegrasyonları
- **Marketplace Entegrasyonları**: Trendyol, Hepsiburada, N11, Amazon
- **Omnichannel Yönetim**: Çoklu kanal stok ve fiyat senkronizasyonu
- **Otomatik Sipariş İşleme**: Platform siparişlerinin otomatik aktarımı
- **Unified Customer Management**: Çoklu kanal müşteri profilleri

### 📦 Kargo ve Lojistik
- **Kargo Entegrasyonları**: MNG, Yurtiçi, Aras, PTT, UPS, Sürat
- **Otomatik Etiket Oluşturma**: Kargo etiketlerinin otomatik yazdırılması
- **Takip Sistemi**: Gerçek zamanlı kargo takibi
- **Maliyet Optimizasyonu**: En uygun kargo seçimi

### 💳 Satış Noktası (POS)
- **Modern POS Arayüzü**: Dokunmatik ekran uyumlu satış sistemi
- **Barkod Entegrasyonu**: Hızlı ürün ekleme ve satış
- **Çoklu Ödeme Desteği**: Nakit, kart, dijital ödeme yöntemleri
- **Kasa Yönetimi**: Günlük kasa açma/kapama işlemleri

### 🎯 B2B ve Kurumsal Özellikler
- **B2B Müşteri Yönetimi**: Kurumsal müşteri kategorileri
- **Özel Fiyatlandırma**: Müşteri bazlı özel fiyat listeleri
- **Kontrat Yönetimi**: Kurumsal anlaşmalar ve şartlar
- **Volume Pricing**: Miktar bazlı indirim sistemi

### 🎫 Pazarlama ve İndirimler
- **İndirim Kuponu Sistemi**: Sabit tutar ve yüzdelik indirimler
- **Otomatik İletişim**: SMS ve email otomasyonu
- **Kampanya Yönetimi**: Toplu mesaj gönderimi
- **Müşteri Segmentasyonu**: Hedefli pazarlama kampanyaları

## 🏗️ Teknik Mimari

### Frontend
- **Framework**: React.js 18+
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI / Ant Design
- **Routing**: React Router v6
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **ORM**: Sequelize
- **Authentication**: JWT
- **File Storage**: Local/AWS S3

### Veritabanı
- **Primary DB**: PostgreSQL
- **Caching**: Redis
- **Search**: Elasticsearch (opsiyonel)
- **File Storage**: MinIO/AWS S3

## 📦 Kurulum

### Gereksinimler
- Node.js 18.0 veya üzeri
- PostgreSQL 14.0 veya üzeri
- Redis 6.0 veya üzeri
- Git

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/your-org/isletme-yonetim-sistemi.git
cd isletme-yonetim-sistemi
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run migrate
npm run seed
npm run dev
```

### 3. Frontend Kurulumu
```bash
cd frontend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run dev
```

### 4. Veritabanı Kurulumu
```sql
-- PostgreSQL'de veritabanı oluşturun
CREATE DATABASE isletme_yonetim_sistemi;
CREATE USER ims_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE isletme_yonetim_sistemi TO ims_user;
```

## ⚙️ Konfigürasyon

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=isletme_yonetim_sistemi
DB_USER=ims_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10MB

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS
SMS_PROVIDER=netgsm
SMS_API_KEY=your_sms_api_key
SMS_SECRET=your_sms_secret

# E-commerce Integrations
TRENDYOL_API_KEY=your_trendyol_api_key
TRENDYOL_SECRET=your_trendyol_secret
HEPSIBURADA_API_KEY=your_hepsiburada_api_key

# Cargo Integrations
MNG_API_KEY=your_mng_api_key
YURTICI_API_KEY=your_yurtici_api_key
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=İşletme Yönetim Sistemi
VITE_APP_VERSION=1.0.0
```

## 🚀 Kullanım

### İlk Kurulum Sonrası

1. **Admin Hesabı Oluşturma**
   - Tarayıcıda `http://localhost:5173` adresine gidin
   - İlk kurulum sihirbazını takip edin
   - Admin kullanıcısını oluşturun

2. **Modül Aktivasyonu**
   - Sistem Yönetimi > Modüller sayfasına gidin
   - İhtiyacınız olan modülleri aktifleştirin
   - Modül ayarlarını yapılandırın

3. **Temel Veri Girişi**
   - Ürün kategorilerini oluşturun
   - Ürünleri ekleyin
   - Müşteri bilgilerini girin
   - Kullanıcıları ve rollerini tanımlayın

### Modül Kullanım Kılavuzları

#### Stok Yönetimi
```javascript
// Ürün ekleme örneği
const product = {
  product_code: "PRD001",
  product_name: "Örnek Ürün",
  category_id: 1,
  unit: "Adet",
  purchase_price: 100.00,
  sale_price: 150.00,
  critical_stock_level: 10
};
```

#### E-ticaret Entegrasyonu
```javascript
// Trendyol entegrasyonu örneği
const trendyolConfig = {
  api_key: "your_api_key",
  secret: "your_secret",
  supplier_id: "your_supplier_id",
  auto_sync: true,
  sync_interval: 30 // dakika
};
```

#### Kargo Entegrasyonu
```javascript
// MNG Kargo gönderi oluşturma örneği
const shipment = {
  recipient_name: "Alıcı Adı",
  recipient_phone: "05551234567",
  recipient_address: "Tam Adres",
  package_count: 1,
  weight: 2.5,
  cod_amount: 0
};
```

## 📊 Modül Listesi

### Core Modüller (Temel)
- [x] **Authentication**: Kimlik doğrulama ve yetkilendirme
- [x] **User Management**: Kullanıcı ve rol yönetimi
- [x] **System Management**: Sistem ayarları ve modül kontrolü
- [x] **Logging**: Sistem logları ve audit trail

### İş Yönetimi Modülleri
- [x] **Inventory Management**: Stok ve ürün yönetimi
- [x] **Customer Management**: Müşteri ve cari hesap yönetimi
- [x] **Sales Management**: Satış süreçleri yönetimi
- [x] **Invoice Management**: Fatura ve ödeme yönetimi
- [x] **Service Management**: Servis ve destek yönetimi
- [x] **Accounting**: Muhasebe ve mali raporlar
- [x] **HR Management**: İnsan kaynakları yönetimi
- [x] **Payroll**: Bordro ve maaş yönetimi

### Satış ve Pazarlama
- [x] **POS System**: Satış noktası sistemi
- [x] **Quotation Management**: Fiyat teklifi yönetimi
- [x] **B2B Management**: Kurumsal müşteri yönetimi
- [x] **Coupon System**: İndirim kuponu sistemi
- [x] **CRM**: Müşteri ilişkileri yönetimi
- [x] **Communication**: SMS/Email otomasyonu

### E-ticaret ve Entegrasyonlar
- [x] **E-commerce Integration**: Marketplace entegrasyonları
- [x] **Cargo Integration**: Kargo şirketi entegrasyonları
- [x] **Omnichannel Management**: Çoklu kanal yönetimi
- [x] **Customer Portal**: Müşteri self-servis portalı

### Destek Modülleri
- [x] **Barcode System**: Barkod yönetimi
- [x] **Reporting**: Raporlama ve analitik
- [x] **Mobile Support**: Mobil uygulama desteği
- [x] **Monitoring**: Sistem izleme ve performans

## 🔌 API Dokümantasyonu

### Authentication Endpoints
```
POST /api/auth/login          # Kullanıcı girişi
POST /api/auth/logout         # Kullanıcı çıkışı
POST /api/auth/refresh        # Token yenileme
GET  /api/auth/profile        # Kullanıcı profili
```

### Product Management
```
GET    /api/inventory/products           # Ürün listesi
POST   /api/inventory/products           # Yeni ürün
GET    /api/inventory/products/:id       # Ürün detayı
PUT    /api/inventory/products/:id       # Ürün güncelleme
DELETE /api/inventory/products/:id       # Ürün silme
```

### E-commerce Integration
```
GET  /api/ecommerce/platforms            # Platform listesi
POST /api/ecommerce/products/sync        # Ürün senkronizasyonu
GET  /api/ecommerce/orders/import        # Sipariş aktarımı
POST /api/ecommerce/inventory/sync       # Stok senkronizasyonu
```

### Cargo Integration
```
GET  /api/cargo/companies                # Kargo şirketleri
POST /api/cargo/shipments/create         # Gönderi oluşturma
GET  /api/cargo/shipments/:id/track      # Gönderi takibi
POST /api/cargo/labels/generate          # Etiket oluşturma
```

## 🧪 Test

### Unit Tests
```bash
# Backend testleri
cd backend
npm run test

# Frontend testleri
cd frontend
npm run test
```

### Integration Tests
```bash
# API integration testleri
npm run test:integration

# E2E testleri
npm run test:e2e
```

### Test Coverage
```bash
# Test coverage raporu
npm run test:coverage
```

## 📈 Performans

### Önerilen Sistem Gereksinimleri

#### Minimum Gereksinimler
- **CPU**: 2 core, 2.0 GHz
- **RAM**: 4 GB
- **Disk**: 20 GB SSD
- **Network**: 10 Mbps

#### Önerilen Gereksinimler
- **CPU**: 4 core, 3.0 GHz
- **RAM**: 8 GB
- **Disk**: 50 GB SSD
- **Network**: 100 Mbps

### Performans Optimizasyonları
- Redis caching sistemi
- Database query optimizasyonu
- CDN kullanımı
- Image optimization
- Lazy loading
- Code splitting

## 🔒 Güvenlik

### Güvenlik Özellikleri
- JWT tabanlı authentication
- Role-based access control (RBAC)
- SQL injection koruması
- XSS koruması
- CSRF token koruması
- Rate limiting
- IP bazlı erişim kontrolü
- 2FA desteği

### Güvenlik Best Practices
- Düzenli güvenlik güncellemeleri
- Güçlü şifre politikaları
- Düzenli backup alımı
- SSL/TLS şifreleme
- Güvenlik logları izleme

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 🤝 Katkıda Bulunma

### Geliştirme Süreci
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Kod Standartları
- ESLint ve Prettier kullanın
- TypeScript tip tanımları ekleyin
- Unit testler yazın
- Commit mesajlarında conventional commits kullanın

## 📞 Destek

### Dokümantasyon
- [API Dokümantasyonu](docs/api.md)
- [Kullanıcı Kılavuzu](docs/user-guide.md)
- [Geliştirici Kılavuzu](docs/developer-guide.md)
- [Deployment Kılavuzu](docs/deployment.md)

### İletişim
- **Email**: support@isletme-yonetim-sistemi.com
- **GitHub Issues**: [Issues sayfası](https://github.com/your-org/isletme-yonetim-sistemi/issues)
- **Discord**: [Discord sunucusu](https://discord.gg/your-server)

## 🗺️ Roadmap

### v1.0.0 (Mevcut)
- [x] Temel ERP modülleri
- [x] E-ticaret entegrasyonları
- [x] Kargo entegrasyonları
- [x] POS sistemi
- [x] Müşteri portalı

### v1.1.0 (Planlanan)
- [ ] Mobil uygulama
- [ ] Gelişmiş raporlama
- [ ] AI destekli öneriler
- [ ] Blockchain entegrasyonu

### v1.2.0 (Gelecek)
- [ ] IoT cihaz entegrasyonları
- [ ] Gelişmiş analitik
- [ ] Multi-tenant yapı
- [ ] Uluslararası genişleme

## 📊 İstatistikler

- **Toplam Modül**: 26 ana modül
- **API Endpoint**: 200+ endpoint
- **Veritabanı Tablosu**: 60+ tablo
- **E-ticaret Entegrasyonu**: 6+ platform
- **Kargo Entegrasyonu**: 6+ şirket
- **Desteklenen Dil**: Türkçe, İngilizce
- **Kod Satırı**: 50,000+ satır

## 🏆 Özellikler

### ✅ Tamamlanan Özellikler
- Dinamik modül sistemi
- Çoklu yetki kontrolü
- E-ticaret platform entegrasyonları
- Kargo şirketi entegrasyonları
- POS sistemi
- B2B müşteri yönetimi
- İndirim kuponu sistemi
- Otomatik SMS/Email
- Müşteri portalı
- Omnichannel yönetim

### 🚧 Geliştirme Aşamasında
- Mobil uygulama
- Gelişmiş analitik
- AI önerileri
- Blockchain entegrasyonu

### 📋 Planlanan Özellikler
- IoT entegrasyonları
- Multi-tenant yapı
- Uluslararası genişleme
- Gelişmiş güvenlik

---

**İşletme Yönetim Sistemi** - Modern işletmeler için kapsamlı ERP ve e-ticaret çözümü

© 2024 İşletme Yönetim Sistemi. Tüm hakları saklıdır.