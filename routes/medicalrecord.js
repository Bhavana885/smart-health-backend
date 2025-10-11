const express = require('express');
const { listMedicalRecords, filterMedicalRecords, createMedicalRecord, uploadMedicalFile, updateMedicalRecord } = require('../controllers/medicalRecordController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, listMedicalRecords);
router.post('/filter', protect, filterMedicalRecords);
router.post('/', protect, createMedicalRecord);
router.post('/upload', protect, uploadMedicalFile);
router.put('/:id', protect, updateMedicalRecord);

module.exports = router;