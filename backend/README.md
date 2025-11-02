# İşletme Yönetim Sistemi - Backend

Node.js/Express.js tabanlı dinamik modüler ERP backend sistemi.

## 🏗 Mimari

### Dinamik Modül Sistemi

Backend, dinamik modül sistemi üzerine kurulmuştur:

- **ModuleRegistry**: Modüllerin kayıt edilmesi ve yönetimi
- **ModuleLoader**: Runtime'da modül yükleme ve kaldırma
- **PermissionManager**: Granüler yetki kontrolü
- **ModuleConfigManager**: Modül konfigürasyon yönetimi

### Katmanlı Mimari

```
┌─────────────────┐
│   Controllers   │  ← HTTP istekleri
├─────────────────┤
│    Services     │  ← İş mantığı
├─────────────────┤
│     Models      │  ← Veri modelleri
├─────────────────┤
│   Database      │  ← PostgreSQL
└─────────────────┘
```

## 📁 Dizin Yapısı

```
backend/
├── src/
│   ├── core/              # Dinamik modül sistemi
│   │   ├── ModuleRegistry.js
│   │   ├── ModuleLoader.js
│   │   ├── PermissionManager.js
│   │   └── ModuleConfigManager.js
│   ├── config/            # Konfigürasyon
│   │   ├── database.js
│   │   └── redis.js
│   ├── models/            # Sequelize modelleri
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Role.js
│   │   └── SystemModule.js
│   ├── middleware/        # Express middleware'leri
│   │   └── index.js
│   ├── migrations/        # Veritabanı migration'ları
│   ├── seeders/          # Seed data
│   ├── modules/          # Dinamik modüller
│   │   ├── stok-yonetimi/
│   │   ├── fatura-yonetimi/
│   │   └── ...
│   └── server.js         # Ana server dosyası
├── uploads/              # Yüklenen dosyalar
├── tests/               # Test dosyaları
└── package.json
```

## 🔧 Konfigürasyon

### Environment Variables

```bash
# Veritabanı
DB_HOST=localhost
DB_PORT=5432
DB_NAME=isletme_yonetim_sistemi
DB_USERNAME=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3000
NODE_ENV=development
```

## 🚀 API Endpoints

### Sistem Yönetimi

```
GET    /api/system/status           # Sistem durumu
GET    /api/system/modules          # Modül listesi
POST   /api/system/modules/:id/toggle  # Modül aktif/pasif
```

### Kimlik Doğrulama

```
POST   /api/auth/login             # Giriş
POST   /api/auth/logout            # Çıkış
POST   /api/auth/refresh           # Token yenileme
GET    /api/auth/profile           # Profil bilgisi
```

### Dinamik Modül API'leri

Aktif modüllere göre dinamik olarak yüklenir:

```
/api/stok-yonetimi/*              # Stok modülü API'leri
/api/fatura-yonetimi/*            # Fatura modülü API'leri
/api/cari-yonetimi/*              # Cari modülü API'leri
```

## 🔐 Güvenlik

### Kimlik Doğrulama

- JWT token tabanlı authentication
- Refresh token mekanizması
- Session timeout yönetimi

### Yetkilendirme

- Role-based access control (RBAC)
- Granüler yetki kontrolü
- Modül seviyesinde erişim kontrolü

### Güvenlik Middleware'leri

- Helmet (güvenlik başlıkları)
- CORS koruması
- Rate limiting
- Input validation
- SQL injection koruması

## 📊 Veritabanı

### Ana Tablolar

- `system_modules`: Sistem modülleri
- `users`: Kullanıcılar
- `roles`: Roller
- `permissions`: Yetkiler
- `user_roles`: Kullanıcı-rol ilişkisi
- `role_permissions`: Rol-yetki ilişkisi
- `module_access_logs`: Modül erişim logları

### Migration'lar

```bash
# Yeni migration oluştur
npx sequelize-cli migration:generate --name create-new-table

# Migration'ları çalıştır
npm run migrate

# Migration'ı geri al
npm run migrate:undo
```

### Seed Data

```bash
# Seed data yükle
npm run seed

# Seed data'yı geri al
npm run seed:undo
```

## 🧪 Test

### Test Türleri

- **Unit Tests**: Servis ve utility testleri
- **Integration Tests**: API endpoint testleri
- **Database Tests**: Model ve migration testleri

### Test Komutları

```bash
# Tüm testleri çalıştır
npm run test

# Watch modunda test
npm run test:watch

# Coverage raporu
npm run test:coverage
```

## 📝 Modül Geliştirme

### Yeni Modül Oluşturma

1. Modül dizini oluşturun:
```bash
mkdir src/modules/yeni-modul
```

2. Modül yapısını oluşturun:
```
src/modules/yeni-modul/
├── models/
├── services/
├── routes/
├── middleware/
└── index.js
```

3. Modülü kaydedin:
```javascript
moduleRegistry.registerModule({
  code: 'YENI_MODUL',
  name: 'Yeni Modül',
  version: '1.0.0',
  // ... diğer özellikler
});
```

### Modül Bileşenleri

#### Model Örneği
```javascript
// src/modules/yeni-modul/models/YeniModel.js
module.exports = (sequelize, DataTypes) => {
  const YeniModel = sequelize.define('YeniModel', {
    // model tanımı
  });
  
  return YeniModel;
};
```

#### Service Örneği
```javascript
// src/modules/yeni-modul/services/YeniService.js
class YeniService {
  constructor(dependencies) {
    this.db = dependencies.db;
  }
  
  async create(data) {
    // servis mantığı
  }
}

module.exports = YeniService;
```

#### Route Örneği
```javascript
// src/modules/yeni-modul/routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Yeni Modül API' });
});

module.exports = router;
```

## 🔍 Monitoring ve Logging

### Sistem Logları

- Request/Response logları
- Hata logları
- Modül erişim logları
- Performans metrikleri

### Health Check

```
GET /health
```

Sistem sağlık durumunu kontrol eder:
- Veritabanı bağlantısı
- Redis bağlantısı
- Modül durumları
- Bellek kullanımı

## 🚀 Deployment

### Production Hazırlığı

1. Environment variables ayarlayın
2. Veritabanı migration'larını çalıştırın
3. SSL sertifikası yapılandırın
4. Reverse proxy (Nginx) kurun
5. Process manager (PM2) kullanın

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Yaygın Sorunlar

1. **Veritabanı bağlantı hatası**
   - PostgreSQL servisinin çalıştığını kontrol edin
   - Bağlantı bilgilerini doğrulayın

2. **Modül yükleme hatası**
   - Modül dosyalarının doğru konumda olduğunu kontrol edin
   - Syntax hatalarını kontrol edin

3. **Yetki hatası**
   - Kullanıcı rollerini kontrol edin
   - Modül yetkilerini doğrulayın

### Debug Modu

```bash
DEBUG=app:* npm run dev
```

## 📚 API Dokümantasyonu

API dokümantasyonu için Swagger/OpenAPI kullanılmaktadır:

```
http://localhost:3000/api-docs
```

## 🤝 Katkıda Bulunma

1. Kod standartlarına uyun (ESLint + Prettier)
2. Test yazın
3. Dokümantasyonu güncelleyin
4. Commit mesajlarında Conventional Commits kullanın

## 📞 Destek

Teknik destek için:
- GitHub Issues
- E-posta: dev@isletme-yonetim.com