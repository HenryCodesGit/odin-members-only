// Set up mongoose connection
const mongoose = require("mongoose");

// Settings
mongoose.set("strictQuery", false);

//Run
async function connectDB(MONGODB_URI) { 
    await mongoose.connect(MONGODB_URI)
}

module.exports = connectDB;