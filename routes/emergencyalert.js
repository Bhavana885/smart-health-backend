const express = require('express');
const { listEmergencyAlerts, filterEmergencyAlerts, createEmergencyAlert, updateEmergencyAlert } = require('../controllers/emergencyAlertController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, listEmergencyAlerts);
router.post('/filter', protect, filterEmergencyAlerts);
router.post('/', protect, createEmergencyAlert);
router.put('/:id', protect, updateEmergencyAlert);

module.exports = router;