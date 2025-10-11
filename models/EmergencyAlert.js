const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  emergency_type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'responded', 'resolved'],
    default: 'active',
  },
  responding_doctor: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);