const EmergencyAlert = require('../models/EmergencyAlert');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

const listEmergencyAlerts = async (req, res) => {
  const { sort, limit } = req.query;

  // Use a default limit of 100 if 'limit' is undefined or not a number
  const queryLimit = parseInt(limit, 10);
  const validLimit = !isNaN(queryLimit) ? queryLimit : 100;

  try {
    const alerts = await EmergencyAlert.find({})
      .sort(sort)
      .limit(validLimit);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching emergency alerts', error });
  }
};

const filterEmergencyAlerts = async (req, res) => {
  const { filters, sort } = req.body;
  const alerts = await EmergencyAlert.find(filters).sort(sort);
  res.json(alerts);
};

const createEmergencyAlert = async (req, res) => {
  const alert = new EmergencyAlert(req.body);
  await alert.save();

  // Email notification logic from frontend code
  const doctors = await User.find({ role: "doctor", is_active: true });
  const patient = await User.findById(alert.patient_id);
  
  if (patient) {
    const emailPromises = doctors.map(doctor =>
      sendEmail({
        to: doctor.email,
        subject: "🚨 Emergency Alert - Immediate Attention Required",
        body: `EMERGENCY ALERT
Patient: ${patient.full_name}
Email: ${patient.email}
Phone: ${patient.phone}
Emergency Type: ${alert.emergency_type.replace(/_/g, ' ').toUpperCase()}
Description: ${alert.description}
Location: ${alert.location || 'Not provided'}
Time: ${new Date().toLocaleString()}
Please respond immediately if available to assist.`
      })
    );
    await Promise.all(emailPromises);
  }

  res.status(201).json(alert);
};

const updateEmergencyAlert = async (req, res) => {
  const alert = await EmergencyAlert.findById(req.params.id);
  if (alert) {
    Object.assign(alert, req.body);
    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } else {
    res.status(404).json({ message: 'Emergency alert not found' });
  }
};

module.exports = { listEmergencyAlerts, filterEmergencyAlerts, createEmergencyAlert, updateEmergencyAlert };