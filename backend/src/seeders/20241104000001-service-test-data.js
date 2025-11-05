'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Önce gerekli bağımlılıkların var olduğunu kontrol et
    const customers = await queryInterface.sequelize.query(
      'SELECT id FROM customers LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const products = await queryInterface.sequelize.query(
      'SELECT id FROM products LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (customers.length === 0 || products.length === 0 || users.length === 0) {
      console.log('Servis test verileri için gerekli bağımlılıklar bulunamadı. Seed atlanıyor.');
      return;
    }

    // Test servis talepleri
    const serviceRequests = [
      {
        request_number: 'SRV202411040001',
        customer_id: customers[0].id,
        product_id: products[0].id,
        issue_description: 'Ürün açılmıyor, güç düğmesi çalışmıyor. Müşteri ürünü düşürdüğünü belirtiyor.',
        status: 'completed',
        priority: 'high',
        assigned_technician_id: users[0].id,
        estimated_cost: 150.00,
        actual_cost: 125.50,
        started_at: new Date('2024-11-01T09:00:00Z'),
        completed_at: new Date('2024-11-01T15:30:00Z'),
        created_by: users[0].id,
        created_at: new Date('2024-11-01T08:30:00Z'),
        updated_at: new Date('2024-11-01T15:30:00Z')
      },
      {
        request_number: 'SRV202411040002',
        customer_id: customers[1].id,
        product_id: products[1].id,
        issue_description: 'Ekran titriyor ve bazen kapanıyor. Soğutma fanı çok gürültülü çalışıyor.',
        status: 'in_progress',
        priority: 'normal',
        assigned_technician_id: users[1].id,
        estimated_cost: 200.00,
        actual_cost: null,
        started_at: new Date('2024-11-02T10:00:00Z'),
        completed_at: null,
        created_by: users[0].id,
        created_at: new Date('2024-11-02T09:15:00Z'),
        updated_at: new Date('2024-11-02T10:00:00Z')
      },
      {
        request_number: 'SRV202411040003',
        customer_id: customers[2].id,
        product_id: products[2].id,
        issue_description: 'Yazılım güncellemesi sonrası cihaz yavaşladı. Bazı özellikler çalışmıyor.',
        status: 'pending',
        priority: 'low',
        assigned_technician_id: null,
        estimated_cost: 75.00,
        actual_cost: null,
        started_at: null,
        completed_at: null,
        created_by: users[0].id,
        created_at: new Date('2024-11-03T14:20:00Z'),
        updated_at: new Date('2024-11-03T14:20:00Z')
      },
      {
        request_number: 'SRV202411040004',
        customer_id: customers[0].id,
        product_id: null,
        issue_description: 'Genel bakım ve temizlik talebi. Yıllık bakım sözleşmesi kapsamında.',
        status: 'pending',
        priority: 'normal',
        assigned_technician_id: users[2].id,
        estimated_cost: 100.00,
        actual_cost: null,
        started_at: null,
        completed_at: null,
        created_by: users[0].id,
        created_at: new Date('2024-11-04T11:00:00Z'),
        updated_at: new Date('2024-11-04T11:00:00Z')
      },
      {
        request_number: 'SRV202411040005',
        customer_id: customers[1].id,
        product_id: products[0].id,
        issue_description: 'Garanti kapsamında değişim talebi. Ürün tekrar arızalandı.',
        status: 'cancelled',
        priority: 'urgent',
        assigned_technician_id: users[0].id,
        estimated_cost: 0.00,
        actual_cost: 0.00,
        started_at: new Date('2024-10-30T13:00:00Z'),
        completed_at: new Date('2024-10-30T13:30:00Z'),
        created_by: users[0].id,
        created_at: new Date('2024-10-30T12:45:00Z'),
        updated_at: new Date('2024-10-30T13:30:00Z')
      }
    ];

    await queryInterface.bulkInsert('service_requests', serviceRequests);

    // Oluşturulan servis taleplerinin ID'lerini al
    const createdRequests = await queryInterface.sequelize.query(
      'SELECT id, request_number FROM service_requests WHERE request_number LIKE \'SRV20241104%\'',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Servis aktiviteleri
    const serviceActivities = [];
    
    // İlk servis talebi için aktiviteler (tamamlanmış)
    const request1 = createdRequests.find(r => r.request_number === 'SRV202411040001');
    if (request1) {
      serviceActivities.push(
        {
          service_request_id: request1.id,
          activity_type: 'created',
          description: 'Servis talebi oluşturuldu',
          technician_id: users[0].id,
          created_at: new Date('2024-11-01T08:30:00Z')
        },
        {
          service_request_id: request1.id,
          activity_type: 'technician_assigned',
          description: 'Teknisyen atandı: Ahmet Yılmaz',
          technician_id: users[0].id,
          created_at: new Date('2024-11-01T08:45:00Z')
        },
        {
          service_request_id: request1.id,
          activity_type: 'diagnosis',
          description: 'Ürün incelendi. Güç kartında hasar tespit edildi.',
          duration_minutes: 45,
          cost: 25.00,
          technician_id: users[0].id,
          created_at: new Date('2024-11-01T09:45:00Z')
        },
        {
          service_request_id: request1.id,
          activity_type: 'part_replacement',
          description: 'Güç kartı değiştirildi. Test edildi.',
          duration_minutes: 180,
          cost: 75.00,
          technician_id: users[0].id,
          created_at: new Date('2024-11-01T13:00:00Z')
        },
        {
          service_request_id: request1.id,
          activity_type: 'testing',
          description: 'Final testler yapıldı. Ürün normal çalışıyor.',
          duration_minutes: 30,
          cost: 25.50,
          technician_id: users[0].id,
          created_at: new Date('2024-11-01T15:30:00Z')
        }
      );
    }

    // İkinci servis talebi için aktiviteler (devam eden)
    const request2 = createdRequests.find(r => r.request_number === 'SRV202411040002');
    if (request2) {
      serviceActivities.push(
        {
          service_request_id: request2.id,
          activity_type: 'created',
          description: 'Servis talebi oluşturuldu',
          technician_id: users[0].id,
          created_at: new Date('2024-11-02T09:15:00Z')
        },
        {
          service_request_id: request2.id,
          activity_type: 'technician_assigned',
          description: 'Teknisyen atandı: Mehmet Kaya',
          technician_id: users[0].id,
          created_at: new Date('2024-11-02T09:30:00Z')
        },
        {
          service_request_id: request2.id,
          activity_type: 'diagnosis',
          description: 'İlk inceleme yapıldı. Ekran kartı ve soğutma sistemi kontrol ediliyor.',
          duration_minutes: 60,
          cost: 30.00,
          technician_id: users[1].id,
          created_at: new Date('2024-11-02T11:00:00Z')
        }
      );
    }

    // Üçüncü servis talebi için aktivite (bekleyen)
    const request3 = createdRequests.find(r => r.request_number === 'SRV202411040003');
    if (request3) {
      serviceActivities.push(
        {
          service_request_id: request3.id,
          activity_type: 'created',
          description: 'Servis talebi oluşturuldu',
          technician_id: users[0].id,
          created_at: new Date('2024-11-03T14:20:00Z')
        }
      );
    }

    // Dördüncü servis talebi için aktiviteler
    const request4 = createdRequests.find(r => r.request_number === 'SRV202411040004');
    if (request4) {
      serviceActivities.push(
        {
          service_request_id: request4.id,
          activity_type: 'created',
          description: 'Servis talebi oluşturuldu',
          technician_id: users[0].id,
          created_at: new Date('2024-11-04T11:00:00Z')
        },
        {
          service_request_id: request4.id,
          activity_type: 'technician_assigned',
          description: 'Teknisyen atandı: Fatma Demir',
          technician_id: users[0].id,
          created_at: new Date('2024-11-04T11:15:00Z')
        }
      );
    }

    // Beşinci servis talebi için aktiviteler (iptal edilmiş)
    const request5 = createdRequests.find(r => r.request_number === 'SRV202411040005');
    if (request5) {
      serviceActivities.push(
        {
          service_request_id: request5.id,
          activity_type: 'created',
          description: 'Servis talebi oluşturuldu',
          technician_id: users[0].id,
          created_at: new Date('2024-10-30T12:45:00Z')
        },
        {
          service_request_id: request5.id,
          activity_type: 'status_change',
          description: 'Durum değiştirildi: pending → cancelled (Müşteri talebi üzerine iptal edildi)',
          technician_id: users[0].id,
          created_at: new Date('2024-10-30T13:30:00Z')
        }
      );
    }

    if (serviceActivities.length > 0) {
      await queryInterface.bulkInsert('service_activities', serviceActivities);
    }

    // Kullanılan parçalar (sadece tamamlanmış servis için)
    if (request1 && products.length > 0) {
      const servicePartsUsed = [
        {
          service_request_id: request1.id,
          product_id: products[0].id,
          quantity: 1,
          unit_price: 50.00,
          total_price: 50.00,
          created_at: new Date('2024-11-01T13:00:00Z')
        },
        {
          service_request_id: request1.id,
          product_id: products[1].id,
          quantity: 2,
          unit_price: 15.00,
          total_price: 30.00,
          created_at: new Date('2024-11-01T13:00:00Z')
        }
      ];

      await queryInterface.bulkInsert('service_parts_used', servicePartsUsed);
    }

    console.log('Servis modülü test verileri başarıyla eklendi.');
  },

  down: async (queryInterface, Sequelize) => {
    // Ters sırada sil (foreign key constraints nedeniyle)
    await queryInterface.bulkDelete('service_parts_used', {
      service_request_id: {
        [Sequelize.Op.in]: queryInterface.sequelize.literal(
          '(SELECT id FROM service_requests WHERE request_number LIKE \'SRV20241104%\')'
        )
      }
    });

    await queryInterface.bulkDelete('service_activities', {
      service_request_id: {
        [Sequelize.Op.in]: queryInterface.sequelize.literal(
          '(SELECT id FROM service_requests WHERE request_number LIKE \'SRV20241104%\')'
        )
      }
    });

    await queryInterface.bulkDelete('service_requests', {
      request_number: {
        [Sequelize.Op.like]: 'SRV20241104%'
      }
    });

    console.log('Servis modülü test verileri temizlendi.');
  }
};