const express = require('express');
const ServiceController = require('./ServiceController');
const { authMiddleware, permissionMiddleware } = require('../../middleware/auth');
const {
  createServiceRequestValidation,
  updateServiceRequestValidation,
  updateStatusValidation,
  assignTechnicianValidation,
  addActivityValidation,
  addPartsValidation,
  idParamValidation,
  paginationValidation,
  reportFiltersValidation
} = require('./validations');

const router = express.Router();

// Servis talebi CRUD endpoints
router.get('/', 
  authMiddleware, 
  permissionMiddleware('service.list'),
  paginationValidation,
  ServiceController.getAllServiceRequests
);

router.get('/:id', 
  authMiddleware, 
  permissionMiddleware('service.view'),
  idParamValidation,
  ServiceController.getServiceRequestById
);

router.post('/', 
  authMiddleware, 
  permissionMiddleware('service.create'),
  createServiceRequestValidation,
  ServiceController.createServiceRequest
);

router.put('/:id', 
  authMiddleware, 
  permissionMiddleware('service.update'),
  updateServiceRequestValidation,
  ServiceController.updateServiceRequest
);

router.delete('/:id', 
  authMiddleware, 
  permissionMiddleware('service.delete'),
  idParamValidation,
  ServiceController.deleteServiceRequest
);

// Servis durumu güncelleme
router.patch('/:id/status', 
  authMiddleware, 
  permissionMiddleware('service.update_status'),
  updateStatusValidation,
  ServiceController.updateServiceStatus
);

// Teknisyen atama
router.patch('/:id/assign-technician', 
  authMiddleware, 
  permissionMiddleware('service.assign_technician'),
  assignTechnicianValidation,
  ServiceController.assignTechnician
);

// Servis aktiviteleri
router.get('/:id/activities', 
  authMiddleware, 
  permissionMiddleware('service.view'),
  idParamValidation,
  ServiceController.getServiceActivities
);

router.post('/:id/activities', 
  authMiddleware, 
  permissionMiddleware('service.add_activity'),
  addActivityValidation,
  ServiceController.addServiceActivity
);

// Kullanılan parçalar
router.get('/:id/parts', 
  authMiddleware, 
  permissionMiddleware('service.view'),
  idParamValidation,
  ServiceController.getServiceParts
);

router.post('/:id/parts', 
  authMiddleware, 
  permissionMiddleware('service.add_parts'),
  addPartsValidation,
  ServiceController.addServiceParts
);

// Raporlar
router.get('/reports/history', 
  authMiddleware, 
  permissionMiddleware('service.reports'),
  reportFiltersValidation,
  ServiceController.getServiceHistory
);

router.get('/reports/technician-performance', 
  authMiddleware, 
  permissionMiddleware('service.reports'),
  reportFiltersValidation,
  ServiceController.getTechnicianPerformance
);

module.exports = router;