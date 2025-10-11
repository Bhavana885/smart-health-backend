const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mbhavana:Mb67148@cluster.ifbjtdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster'


async function upsertUser(full_name, email, password, role = 'patient') {
  // Check if user already exists
  let user = await User.findOne({ email });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (user) {
    console.log(`⚠️ User with email ${email} already exists. Updating password and role...`);
    user.password = hashedPassword;
    user.role = role;
    user.full_name = full_name;
    await user.save();
    console.log(`✅ Updated existing user: ${email} (${role})`);
  } else {
    user = new User({ full_name, email, password: hashedPassword, role });
    await user.save();
    console.log(`✅ New user created: ${email} (${role})`);
  }
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Add your users here
    await upsertUser("Admin User", "admin1@domain.com", "Admin@123", "admin");
    await upsertUser("Doctor User", "doctor1@domain.com", "Doctor@123", "doctor");
    await upsertUser("Patient User", "patient1@domain.com", "Patient@123", "patient");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
    mongoose.connection.close();
  }
}

run();
