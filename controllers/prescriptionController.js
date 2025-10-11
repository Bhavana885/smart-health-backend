const Prescription = require('../models/Prescription');

const listPrescriptions = async (req, res) => {
  const { sort, limit } = req.query;
  
  // Validate and default the limit parameter
  const queryLimit = parseInt(limit, 10);
  const validLimit = !isNaN(queryLimit) ? queryLimit : 100;

  try {
    const prescriptions = await Prescription.find({}).sort(sort).limit(validLimit);
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error });
  }
};

const filterPrescriptions = async (req, res) => {
  const { filters, sort } = req.body;
  const prescriptions = await Prescription.find(filters).sort(sort);
  res.json(prescriptions);
};

const createPrescription = async (req, res) => {
  const prescription = new Prescription(req.body);
  await prescription.save();
  res.status(201).json(prescription);
};

const updatePrescription = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);
  if (prescription) {
    Object.assign(prescription, req.body);
    const updatedPrescription = await prescription.save();
    res.json(updatedPrescription);
  } else {
    res.status(404).json({ message: 'Prescription not found' });
  }
};

module.exports = { listPrescriptions, filterPrescriptions, createPrescription, updatePrescription };