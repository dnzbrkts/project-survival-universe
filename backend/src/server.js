/**
 * Ana Server Dosyası
 * Express.js server ve dinamik modül sistemi başlatma
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

// Core imports
const { DynamicModuleSystem } = require('./core');
const { testConnection } = require('./config/database');
const { connectRedis } = require('./config/redis');

// Middleware imports
const {
  corsMiddleware,
  securityMiddleware,
  rateLimitMiddleware,
  apiRateLimitMiddleware,
  requestLoggingMiddleware,
  errorHandlingMiddleware,
  notFoundMiddleware,
  jsonParseErrorMiddleware,
  healthCheckMiddleware,
  requestIdMiddleware,
  responseTimeMiddleware
} = require('./middleware');

// Express app oluştur
const app = express();
const PORT = process.env.PORT || 3000;

// Dinamik Modül Sistemi
let moduleSystem;

/**
 * Middleware'leri yapılandırma
 */
function setupMiddlewares() {
  // Request ID ve Response Time
  app.use(requestIdMiddleware);
  app.use(responseTimeMiddleware);

  // Security
  app.use(securityMiddleware);
  app.use(corsMiddleware);

  // Rate Limiting
  app.use(rateLimitMiddleware);
  app.use('/api', apiRateLimitMiddleware);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // JSON parse error handling
  app.use(jsonParseErrorMiddleware);

  // Request logging
  app.use(requestLoggingMiddleware);

  // Static files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  app.use('/public', express.static(path.join(__dirname, '../public')));
}

/**
 * Temel route'ları yapılandırma
 */
function setupBasicRoutes() {
  // Health check
  app.get('/health', healthCheckMiddleware);

  // API info
  app.get('/api', (_, res) => {
    res.json({
      name: 'İşletme Yönetim Sistemi API',
      version: '1.0.0',
      description: 'Dinamik modüler ERP sistemi',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/health',
        system: '/api/system',
        auth: '/api/auth'
      }
    });
  });

  // Auth routes
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);

  // User management routes
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);

  // Role management routes
  const roleRoutes = require('./routes/roleRoutes');
  app.use('/api/roles', roleRoutes);

  // Inventory management routes
  const inventoryRoutes = require('./routes/inventoryRoutes');
  app.use('/api/inventory', inventoryRoutes);

  // Currency management routes
  const currencyRoutes = require('./routes/currencies');
  app.use('/api/currencies', currencyRoutes);

  // Customer management routes
  const customerRoutes = require('./routes/customerRoutes');
  app.use('/api/customers', customerRoutes);

  // Invoice management routes
  const invoiceRoutes = require('./routes/invoiceRoutes');
  app.use('/api/invoices', invoiceRoutes);

  // Service management routes
  const serviceRoutes = require('./routes/serviceRoutes');
  app.use('/api', serviceRoutes);

  // Accounting management routes
  const accountingRoutes = require('./routes/accountingRoutes');
  app.use('/api/accounting', accountingRoutes);

  // Dashboard routes
  const dashboardRoutes = require('./routes/dashboardRoutes');
  app.use('/api/dashboard', dashboardRoutes);

  // Sistem durumu
  app.get('/api/system/status', (_, res) => {
    if (!moduleSystem) {
      return res.status(503).json({
        error: 'Sistem henüz başlatılmadı',
        code: 'SYSTEM_NOT_READY'
      });
    }

    const status = moduleSystem.getSystemStatus();
    res.json(status);
  });

  // Modül bilgileri
  app.get('/api/system/modules', (_, res) => {
    if (!moduleSystem) {
      return res.status(503).json({
        error: 'Sistem henüz başlatılmadı',
        code: 'SYSTEM_NOT_READY'
      });
    }

    const modules = moduleSystem.getModuleInfo();
    res.json(modules);
  });

  // Modül toggle
  app.post('/api/system/modules/:moduleCode/toggle', async (req, res) => {
    if (!moduleSystem) {
      return res.status(503).json({
        error: 'Sistem henüz başlatılmadı',
        code: 'SYSTEM_NOT_READY'
      });
    }

    try {
      const { moduleCode } = req.params;
      const { activate } = req.body;

      const result = await moduleSystem.toggleModule(moduleCode, activate);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
        code: 'MODULE_TOGGLE_ERROR'
      });
    }
  });
}

/**
 * Error handling'i yapılandırma
 */
function setupErrorHandling() {
  // 404 handler
  app.use(notFoundMiddleware);

  // Global error handler
  app.use(errorHandlingMiddleware);
}

/**
 * Sunucuyu başlatma
 */
async function startServer() {
  try {
    console.log('🚀 İşletme Yönetim Sistemi başlatılıyor...');

    // Middleware'leri kur
    setupMiddlewares();

    // Temel route'ları kur
    setupBasicRoutes();

    // Veritabanı bağlantısını test et
    console.log('🔍 Veritabanı bağlantısı kontrol ediliyor...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      throw new Error('Veritabanı bağlantısı kurulamadı');
    }

    // Redis bağlantısını kur
    console.log('🔍 Redis bağlantısı kontrol ediliyor...');
    const redisConnected = await connectRedis();
    
    if (!redisConnected) {
      console.warn('⚠️ Redis bağlantısı kurulamadı, cache devre dışı');
    }

    // Dinamik Modül Sistemini başlat
    console.log('🔧 Dinamik Modül Sistemi başlatılıyor...');
    moduleSystem = new DynamicModuleSystem(app);
    
    const initResult = await moduleSystem.initialize();
    
    if (!initResult.success) {
      throw new Error(`Modül sistemi başlatma hatası: ${initResult.error}`);
    }

    // Auth middleware'e permission manager'ı bağla
    const authMiddleware = require('./middleware/authMiddleware');
    authMiddleware.setPermissionManager(moduleSystem.permissionManager);

    // Module system'i app.locals'a ekle
    app.locals.moduleSystem = moduleSystem;

    console.log('✅ Dinamik Modül Sistemi başarıyla başlatıldı');
    console.log(`📊 Yüklenen modüller: ${initResult.loadResults.length}`);

    // Error handling'i kur
    setupErrorHandling();

    // Sunucuyu başlat
    const server = app.listen(PORT, () => {
      console.log('🎉 Sunucu başarıyla başlatıldı!');
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log(`⚙️ Sistem Durumu: http://localhost:${PORT}/api/system/status`);
      console.log('---');
      console.log('Sistem hazır! 🚀');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));

    return server;

  } catch (error) {
    console.error('❌ Sunucu başlatma hatası:', error.message);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
async function gracefulShutdown(server) {
  console.log('🛑 Sunucu kapatılıyor...');

  // Yeni bağlantıları kabul etmeyi durdur
  server.close(async () => {
    console.log('🔌 HTTP sunucusu kapatıldı');

    try {
      // Modül sistemini kapat
      if (moduleSystem) {
        await moduleSystem.shutdown();
      }

      // Veritabanı bağlantısını kapat
      const { closeConnection } = require('./config/database');
      await closeConnection();

      // Redis bağlantısını kapat
      const { disconnectRedis } = require('./config/redis');
      await disconnectRedis();

      console.log('✅ Tüm bağlantılar kapatıldı');
      process.exit(0);

    } catch (error) {
      console.error('❌ Kapatma hatası:', error);
      process.exit(1);
    }
  });

  // 30 saniye sonra zorla kapat
  setTimeout(() => {
    console.error('⏰ Zorla kapatılıyor...');
    process.exit(1);
  }, 30000);
}

// Yakalanmamış hataları yakala
process.on('uncaughtException', (error) => {
  console.error('💥 Yakalanmamış hata:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Yakalanmamış promise reddi:', reason);
  process.exit(1);
});

// Sunucuyu başlat
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };