const express = require("express");
const router = express.Router();
const { protect, doctorOrAdmin } = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");

// 📌 Create appointment (Patient books)
router.post("/", protect, async (req, res) => {
  try {
    const { date, time } = req.body;

    const appointment = await Appointment.create({
      patient: req.user._id,
      patientName: req.user.name,
      date,
      time,
      status: "pending",
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get all appointments (Doctor/Admin only)
router.get("/", protect, doctorOrAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("patient", "name email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Approve appointment
router.put("/:id/approve", protect, doctorOrAdmin, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "approved";
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Reject appointment
router.put("/:id/reject", protect, doctorOrAdmin, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "rejected";
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
