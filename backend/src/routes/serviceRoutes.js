const express = require('express');
const serviceModule = require('../modules/service');

const router = express.Router();

// Servis modülü route'larını kullan
router.use('/services', serviceModule);

module.exports = router;