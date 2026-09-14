// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Directly target mongoose.connection which is fully populated instantly
    console.log(`[Database] MongoDB Connected: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;