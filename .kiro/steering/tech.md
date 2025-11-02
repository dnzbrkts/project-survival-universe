# Teknoloji Yığını

## Frontend
- **Framework**: React.js 18+
- **State Management**: Redux Toolkit
- **UI Kütüphanesi**: Material-UI / Ant Design
- **Routing**: React Router v6
- **Build Tool**: Vite

## Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Veritabanı**: PostgreSQL 14+
- **ORM**: Sequelize
- **Kimlik Doğrulama**: JWT
- **Dosya Depolama**: Local/AWS S3

## Veritabanı ve Önbellek
- **Ana Veritabanı**: PostgreSQL
- **Önbellek**: Redis
- **Arama**: Elasticsearch (opsiyonel)
- **Dosya Depolama**: MinIO/AWS S3

## Gereksinimler
- Node.js 18.0+
- PostgreSQL 14.0+
- Redis 6.0+
- Git

## Yaygın Komutlar

### Backend Kurulum ve Çalıştırma
```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

### Frontend Kurulum ve Çalıştırma
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Test Komutları
```bash
# Backend testleri
cd backend && npm run test

# Frontend testleri
cd frontend && npm run test

# Integration testleri
npm run test:integration

# E2E testleri
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Veritabanı İşlemleri
```bash
# Migration çalıştırma
npm run migrate

# Seed data ekleme
npm run seed

# Migration geri alma
npm run migrate:undo
```

## Kod Standartları
- ESLint ve Prettier kullanımı zorunlu
- TypeScript tip tanımları gerekli
- Unit testler yazılmalı
- Conventional commits formatı kullanılmalı

## Environment Variables
- Backend: `.env` dosyası gerekli (DB, JWT, Redis, SMS, E-ticaret API'leri)
- Frontend: `.env` dosyası gerekli (API base URL, app bilgileri)