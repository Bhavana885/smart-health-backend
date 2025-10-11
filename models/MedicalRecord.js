const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  record_type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  record_date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  file_url: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);