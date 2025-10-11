const MedicalRecord = require('../models/MedicalRecord');
const { upload } = require('../services/fileUploadService');

const listMedicalRecords = async (req, res) => {
  const { sort, limit } = req.query;
  
  // Validate and default the limit parameter
  const queryLimit = parseInt(limit, 10);
  const validLimit = !isNaN(queryLimit) ? queryLimit : 100;

  try {
    const records = await MedicalRecord.find({}).sort(sort).limit(validLimit);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical records', error });
  }
};

const filterMedicalRecords = async (req, res) => {
  const { filters, sort } = req.body;
  const records = await MedicalRecord.find(filters).sort(sort);
  res.json(records);
};

const createMedicalRecord = async (req, res) => {
  const record = new MedicalRecord(req.body);
  await record.save();
  res.status(201).json(record);
};

const uploadMedicalFile = (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const file_url = `/uploads/${req.file.filename}`;
    res.json({ file_url });
  });
};

const updateMedicalRecord = async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id);
  if (record) {
    Object.assign(record, req.body);
    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } else {
    res.status(404).json({ message: 'Medical record not found' });
  }
};

module.exports = { listMedicalRecords, filterMedicalRecords, createMedicalRecord, uploadMedicalFile, updateMedicalRecord };