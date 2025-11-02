/**
 * Kimlik Doğrulama Testleri
 * JWT token, login/logout endpoint ve middleware testleri
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const AuthService = require('../services/AuthService');
const { User, Role } = require('../models');

describe('Authentication Tests', () => {
  let authService;
  let testUser;
  let testToken;

  beforeAll(async () => {
    authService = new AuthService();
    
    // Test kullanıcısı oluştur
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
  });

  afterAll(async () => {
    // Test verilerini temizle
    if (testUser) {
      await testUser.destroy();
    }
  });

  describe('AuthService', () => {
    describe('login', () => {
      test('should login with valid credentials', async () => {
        const result = await authService.login('testuser', 'password123');
        
        expect(result.success).toBe(true);
        expect(result.user).toBeDefined();
        expect(result.tokens).toBeDefined();
        expect(result.tokens.accessToken).toBeDefined();
        expect(result.tokens.refreshToken).toBeDefined();
        
        testToken = result.tokens.accessToken;
      });

      test('should fail with invalid username', async () => {
        const result = await authService.login('invaliduser', 'password123');
        
        expect(result.success).toBe(false);
        expect(result.code).toBe('USER_NOT_FOUND');
      });

      test('should fail with invalid password', async () => {
        const result = await authService.login('testuser', 'wrongpassword');
        
        expect(result.success).toBe(false);
        expect(result.code).toBe('INVALID_PASSWORD');
      });

      test('should fail with inactive user', async () => {
        await testUser.update({ isActive: false });
        
        const result = await authService.login('testuser', 'password123');
        
        expect(result.success).toBe(false);
        expect(result.code).toBe('USER_INACTIVE');
        
        // Kullanıcıyı tekrar aktif yap
        await testUser.update({ isActive: true });
      });
    });

    describe('verifyToken', () => {
      test('should verify valid token', async () => {
        const result = await authService.verifyToken(testToken);
        
        expect(result.success).toBe(true);
        expect(result.user).toBeDefined();
        expect(result.user.id).toBe(testUser.id);
      });

      test('should fail with invalid token', async () => {
        const result = await authService.verifyToken('invalid.token.here');
        
        expect(result.success).toBe(false);
        expect(result.code).toBe('INVALID_TOKEN');
      });

      test('should fail with expired token', async () => {
        const expiredToken = jwt.sign(
          { userId: testUser.id, type: 'access' },
          process.env.JWT_SECRET || 'test-secret',
          { expiresIn: '1ms' }
        );
        
        // Token'ın expire olması için bekle
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const result = await authService.verifyToken(expiredToken);
        
        expect(result.success).toBe(false);
        expect(result.code).toBe('TOKEN_EXPIRED');
      });
    });

    describe('changePassword', () => {
      test('should change password with valid current password', async () => {
        const result = await authService.changePassword(
          testUser.id, 
          'password123', 
          'newpassword123'
        );
        
        expect(result.success).toBe(true);
        
        // Yeni şifre ile giriş yapabilmeli
        const loginResult = await authService.login('testuser', 'newpassword123');
        expect(loginResult.success).toBe(true);
        
        // Eski şifre ile giriş yapamamalı
        const oldPasswordResult = await authService.login('testuser', 'password123');
        expect(oldPasswordResult.success).toBe(false);
      });

      test('should fail with invalid current password', async () => {
        const result = await authService.changePassword(
          testUser.id, 
          'wrongpassword', 
          'newpassword456'
        );
        
        expect(result.success).toBe(false);
        expect(result.code).toBe('INVALID_CURRENT_PASSWORD');
      });

      test('should fail when new password is same as current', async () => {
        const result = await authService.changePassword(
          testUser.id, 
          'newpassword123', 
          'newpassword123'
        );
        
        expect(result.success).toBe(false);
        expect(result.code).toBe('SAME_PASSWORD');
      });
    });

    describe('refreshToken', () => {
      test('should refresh token with valid refresh token', async () => {
        const loginResult = await authService.login('testuser', 'newpassword123');
        const refreshToken = loginResult.tokens.refreshToken;
        
        const result = await authService.refreshToken(refreshToken);
        
        expect(result.success).toBe(true);
        expect(result.tokens).toBeDefined();
        expect(result.tokens.accessToken).toBeDefined();
        expect(result.tokens.refreshToken).toBeDefined();
      });

      test('should fail with invalid refresh token', async () => {
        const result = await authService.refreshToken('invalid.refresh.token');
        
        expect(result.success).toBe(false);
        expect(result.code).toBe('REFRESH_TOKEN_ERROR');
      });
    });
  });

  describe('Auth Endpoints', () => {
    describe('POST /api/auth/login', () => {
      test('should login with valid credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'testuser',
            password: 'newpassword123'
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user).toBeDefined();
        expect(response.body.tokens).toBeDefined();
      });

      test('should return 401 for invalid credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'testuser',
            password: 'wrongpassword'
          });

        expect(response.status).toBe(401);
        expect(response.body.success).toBeUndefined();
      });

      test('should return 400 for missing fields', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'testuser'
            // password eksik
          });

        expect(response.status).toBe(400);
        expect(response.body.code).toBe('VALIDATION_ERROR');
      });
    });

    describe('POST /api/auth/register', () => {
      test('should register new user with valid data', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'Password123',
            firstName: 'New',
            lastName: 'User'
          });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.user).toBeDefined();
        expect(response.body.tokens).toBeDefined();

        // Test kullanıcısını temizle
        const newUser = await User.findOne({ where: { username: 'newuser' } });
        if (newUser) {
          await newUser.destroy();
        }
      });

      test('should return 400 for duplicate username', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'testuser', // Zaten var olan kullanıcı
            email: 'another@example.com',
            password: 'Password123',
            firstName: 'Another',
            lastName: 'User'
          });

        expect(response.status).toBe(400);
        expect(response.body.code).toBe('USER_EXISTS');
      });

      test('should return 400 for invalid email', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'testuser2',
            email: 'invalid-email',
            password: 'Password123',
            firstName: 'Test',
            lastName: 'User'
          });

        expect(response.status).toBe(400);
        expect(response.body.code).toBe('VALIDATION_ERROR');
      });
    });

    describe('GET /api/auth/profile', () => {
      test('should return user profile with valid token', async () => {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'testuser',
            password: 'newpassword123'
          });

        const token = loginResponse.body.tokens.accessToken;

        const response = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user).toBeDefined();
        expect(response.body.user.username).toBe('testuser');
      });

      test('should return 401 without token', async () => {
        const response = await request(app)
          .get('/api/auth/profile');

        expect(response.status).toBe(401);
        expect(response.body.code).toBe('MISSING_AUTH_HEADER');
      });

      test('should return 401 with invalid token', async () => {
        const response = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', 'Bearer invalid.token.here');

        expect(response.status).toBe(401);
        expect(response.body.code).toBe('INVALID_TOKEN');
      });
    });

    describe('POST /api/auth/change-password', () => {
      test('should change password with valid token and passwords', async () => {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'testuser',
            password: 'newpassword123'
          });

        const token = loginResponse.body.tokens.accessToken;

        const response = await request(app)
          .post('/api/auth/change-password')
          .set('Authorization', `Bearer ${token}`)
          .send({
            currentPassword: 'newpassword123',
            newPassword: 'Password456'
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      test('should return 400 for invalid current password', async () => {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'testuser',
            password: 'Password456'
          });

        const token = loginResponse.body.tokens.accessToken;

        const response = await request(app)
          .post('/api/auth/change-password')
          .set('Authorization', `Bearer ${token}`)
          .send({
            currentPassword: 'wrongpassword',
            newPassword: 'NewPassword789'
          });

        expect(response.status).toBe(400);
        expect(response.body.code).toBe('INVALID_CURRENT_PASSWORD');
      });
    });

    describe('POST /api/auth/refresh', () => {
      test('should refresh token with valid refresh token', async () => {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'testuser',
            password: 'Password456'
          });

        const refreshToken = loginResponse.body.tokens.refreshToken;

        const response = await request(app)
          .post('/api/auth/refresh')
          .send({
            refreshToken
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.tokens).toBeDefined();
      });

      test('should return 401 for invalid refresh token', async () => {
        const response = await request(app)
          .post('/api/auth/refresh')
          .send({
            refreshToken: 'invalid.refresh.token'
          });

        expect(response.status).toBe(401);
      });
    });

    describe('GET /api/auth/verify', () => {
      test('should verify valid token', async () => {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'testuser',
            password: 'Password456'
          });

        const token = loginResponse.body.tokens.accessToken;

        const response = await request(app)
          .get('/api/auth/verify')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.valid).toBe(true);
      });
    });

    describe('POST /api/auth/logout', () => {
      test('should logout successfully', async () => {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            identifier: 'testuser',
            password: 'Password456'
          });

        const token = loginResponse.body.tokens.accessToken;

        const response = await request(app)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });

  describe('Auth Middleware', () => {
    test('should authenticate valid token', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'Password456'
        });

      const token = loginResponse.body.tokens.accessToken;

      // Protected endpoint test
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid.token');

      expect(response.status).toBe(401);
    });

    test('should reject missing token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
    });
  });
});