const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
    maxlength: [100, 'Club name cannot exceed 100 characters'],
    unique: true
  }
}, {
  timestamps: true
});

// Index for better performance on name queries
clubSchema.index({ name: 1 });

module.exports = mongoose.model('Club', clubSchema);