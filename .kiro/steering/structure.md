# Proje Yapısı

## Ana Dizin Yapısı
```
isletme-yonetim-sistemi/
├── backend/           # Node.js/Express backend
├── frontend/          # React frontend
├── docs/             # Dokümantasyon
├── .kiro/            # Kiro konfigürasyonları
└── README.md         # Proje dokümantasyonu
```

## Backend Yapısı (Tahmini)
```
backend/
├── src/
│   ├── controllers/   # API controller'ları
│   ├── models/        # Sequelize modelleri
│   ├── routes/        # Express route'ları
│   ├── services/      # İş mantığı servisleri
│   ├── middleware/    # Express middleware'leri
│   ├── utils/         # Yardımcı fonksiyonlar
│   └── config/        # Konfigürasyon dosyaları
├── migrations/        # Veritabanı migration'ları
├── seeders/          # Seed data dosyaları
├── tests/            # Test dosyaları
└── uploads/          # Yüklenen dosyalar
```

## Frontend Yapısı (Tahmini)
```
frontend/
├── src/
│   ├── components/    # React bileşenleri
│   ├── pages/         # Sayfa bileşenleri
│   ├── store/         # Redux store
│   ├── services/      # API servisleri
│   ├── utils/         # Yardımcı fonksiyonlar
│   ├── hooks/         # Custom React hooks
│   ├── assets/        # Statik dosyalar
│   └── styles/        # CSS/SCSS dosyaları
├── public/           # Public dosyalar
└── tests/            # Test dosyaları
```

## Modül Organizasyonu

### Core Modüller
- Authentication (Kimlik doğrulama)
- User Management (Kullanıcı yönetimi)
- System Management (Sistem yönetimi)
- Logging (Log yönetimi)

### İş Modülleri
- Inventory Management (Stok yönetimi)
- Customer Management (Müşteri yönetimi)
- Sales Management (Satış yönetimi)
- Invoice Management (Fatura yönetimi)
- Service Management (Servis yönetimi)
- Accounting (Muhasebe)
- HR Management (İK yönetimi)
- Payroll (Bordro)

### Entegrasyon Modülleri
- E-commerce Integration (E-ticaret entegrasyonları)
- Cargo Integration (Kargo entegrasyonları)
- POS System (Satış noktası)
- Communication (İletişim)

## API Yapısı
- RESTful API tasarımı
- `/api` prefix kullanımı
- Modül bazlı endpoint organizasyonu
- JWT tabanlı kimlik doğrulama

## Dosya Adlandırma Kuralları
- camelCase: JavaScript/TypeScript dosyaları
- kebab-case: Component dosyaları
- UPPER_CASE: Sabitler ve environment variables
- snake_case: Veritabanı tablo ve kolon isimleri

## Konfigürasyon Dosyaları
- `.env`: Environment variables
- `package.json`: NPM bağımlılıkları
- `eslint.config.js`: ESLint kuralları
- `.prettierrc`: Prettier kuralları