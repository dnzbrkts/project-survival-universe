const ServiceService = require('../modules/service/ServiceService');
const { ServiceRequest, ServiceActivity, ServicePartsUsed, Customer, Product, User } = require('../models');
const { sequelize } = require('../config/database');

// Mock Sequelize models
jest.mock('../models', () => ({
  ServiceRequest: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn()
  },
  ServiceActivity: {
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  },
  ServicePartsUsed: {
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  },
  Customer: {},
  Product: {},
  User: {
    findByPk: jest.fn()
  }
}));

// Mock sequelize transaction
jest.mock('../config/database', () => ({
  sequelize: {
    transaction: jest.fn(() => ({
      commit: jest.fn(),
      rollback: jest.fn()
    }))
  }
}));

describe('ServiceService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateServiceRequestNumber', () => {
    it('should generate service request number with correct format', async () => {
      const mockServiceRequest = {
        request_number: 'SRV202411040001'
      };

      ServiceRequest.findOne.mockResolvedValue(mockServiceRequest);

      const requestNumber = await ServiceService.generateServiceRequestNumber();

      expect(requestNumber).toMatch(/^SRV\d{8}\d{4}$/);
      expect(requestNumber).toContain('20241104'); // Today's date
    });

    it('should increment sequence number correctly', async () => {
      const mockServiceRequest = {
        request_number: 'SRV202411040005'
      };

      ServiceRequest.findOne.mockResolvedValue(mockServiceRequest);

      const requestNumber = await ServiceService.generateServiceRequestNumber();

      expect(requestNumber).toBe('SRV202411040006');
    });

    it('should start with 0001 when no previous requests exist', async () => {
      ServiceRequest.findOne.mockResolvedValue(null);

      const requestNumber = await ServiceService.generateServiceRequestNumber();

      expect(requestNumber).toMatch(/SRV\d{8}0001$/);
    });
  });

  describe('getAllServiceRequests', () => {
    it('should return paginated service requests', async () => {
      const mockResult = {
        count: 25,
        rows: [
          {
            id: 1,
            request_number: 'SRV202411040001',
            status: 'pending',
            customer: { company_name: 'Test Şirketi' }
          }
        ]
      };

      ServiceRequest.findAndCountAll.mockResolvedValue(mockResult);

      const result = await ServiceService.getAllServiceRequests({
        page: 1,
        limit: 10,
        filters: { status: 'pending' }
      });

      expect(result.serviceRequests).toEqual(mockResult.rows);
      expect(result.total).toBe(25);
      expect(ServiceRequest.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'pending' },
          limit: 10,
          offset: 0
        })
      );
    });

    it('should apply multiple filters correctly', async () => {
      const filters = {
        status: 'in_progress',
        priority: 'high',
        customer_id: 1
      };

      ServiceRequest.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await ServiceService.getAllServiceRequests({ filters });

      expect(ServiceRequest.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: 'in_progress',
            priority: 'high',
            customer_id: 1
          }
        })
      );
    });
  });

  describe('getServiceRequestById', () => {
    it('should return service request with all relations', async () => {
      const mockServiceRequest = {
        id: 1,
        request_number: 'SRV202411040001',
        customer: { company_name: 'Test Şirketi' },
        product: { product_name: 'Test Ürün' },
        assignedTechnician: { first_name: 'John', last_name: 'Doe' },
        activities: [],
        partsUsed: []
      };

      ServiceRequest.findByPk.mockResolvedValue(mockServiceRequest);

      const result = await ServiceService.getServiceRequestById(1);

      expect(result).toEqual(mockServiceRequest);
      expect(ServiceRequest.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
    });

    it('should return null for non-existent service request', async () => {
      ServiceRequest.findByPk.mockResolvedValue(null);

      const result = await ServiceService.getServiceRequestById(999);

      expect(result).toBeNull();
    });
  });

  describe('createServiceRequest', () => {
    it('should create service request with generated number', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };

      sequelize.transaction.mockResolvedValue(mockTransaction);

      const mockServiceRequest = {
        id: 1,
        request_number: 'SRV202411040001',
        customer_id: 1,
        issue_description: 'Test issue'
      };

      ServiceRequest.create.mockResolvedValue(mockServiceRequest);
      ServiceActivity.create.mockResolvedValue({});

      // Mock getServiceRequestById
      jest.spyOn(ServiceService, 'getServiceRequestById').mockResolvedValue(mockServiceRequest);

      const serviceRequestData = {
        customer_id: 1,
        issue_description: 'Test issue',
        priority: 'normal',
        created_by: 1
      };

      const result = await ServiceService.createServiceRequest(serviceRequestData);

      expect(ServiceRequest.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_id: 1,
          issue_description: 'Test issue',
          priority: 'normal',
          status: 'pending'
        }),
        { transaction: mockTransaction }
      );

      expect(ServiceActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          service_request_id: 1,
          activity_type: 'created',
          description: 'Servis talebi oluşturuldu'
        }),
        { transaction: mockTransaction }
      );

      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual(mockServiceRequest);
    });

    it('should rollback transaction on error', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };

      sequelize.transaction.mockResolvedValue(mockTransaction);
      ServiceRequest.create.mockRejectedValue(new Error('Database error'));

      const serviceRequestData = {
        customer_id: 1,
        issue_description: 'Test issue',
        created_by: 1
      };

      await expect(ServiceService.createServiceRequest(serviceRequestData))
        .rejects.toThrow('Database error');

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('updateServiceStatus', () => {
    it('should update service status and create activity log', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };

      sequelize.transaction.mockResolvedValue(mockTransaction);

      const mockServiceRequest = {
        id: 1,
        status: 'pending',
        update: jest.fn().mockResolvedValue(true)
      };

      ServiceRequest.findByPk.mockResolvedValue(mockServiceRequest);
      ServiceActivity.create.mockResolvedValue({});

      // Mock getServiceRequestById
      jest.spyOn(ServiceService, 'getServiceRequestById').mockResolvedValue({
        ...mockServiceRequest,
        status: 'in_progress'
      });

      const result = await ServiceService.updateServiceStatus(1, 'in_progress', 'Started work', 1);

      expect(mockServiceRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'in_progress'
        }),
        { transaction: mockTransaction }
      );

      expect(ServiceActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          service_request_id: 1,
          activity_type: 'status_change',
          description: expect.stringContaining('pending → in_progress')
        }),
        { transaction: mockTransaction }
      );

      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should return null for non-existent service request', async () => {
      const mockTransaction = {
        rollback: jest.fn()
      };

      sequelize.transaction.mockResolvedValue(mockTransaction);
      ServiceRequest.findByPk.mockResolvedValue(null);

      const result = await ServiceService.updateServiceStatus(999, 'in_progress', null, 1);

      expect(result).toBeNull();
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('assignTechnician', () => {
    it('should assign technician and create activity log', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };

      sequelize.transaction.mockResolvedValue(mockTransaction);

      const mockServiceRequest = {
        id: 1,
        assigned_technician_id: null,
        update: jest.fn().mockResolvedValue(true)
      };

      const mockTechnician = {
        id: 2,
        first_name: 'John',
        last_name: 'Doe'
      };

      ServiceRequest.findByPk.mockResolvedValue(mockServiceRequest);
      User.findByPk.mockResolvedValue(mockTechnician);
      ServiceActivity.create.mockResolvedValue({});

      // Mock getServiceRequestById
      jest.spyOn(ServiceService, 'getServiceRequestById').mockResolvedValue({
        ...mockServiceRequest,
        assigned_technician_id: 2
      });

      const result = await ServiceService.assignTechnician(1, 2, 'Experienced technician', 1);

      expect(mockServiceRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          assigned_technician_id: 2
        }),
        { transaction: mockTransaction }
      );

      expect(ServiceActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          activity_type: 'technician_assigned',
          description: expect.stringContaining('John Doe')
        }),
        { transaction: mockTransaction }
      );

      expect(mockTransaction.commit).toHaveBeenCalled();
    });
  });

  describe('addServiceParts', () => {
    it('should add multiple parts and create activity log', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };

      sequelize.transaction.mockResolvedValue(mockTransaction);

      const parts = [
        { product_id: 1, quantity: 2, unit_price: 25.00 },
        { product_id: 2, quantity: 1, unit_price: 50.00 }
      ];

      ServicePartsUsed.create
        .mockResolvedValueOnce({ id: 1, ...parts[0], total_price: 50.00 })
        .mockResolvedValueOnce({ id: 2, ...parts[1], total_price: 50.00 });

      ServiceActivity.create.mockResolvedValue({});

      const result = await ServiceService.addServiceParts(1, parts, 1);

      expect(ServicePartsUsed.create).toHaveBeenCalledTimes(2);
      expect(ServiceActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          activity_type: 'parts_added',
          description: '2 adet parça eklendi'
        }),
        { transaction: mockTransaction }
      );

      expect(result).toHaveLength(2);
      expect(mockTransaction.commit).toHaveBeenCalled();
    });
  });

  describe('getServiceHistoryReport', () => {
    it('should generate service history report with summary', async () => {
      const mockServiceRequests = [
        { id: 1, status: 'completed', actual_cost: 100 },
        { id: 2, status: 'in_progress', actual_cost: null },
        { id: 3, status: 'pending', actual_cost: null },
        { id: 4, status: 'completed', actual_cost: 200 }
      ];

      ServiceRequest.findAll.mockResolvedValue(mockServiceRequests);

      const result = await ServiceService.getServiceHistoryReport({
        start_date: '2024-11-01',
        end_date: '2024-11-30'
      });

      expect(result.summary).toEqual({
        total_requests: 4,
        completed: 2,
        in_progress: 1,
        pending: 1,
        cancelled: 0,
        total_cost: 300,
        average_cost: 75
      });

      expect(result.service_requests).toEqual(mockServiceRequests);
    });

    it('should handle empty result set', async () => {
      ServiceRequest.findAll.mockResolvedValue([]);

      const result = await ServiceService.getServiceHistoryReport();

      expect(result.summary.total_requests).toBe(0);
      expect(result.summary.average_cost).toBe(0);
    });
  });

  describe('getTechnicianPerformanceReport', () => {
    it('should generate technician performance report', async () => {
      const mockServiceRequests = [
        {
          id: 1,
          assigned_technician_id: 1,
          status: 'completed',
          actual_cost: 100,
          started_at: '2024-11-01T10:00:00Z',
          completed_at: '2024-11-02T10:00:00Z',
          assignedTechnician: { id: 1, first_name: 'John', last_name: 'Doe' }
        },
        {
          id: 2,
          assigned_technician_id: 1,
          status: 'in_progress',
          actual_cost: null,
          assignedTechnician: { id: 1, first_name: 'John', last_name: 'Doe' }
        }
      ];

      ServiceRequest.findAll.mockResolvedValue(mockServiceRequests);

      const result = await ServiceService.getTechnicianPerformanceReport();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        technician_id: 1,
        technician_name: 'John Doe',
        total_requests: 2,
        completed: 1,
        in_progress: 1,
        pending: 0,
        cancelled: 0,
        total_revenue: 100,
        average_completion_time: 1 // 1 day
      });
    });
  });
});