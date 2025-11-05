const request = require('supertest');
const { app } = require('../server');
const { sequelize } = require('../config/database');
const { User, Customer, Product, ServiceRequest } = require('../models');

describe('Service Module Tests', () => {
  let authToken;
  let testUser;
  let testCustomer;
  let testProduct;
  let testServiceRequest;

  beforeAll(async () => {
    // Test veritabanını senkronize et
    await sequelize.sync({ force: true });

    // Test kullanıcısı oluştur
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password_hash: 'hashedpassword',
      first_name: 'Test',
      last_name: 'User',
      is_active: true
    });

    // Test müşterisi oluştur
    testCustomer = await Customer.create({
      customer_code: 'CUST001',
      company_name: 'Test Şirketi',
      customer_type: 'customer',
      contact_person: 'Test Kişi',
      phone: '555-1234',
      email: 'customer@test.com',
      is_active: true
    });

    // Test ürünü oluştur
    testProduct = await Product.create({
      product_code: 'PROD001',
      product_name: 'Test Ürün',
      description: 'Test ürün açıklaması',
      unit: 'adet',
      sale_price: 100.00,
      is_active: true
    });

    // Auth token al (mock)
    authToken = 'mock-jwt-token';
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/services', () => {
    it('should create a new service request', async () => {
      const serviceRequestData = {
        customer_id: testCustomer.id,
        product_id: testProduct.id,
        issue_description: 'Ürün çalışmıyor, kontrol edilmesi gerekiyor',
        priority: 'normal'
      };

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send(serviceRequestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('request_number');
      expect(response.body.data.issue_description).toBe(serviceRequestData.issue_description);
      expect(response.body.data.status).toBe('pending');

      testServiceRequest = response.body.data;
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        customer_id: 'invalid',
        issue_description: 'Kısa'
      };

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/services', () => {
    it('should get all service requests', async () => {
      const response = await request(app)
        .get('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter service requests by status', async () => {
      const response = await request(app)
        .get('/api/services?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/services/:id', () => {
    it('should get service request by id', async () => {
      const response = await request(app)
        .get(`/api/services/${testServiceRequest.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testServiceRequest.id);
      expect(response.body.data.customer).toBeDefined();
    });

    it('should return 404 for non-existent service request', async () => {
      const response = await request(app)
        .get('/api/services/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/services/:id', () => {
    it('should update service request', async () => {
      const updateData = {
        priority: 'high',
        estimated_cost: 150.00
      };

      const response = await request(app)
        .put(`/api/services/${testServiceRequest.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.priority).toBe('high');
      expect(parseFloat(response.body.data.estimated_cost)).toBe(150.00);
    });
  });

  describe('PATCH /api/services/:id/status', () => {
    it('should update service status', async () => {
      const statusData = {
        status: 'in_progress',
        notes: 'Teknisyen atandı ve çalışmaya başlandı'
      };

      const response = await request(app)
        .patch(`/api/services/${testServiceRequest.id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(statusData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('in_progress');
    });
  });

  describe('PATCH /api/services/:id/assign-technician', () => {
    it('should assign technician to service request', async () => {
      const assignData = {
        technician_id: testUser.id,
        notes: 'Deneyimli teknisyen atandı'
      };

      const response = await request(app)
        .patch(`/api/services/${testServiceRequest.id}/assign-technician`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(assignData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.assigned_technician_id).toBe(testUser.id);
    });
  });

  describe('POST /api/services/:id/activities', () => {
    it('should add service activity', async () => {
      const activityData = {
        activity_type: 'diagnosis',
        description: 'Ürün incelendi, arıza tespit edildi',
        duration_minutes: 30,
        cost: 50.00
      };

      const response = await request(app)
        .post(`/api/services/${testServiceRequest.id}/activities`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(activityData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.activity_type).toBe('diagnosis');
      expect(response.body.data.duration_minutes).toBe(30);
    });
  });

  describe('GET /api/services/:id/activities', () => {
    it('should get service activities', async () => {
      const response = await request(app)
        .get(`/api/services/${testServiceRequest.id}/activities`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/services/:id/parts', () => {
    it('should add service parts', async () => {
      const partsData = {
        parts: [
          {
            product_id: testProduct.id,
            quantity: 2,
            unit_price: 25.00
          }
        ]
      };

      const response = await request(app)
        .post(`/api/services/${testServiceRequest.id}/parts`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(partsData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data[0].quantity).toBe(2);
    });
  });

  describe('GET /api/services/:id/parts', () => {
    it('should get service parts', async () => {
      const response = await request(app)
        .get(`/api/services/${testServiceRequest.id}/parts`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/services/reports/history', () => {
    it('should get service history report', async () => {
      const response = await request(app)
        .get('/api/services/reports/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.summary).toBeDefined();
      expect(response.body.data.service_requests).toBeInstanceOf(Array);
    });

    it('should filter service history by date range', async () => {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];

      const response = await request(app)
        .get(`/api/services/reports/history?start_date=${startDate}&end_date=${endDate}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/services/reports/technician-performance', () => {
    it('should get technician performance report', async () => {
      const response = await request(app)
        .get('/api/services/reports/technician-performance')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('DELETE /api/services/:id', () => {
    it('should delete service request', async () => {
      const response = await request(app)
        .delete(`/api/services/${testServiceRequest.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 when trying to delete non-existent service request', async () => {
      const response = await request(app)
        .delete('/api/services/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});