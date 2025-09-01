const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: [true, 'Student ID is required'],
    trim: true
  },
  student_name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Student name cannot exceed 100 characters']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female'],
      message: 'Gender must be either male or female'
    },
    lowercase: true
  }
});

const memberSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Club reference is required']
  },
  class_std: {
    type: String,
    required: [true, 'Class standard is required'],
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true
  },
  students: {
    type: [studentSchema],
    validate: {
      validator: function(students) {
        // Check for duplicate student IDs within the same member document
        const studentIds = students.map(s => s.student_id);
        return new Set(studentIds).size === studentIds.length;
      },
      message: 'Duplicate student IDs are not allowed in the same club'
    }
  },
  total_male_count: {
    type: Number,
    default: 0,
    min: 0,
    max: 24
  },
  total_female_count: {
    type: Number,
    default: 0,
    min: 0,
    max: 24
  }
}, {
  timestamps: true
});

// Compound index to prevent same student in same club
memberSchema.index({ club: 1, 'students.student_id': 1 }, { unique: true });

// Index for better query performance
memberSchema.index({ club: 1 });
memberSchema.index({ club_name: 1 });
memberSchema.index({ class_std: 1, section: 1 });

// Pre-save middleware to update gender counts
memberSchema.pre('save', function(next) {
  if (this.isModified('students')) {
    this.total_male_count = this.students.filter(s => s.gender === 'male').length;
    this.total_female_count = this.students.filter(s => s.gender === 'female').length;
  }
  next();
});

// Static method to check gender quotas
memberSchema.statics.checkGenderQuota = async function(clubId, newStudents = []) {
  const existingMembers = await this.find({ club: clubId });
  
  let totalMale = 0;
  let totalFemale = 0;

  // Count existing students in this specific club
  existingMembers.forEach(member => {
    totalMale += member.total_male_count;
    totalFemale += member.total_female_count;
  });

  // Count new students
  const newMale = newStudents.filter(s => s.gender === 'male').length;
  const newFemale = newStudents.filter(s => s.gender === 'female').length;

  if (totalMale + newMale > 24) {
    throw new Error(`Club cannot have more than 24 male students. Current: ${totalMale}, Attempting to add: ${newMale}`);
  }

  if (totalFemale + newFemale > 24) {
    throw new Error(`Club cannot have more than 24 female students. Current: ${totalFemale}, Attempting to add: ${newFemale}`);
  }

  return { totalMale, totalFemale, newMale, newFemale };
};

// Method to check if student already exists in the SAME club
memberSchema.statics.checkStudentInSameClub = async function(clubId, studentId) {
  const existingStudent = await this.findOne({
    club: clubId,
    'students.student_id': studentId
  });
  return !!existingStudent;
};

// Method to check if student exists in ANY club (for reference)
memberSchema.statics.checkStudentInAnyClub = async function(studentId) {
  const existingStudent = await this.findOne({
    'students.student_id': studentId
  });
  return !!existingStudent;
};

module.exports = mongoose.model('Member', memberSchema);