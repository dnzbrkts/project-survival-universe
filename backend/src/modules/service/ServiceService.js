const { ServiceRequest, ServiceActivity, ServicePartsUsed, Customer, Product, User } = require('../../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');

class ServiceService {
  // Otomatik servis talebi numarası oluştur
  static async generateServiceRequestNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = `SRV${year}${month}${day}`;
    
    // Bugün oluşturulan son servis talebinin numarasını bul
    const lastRequest = await ServiceRequest.findOne({
      where: {
        request_number: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['request_number', 'DESC']]
    });

    let sequence = 1;
    if (lastRequest) {
      const lastSequence = parseInt(lastRequest.request_number.slice(-4));
      sequence = lastSequence + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }

  // Tüm servis taleplerini getir
  static async getAllServiceRequests({ page = 1, limit = 10, filters = {} }) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filtreleri uygula
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.priority) {
      whereClause.priority = filters.priority;
    }
    if (filters.assigned_technician_id) {
      whereClause.assigned_technician_id = filters.assigned_technician_id;
    }
    if (filters.customer_id) {
      whereClause.customer_id = filters.customer_id;
    }

    const { count, rows } = await ServiceRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'customer_code', 'company_name', 'contact_person', 'phone', 'email']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'product_code', 'product_name']
        },
        {
          model: User,
          as: 'assignedTechnician',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      serviceRequests: rows,
      total: count
    };
  }

  // ID ile servis talebi getir
  static async getServiceRequestById(id) {
    return await ServiceRequest.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'customer_code', 'company_name', 'contact_person', 'phone', 'email', 'address']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'product_code', 'product_name', 'description']
        },
        {
          model: User,
          as: 'assignedTechnician',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: ServiceActivity,
          as: 'activities',
          include: [
            {
              model: User,
              as: 'technician',
              attributes: ['id', 'first_name', 'last_name']
            }
          ],
          order: [['created_at', 'DESC']]
        },
        {
          model: ServicePartsUsed,
          as: 'partsUsed',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'product_code', 'product_name', 'unit']
            }
          ]
        }
      ]
    });
  }

  // Yeni servis talebi oluştur
  static async createServiceRequest(serviceRequestData) {
    const transaction = await sequelize.transaction();

    try {
      // Otomatik numara oluştur
      const requestNumber = await this.generateServiceRequestNumber();

      const serviceRequest = await ServiceRequest.create({
        request_number: requestNumber,
        customer_id: serviceRequestData.customer_id,
        product_id: serviceRequestData.product_id,
        issue_description: serviceRequestData.issue_description,
        priority: serviceRequestData.priority || 'normal',
        status: 'pending',
        estimated_cost: serviceRequestData.estimated_cost || null,
        created_by: serviceRequestData.created_by
      }, { transaction });

      // İlk aktivite kaydı oluştur
      await ServiceActivity.create({
        service_request_id: serviceRequest.id,
        activity_type: 'created',
        description: 'Servis talebi oluşturuldu',
        technician_id: serviceRequestData.created_by
      }, { transaction });

      await transaction.commit();

      // Oluşturulan servis talebini ilişkili verilerle birlikte getir
      return await this.getServiceRequestById(serviceRequest.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Servis talebi güncelle
  static async updateServiceRequest(id, updateData) {
    const transaction = await sequelize.transaction();

    try {
      const serviceRequest = await ServiceRequest.findByPk(id);
      if (!serviceRequest) {
        return null;
      }

      // Güncelleme öncesi değerleri kaydet
      const oldValues = { ...serviceRequest.dataValues };

      await serviceRequest.update({
        customer_id: updateData.customer_id || serviceRequest.customer_id,
        product_id: updateData.product_id || serviceRequest.product_id,
        issue_description: updateData.issue_description || serviceRequest.issue_description,
        priority: updateData.priority || serviceRequest.priority,
        estimated_cost: updateData.estimated_cost !== undefined ? updateData.estimated_cost : serviceRequest.estimated_cost,
        actual_cost: updateData.actual_cost !== undefined ? updateData.actual_cost : serviceRequest.actual_cost,
        updated_at: new Date()
      }, { transaction });

      // Güncelleme aktivitesi kaydet
      const changes = [];
      if (oldValues.priority !== serviceRequest.priority) {
        changes.push(`Öncelik: ${oldValues.priority} → ${serviceRequest.priority}`);
      }
      if (oldValues.estimated_cost !== serviceRequest.estimated_cost) {
        changes.push(`Tahmini Maliyet: ${oldValues.estimated_cost} → ${serviceRequest.estimated_cost}`);
      }

      if (changes.length > 0) {
        await ServiceActivity.create({
          service_request_id: id,
          activity_type: 'updated',
          description: `Servis talebi güncellendi: ${changes.join(', ')}`,
          technician_id: updateData.updated_by
        }, { transaction });
      }

      await transaction.commit();

      return await this.getServiceRequestById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Servis talebi sil
  static async deleteServiceRequest(id) {
    const transaction = await sequelize.transaction();

    try {
      const serviceRequest = await ServiceRequest.findByPk(id);
      if (!serviceRequest) {
        return false;
      }

      // İlişkili kayıtları sil
      await ServiceActivity.destroy({
        where: { service_request_id: id },
        transaction
      });

      await ServicePartsUsed.destroy({
        where: { service_request_id: id },
        transaction
      });

      await serviceRequest.destroy({ transaction });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Servis durumu güncelle
  static async updateServiceStatus(id, status, notes, userId) {
    const transaction = await sequelize.transaction();

    try {
      const serviceRequest = await ServiceRequest.findByPk(id);
      if (!serviceRequest) {
        return null;
      }

      const oldStatus = serviceRequest.status;
      
      // Durum güncellemesi
      await serviceRequest.update({
        status,
        started_at: status === 'in_progress' && !serviceRequest.started_at ? new Date() : serviceRequest.started_at,
        completed_at: status === 'completed' ? new Date() : null,
        updated_at: new Date()
      }, { transaction });

      // Durum değişikliği aktivitesi kaydet
      await ServiceActivity.create({
        service_request_id: id,
        activity_type: 'status_change',
        description: `Durum değiştirildi: ${oldStatus} → ${status}${notes ? ` (${notes})` : ''}`,
        technician_id: userId
      }, { transaction });

      await transaction.commit();

      return await this.getServiceRequestById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Teknisyen ata
  static async assignTechnician(id, technicianId, notes, userId) {
    const transaction = await sequelize.transaction();

    try {
      const serviceRequest = await ServiceRequest.findByPk(id);
      if (!serviceRequest) {
        return null;
      }

      const oldTechnicianId = serviceRequest.assigned_technician_id;

      await serviceRequest.update({
        assigned_technician_id: technicianId,
        updated_at: new Date()
      }, { transaction });

      // Teknisyen atama aktivitesi kaydet
      const technician = await User.findByPk(technicianId);
      const technicianName = technician ? `${technician.first_name} ${technician.last_name}` : 'Bilinmeyen';
      
      await ServiceActivity.create({
        service_request_id: id,
        activity_type: 'technician_assigned',
        description: `Teknisyen atandı: ${technicianName}${notes ? ` (${notes})` : ''}`,
        technician_id: userId
      }, { transaction });

      await transaction.commit();

      return await this.getServiceRequestById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Servis aktivitelerini getir
  static async getServiceActivities(serviceRequestId) {
    return await ServiceActivity.findAll({
      where: { service_request_id: serviceRequestId },
      include: [
        {
          model: User,
          as: 'technician',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  // Servis aktivitesi ekle
  static async addServiceActivity(activityData) {
    return await ServiceActivity.create({
      service_request_id: activityData.service_request_id,
      activity_type: activityData.activity_type,
      description: activityData.description,
      duration_minutes: activityData.duration_minutes || null,
      cost: activityData.cost || null,
      technician_id: activityData.technician_id
    });
  }

  // Kullanılan parçaları getir
  static async getServiceParts(serviceRequestId) {
    return await ServicePartsUsed.findAll({
      where: { service_request_id: serviceRequestId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'product_code', 'product_name', 'unit', 'sale_price']
        }
      ]
    });
  }

  // Kullanılan parça ekle
  static async addServiceParts(serviceRequestId, parts, userId) {
    const transaction = await sequelize.transaction();

    try {
      const addedParts = [];

      for (const part of parts) {
        const servicePart = await ServicePartsUsed.create({
          service_request_id: serviceRequestId,
          product_id: part.product_id,
          quantity: part.quantity,
          unit_price: part.unit_price,
          total_price: part.quantity * part.unit_price
        }, { transaction });

        addedParts.push(servicePart);

        // Stok düşümü yapılacak (stok modülü ile entegrasyon)
        // Bu kısım stok modülü implement edildikten sonra eklenecek
      }

      // Parça ekleme aktivitesi kaydet
      await ServiceActivity.create({
        service_request_id: serviceRequestId,
        activity_type: 'parts_added',
        description: `${parts.length} adet parça eklendi`,
        technician_id: userId
      }, { transaction });

      await transaction.commit();

      return addedParts;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Servis geçmişi raporu
  static async getServiceHistoryReport(filters = {}) {
    const whereClause = {};

    if (filters.start_date && filters.end_date) {
      whereClause.created_at = {
        [Op.between]: [new Date(filters.start_date), new Date(filters.end_date)]
      };
    }

    if (filters.customer_id) {
      whereClause.customer_id = filters.customer_id;
    }

    if (filters.technician_id) {
      whereClause.assigned_technician_id = filters.technician_id;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    const serviceRequests = await ServiceRequest.findAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['customer_code', 'company_name']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['product_code', 'product_name']
        },
        {
          model: User,
          as: 'assignedTechnician',
          attributes: ['first_name', 'last_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Özet istatistikler
    const summary = {
      total_requests: serviceRequests.length,
      completed: serviceRequests.filter(sr => sr.status === 'completed').length,
      in_progress: serviceRequests.filter(sr => sr.status === 'in_progress').length,
      pending: serviceRequests.filter(sr => sr.status === 'pending').length,
      cancelled: serviceRequests.filter(sr => sr.status === 'cancelled').length,
      total_cost: serviceRequests.reduce((sum, sr) => sum + (sr.actual_cost || 0), 0),
      average_cost: serviceRequests.length > 0 ? 
        serviceRequests.reduce((sum, sr) => sum + (sr.actual_cost || 0), 0) / serviceRequests.length : 0
    };

    return {
      summary,
      service_requests: serviceRequests
    };
  }

  // Teknisyen performans raporu
  static async getTechnicianPerformanceReport(filters = {}) {
    const whereClause = {};

    if (filters.start_date && filters.end_date) {
      whereClause.created_at = {
        [Op.between]: [new Date(filters.start_date), new Date(filters.end_date)]
      };
    }

    if (filters.technician_id) {
      whereClause.assigned_technician_id = filters.technician_id;
    }

    const serviceRequests = await ServiceRequest.findAll({
      where: {
        ...whereClause,
        assigned_technician_id: { [Op.not]: null }
      },
      include: [
        {
          model: User,
          as: 'assignedTechnician',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    // Teknisyen bazında grupla
    const technicianStats = {};

    serviceRequests.forEach(sr => {
      const techId = sr.assigned_technician_id;
      const techName = `${sr.assignedTechnician.first_name} ${sr.assignedTechnician.last_name}`;

      if (!technicianStats[techId]) {
        technicianStats[techId] = {
          technician_id: techId,
          technician_name: techName,
          total_requests: 0,
          completed: 0,
          in_progress: 0,
          pending: 0,
          cancelled: 0,
          total_revenue: 0,
          average_completion_time: 0
        };
      }

      const stats = technicianStats[techId];
      stats.total_requests++;
      stats[sr.status]++;
      stats.total_revenue += sr.actual_cost || 0;

      // Tamamlanma süresi hesapla (gün cinsinden)
      if (sr.status === 'completed' && sr.started_at && sr.completed_at) {
        const completionTime = (new Date(sr.completed_at) - new Date(sr.started_at)) / (1000 * 60 * 60 * 24);
        stats.average_completion_time += completionTime;
      }
    });

    // Ortalama tamamlanma süresini hesapla
    Object.values(technicianStats).forEach(stats => {
      if (stats.completed > 0) {
        stats.average_completion_time = stats.average_completion_time / stats.completed;
      }
    });

    return Object.values(technicianStats);
  }
}

module.exports = ServiceService;