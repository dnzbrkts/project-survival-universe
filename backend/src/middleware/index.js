/**
 * Temel Middleware'ler
 * Express.js için genel middleware'ler
 */

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

/**
 * CORS Middleware
 */
const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

/**
 * Security Middleware (Helmet)
 */
const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
});

/**
 * Rate Limiting Middleware
 */
const rateLimitMiddleware = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 dakika
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 istek
  message: {
    error: 'Çok fazla istek gönderildi',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 dakika sonra tekrar deneyin'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Geliştirme ortamında rate limiting'i atla
    return process.env.NODE_ENV === 'development';
  }
});

/**
 * API Rate Limiting (daha sıkı)
 */
const apiRateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 1000, // 1000 istek
  message: {
    error: 'API rate limit aşıldı',
    code: 'API_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Auth Rate Limiting (çok sıkı)
 */
const authRateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // 5 başarısız giriş denemesi
  message: {
    error: 'Çok fazla giriş denemesi',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    retryAfter: '15 dakika sonra tekrar deneyin'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Başarılı istekleri sayma
});

/**
 * Request Logging Middleware
 */
const requestLoggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Response bittiğinde log yaz
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };

    // Sadece hataları ve yavaş istekleri logla
    if (res.statusCode >= 400 || duration > 1000) {
      console.log('🚨 Request Log:', JSON.stringify(logData));
    } else if (process.env.NODE_ENV === 'development') {
      console.log('📝 Request:', `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });

  next();
};

/**
 * Error Handling Middleware
 */
const errorHandlingMiddleware = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Validation hatası
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Doğrulama hatası',
      code: 'VALIDATION_ERROR',
      details: err.errors
    });
  }

  // Sequelize hatası
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Veritabanı doğrulama hatası',
      code: 'DATABASE_VALIDATION_ERROR',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize unique constraint hatası
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Kayıt zaten mevcut',
      code: 'DUPLICATE_ENTRY',
      field: err.errors[0]?.path
    });
  }

  // JWT hatası
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Geçersiz token',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token süresi dolmuş',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Genel hata
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Sunucu hatası';

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found Middleware
 */
const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    error: 'Endpoint bulunamadı',
    code: 'NOT_FOUND',
    path: req.originalUrl,
    method: req.method
  });
};

/**
 * Validation Result Middleware
 */
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Doğrulama hatası',
      code: 'VALIDATION_ERROR',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

/**
 * JSON Parse Error Middleware
 */
const jsonParseErrorMiddleware = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Geçersiz JSON formatı',
      code: 'INVALID_JSON'
    });
  }
  next(err);
};

/**
 * Health Check Middleware
 */
const healthCheckMiddleware = (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
};

/**
 * Request ID Middleware
 */
const requestIdMiddleware = (req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.id);
  next();
};

/**
 * Response Time Middleware
 */
const responseTimeMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();
  
  const originalSend = res.send;
  res.send = function(data) {
    const end = process.hrtime.bigint();
    const responseTime = Number(end - start) / 1000000; // nanoseconds to milliseconds
    res.setHeader('X-Response-Time', `${responseTime.toFixed(2)}ms`);
    originalSend.call(this, data);
  };
  
  next();
};

const authMiddleware = require('./authMiddleware');
const permissionMiddleware = require('./permissionMiddleware');

module.exports = {
  corsMiddleware,
  securityMiddleware,
  rateLimitMiddleware,
  apiRateLimitMiddleware,
  authRateLimitMiddleware,
  requestLoggingMiddleware,
  errorHandlingMiddleware,
  notFoundMiddleware,
  validationMiddleware,
  jsonParseErrorMiddleware,
  healthCheckMiddleware,
  requestIdMiddleware,
  responseTimeMiddleware,
  authMiddleware,
  permissionMiddleware
};