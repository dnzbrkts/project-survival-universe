const ServiceService = require('./ServiceService');
const { validationResult } = require('express-validator');

class ServiceController {
  // Tüm servis taleplerini getir
  static async getAllServiceRequests(req, res) {
    try {
      const { page = 1, limit = 10, status, priority, technician_id, customer_id } = req.query;
      
      const filters = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (technician_id) filters.assigned_technician_id = technician_id;
      if (customer_id) filters.customer_id = customer_id;

      const result = await ServiceService.getAllServiceRequests({
        page: parseInt(page),
        limit: parseInt(limit),
        filters
      });

      res.json({
        success: true,
        data: result.serviceRequests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis talepleri getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  // ID ile servis talebi getir
  static async getServiceRequestById(req, res) {
    try {
      const { id } = req.params;
      const serviceRequest = await ServiceService.getServiceRequestById(id);

      if (!serviceRequest) {
        return res.status(404).json({
          success: false,
          message: 'Servis talebi bulunamadı'
        });
      }

      res.json({
        success: true,
        data: serviceRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis talebi getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  // Yeni servis talebi oluştur
  static async createServiceRequest(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validasyon hatası',
          errors: errors.array()
        });
      }

      const serviceRequestData = {
        ...req.body,
        created_by: req.user.id
      };

      const serviceRequest = await ServiceService.createServiceRequest(serviceRequestData);

      res.status(201).json({
        success: true,
        message: 'Servis talebi başarıyla oluşturuldu',
        data: serviceRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis talebi oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }

  // Servis talebi güncelle
  static async updateServiceRequest(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validasyon hatası',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_by: req.user.id
      };

      const serviceRequest = await ServiceService.updateServiceRequest(id, updateData);

      if (!serviceRequest) {
        return res.status(404).json({
          success: false,
          message: 'Servis talebi bulunamadı'
        });
      }

      res.json({
        success: true,
        message: 'Servis talebi başarıyla güncellendi',
        data: serviceRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis talebi güncellenirken hata oluştu',
        error: error.message
      });
    }
  }

  // Servis talebi sil
  static async deleteServiceRequest(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ServiceService.deleteServiceRequest(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Servis talebi bulunamadı'
        });
      }

      res.json({
        success: true,
        message: 'Servis talebi başarıyla silindi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis talebi silinirken hata oluştu',
        error: error.message
      });
    }
  }

  // Servis durumu güncelle
  static async updateServiceStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Durum bilgisi gereklidir'
        });
      }

      const serviceRequest = await ServiceService.updateServiceStatus(id, status, notes, req.user.id);

      if (!serviceRequest) {
        return res.status(404).json({
          success: false,
          message: 'Servis talebi bulunamadı'
        });
      }

      res.json({
        success: true,
        message: 'Servis durumu başarıyla güncellendi',
        data: serviceRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis durumu güncellenirken hata oluştu',
        error: error.message
      });
    }
  }

  // Teknisyen ata
  static async assignTechnician(req, res) {
    try {
      const { id } = req.params;
      const { technician_id, notes } = req.body;

      if (!technician_id) {
        return res.status(400).json({
          success: false,
          message: 'Teknisyen ID gereklidir'
        });
      }

      const serviceRequest = await ServiceService.assignTechnician(id, technician_id, notes, req.user.id);

      if (!serviceRequest) {
        return res.status(404).json({
          success: false,
          message: 'Servis talebi bulunamadı'
        });
      }

      res.json({
        success: true,
        message: 'Teknisyen başarıyla atandı',
        data: serviceRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Teknisyen atanırken hata oluştu',
        error: error.message
      });
    }
  }

  // Servis aktivitelerini getir
  static async getServiceActivities(req, res) {
    try {
      const { id } = req.params;
      const activities = await ServiceService.getServiceActivities(id);

      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis aktiviteleri getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  // Servis aktivitesi ekle
  static async addServiceActivity(req, res) {
    try {
      const { id } = req.params;
      const activityData = {
        ...req.body,
        service_request_id: id,
        technician_id: req.user.id
      };

      const activity = await ServiceService.addServiceActivity(activityData);

      res.status(201).json({
        success: true,
        message: 'Servis aktivitesi başarıyla eklendi',
        data: activity
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis aktivitesi eklenirken hata oluştu',
        error: error.message
      });
    }
  }

  // Kullanılan parçaları getir
  static async getServiceParts(req, res) {
    try {
      const { id } = req.params;
      const parts = await ServiceService.getServiceParts(id);

      res.json({
        success: true,
        data: parts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis parçaları getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  // Kullanılan parça ekle
  static async addServiceParts(req, res) {
    try {
      const { id } = req.params;
      const { parts } = req.body; // Array of parts

      if (!parts || !Array.isArray(parts)) {
        return res.status(400).json({
          success: false,
          message: 'Parça listesi gereklidir'
        });
      }

      const addedParts = await ServiceService.addServiceParts(id, parts, req.user.id);

      res.status(201).json({
        success: true,
        message: 'Servis parçaları başarıyla eklendi',
        data: addedParts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis parçaları eklenirken hata oluştu',
        error: error.message
      });
    }
  }

  // Servis geçmişi raporu
  static async getServiceHistory(req, res) {
    try {
      const { 
        start_date, 
        end_date, 
        customer_id, 
        technician_id, 
        status,
        format = 'json'
      } = req.query;

      const filters = {};
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (customer_id) filters.customer_id = customer_id;
      if (technician_id) filters.technician_id = technician_id;
      if (status) filters.status = status;

      const report = await ServiceService.getServiceHistoryReport(filters);

      if (format === 'excel') {
        // Excel export functionality will be implemented later
        return res.json({
          success: false,
          message: 'Excel export henüz desteklenmiyor'
        });
      }

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis geçmişi raporu oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }

  // Teknisyen performans raporu
  static async getTechnicianPerformance(req, res) {
    try {
      const { 
        start_date, 
        end_date, 
        technician_id 
      } = req.query;

      const filters = {};
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (technician_id) filters.technician_id = technician_id;

      const report = await ServiceService.getTechnicianPerformanceReport(filters);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Teknisyen performans raporu oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }
}

module.exports = ServiceController;