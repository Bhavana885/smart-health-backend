const express = require('express');
const { listPrescriptions, filterPrescriptions, createPrescription, updatePrescription } = require('../controllers/prescriptionController');
const { protect, doctorOrAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, listPrescriptions);
router.post('/filter', protect, filterPrescriptions);
router.post('/', protect, doctorOrAdmin, createPrescription);
router.put('/:id', protect, doctorOrAdmin, updatePrescription);

module.exports = router;