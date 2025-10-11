const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust path if needed

// 🔧 Change this to your MongoDB connection string
const MONGO_URI = "mongodb+srv://mbhavana:Mb67148@cluster.ifbjtdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    console.log(`Found ${users.length} users\n`);

    for (const user of users) {
      const password = user.password;

      // Quick check: bcrypt hashes always start with $2a$ or $2b$
      if (!password.startsWith("$2a$") && !password.startsWith("$2b$")) {
        console.log(`⚠️  User ${user.email} has a NON-HASHED password: ${password}`);
        continue;
      }

      // Try comparing the hash to a dummy string
      const isHashed = await bcrypt.compare("dummy", password);
      console.log(`✅ User ${user.email} has a hashed password`);
    }

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

run();
