const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully!');
    return mongoose.connection; // Return the connection
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Re-throw the error to handle it in the main file
  }
};

// Remove the immediate function call: connectDatabase();
module.exports = connectDatabase; // Export the function instead of calling it