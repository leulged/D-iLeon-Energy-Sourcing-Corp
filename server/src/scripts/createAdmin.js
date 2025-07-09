const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User schema (simplified for script)
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "buyer", "seller", "analyst"],
      default: "buyer",
    },
    isEmailVerified: { type: Boolean, default: true }, // Set to true for admin
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@dileon.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("admin123456", salt);

    // Create admin user
    const adminUser = new User({
      email: "admin@dileon.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isEmailVerified: true,
      isActive: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    console.log("Email: admin@dileon.com");
    console.log("Password: admin123456");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
