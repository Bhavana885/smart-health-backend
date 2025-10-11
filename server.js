const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

// Routes (all lowercase filenames)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/appointments", require("./routes/appointment"));
app.use("/api/users", require("./routes/user"));
app.use("/api/prescriptions", require("./routes/prescription"));
app.use("/api/medicalrecords", require("./routes/medicalrecord")); 
app.use("/api/emergencyalerts", require("./routes/emergencyalert"));
app.use("/api/payment", require("./routes/payment"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
