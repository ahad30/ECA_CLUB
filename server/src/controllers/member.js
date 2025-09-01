const Member = require('../models/member');
const Club = require('../models/club');

// @desc    Get all members with optional filtering
// @route   GET /api/members
// @access  Public
const getMembers = async (req, res) => {
  try {
    const { club, class_std, section } = req.query;
    let filter = {};

    if (club) filter.club = club;
    if (class_std) filter.class_std = class_std;
    if (section) filter.section = section;

    const members = await Member.find(filter)
      .populate('club', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('club', 'name');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new member record
// @route   POST /api/members
// @access  Public
const createMember = async (req, res) => {
  try {
    const { club,  class_std, section, students } = req.body;

    // Validate required fields
    if (!club || !class_std || !section || !students) {
      return res.status(400).json({
        success: false, 
        message: 'All fields (club, class_std, section, students) are required'
      });
    }

    // Check if club exists
    const clubExists = await Club.findById(club);
    if (!clubExists) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Validate students array
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Students must be a non-empty array'
      });
    }

    // Check for duplicate student IDs in the request
    const studentIds = students.map(s => s.student_id);
    if (new Set(studentIds).size !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate student IDs in the request'
      });
    }

    // Check if any student already exists in the SAME club
    for (const student of students) {
      const studentExists = await Member.checkStudentInSameClub(club, student.student_id);
      if (studentExists) {
        return res.status(400).json({
          success: false,
          message: `Student ${student.student_id} already exists in this club`
        });
      }
    }

    // Check gender quotas
    await Member.checkGenderQuota(club, students);

    // Create member record
    const member = await Member.create({
      club,
      class_std,
      section,
      students
    });

    const populatedMember = await Member.findById(member._id).populate('club', 'name');

    res.status(201).json({
      success: true,
      message: 'Member record created successfully',
      data: populatedMember
    });
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error (same student in same club)
      return res.status(400).json({
        success: false,
        message: 'A student already exists in this club'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.name
    });
  }
};

// @desc    Update member record
// @route   PUT /api/members/:id
// @access  Public
const updateMember = async (req, res) => {
  try {
    const { students, ...updateData } = req.body;
    const memberId = req.params.id;

    const existingMember = await Member.findById(memberId);
    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: 'Member record not found'
      });
    }

    if (students) {
      // Check for duplicate student IDs in the request
      const studentIds = students.map(s => s.student_id);
      if (new Set(studentIds).size !== studentIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate student IDs in the request'
        });
      }

      // Check if any new student already exists in the SAME club
      const existingStudentIds = existingMember.students.map(s => s.student_id);
      const newStudents = students.filter(s => !existingStudentIds.includes(s.student_id));

      for (const student of newStudents) {
        const studentExists = await Member.checkStudentInSameClub(existingMember.club, student.student_id);
        if (studentExists) {
          return res.status(400).json({
            success: false,
            message: `Student ${student.student_id} already exists in this club`
          });
        }
      }

      // Check gender quotas (subtract existing counts first)
      const currentMale = existingMember.total_male_count;
      const currentFemale = existingMember.total_female_count;
      
      const tempMale = students.filter(s => s.gender === 'male').length;
      const tempFemale = students.filter(s => s.gender === 'female').length;
      
      const netMaleChange = tempMale - currentMale;
      const netFemaleChange = tempFemale - currentFemale;

      if (netMaleChange > 0 || netFemaleChange > 0) {
        await Member.checkGenderQuota(existingMember.club, 
          netMaleChange > 0 ? Array(netMaleChange).fill({ gender: 'male' }) : [],
          netFemaleChange > 0 ? Array(netFemaleChange).fill({ gender: 'female' }) : []
        );
      }

      updateData.students = students;
    }

    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      updateData,
      { new: true, runValidators: true }
    ).populate('club', 'name');

    res.status(200).json({
      success: true,
      message: 'Member record updated successfully',
      data: updatedMember
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A student already exists in this club'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.name
    });
  }
};

// @desc    Delete member record
// @route   DELETE /api/members/:id
// @access  Public
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member record deleted successfully',
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get club statistics
// @route   GET /api/members/stats/:clubId
// @access  Public
const getClubStats = async (req, res) => {
  try {
    const { clubId } = req.params;

    const members = await Member.find({ club: clubId });
    
    let totalMale = 0;
    let totalFemale = 0;
    let totalStudents = 0;
    const classDistribution = {};

    members.forEach(member => {
      totalMale += member.total_male_count;
      totalFemale += member.total_female_count;
      totalStudents += member.students.length;

      const classKey = `${member.class_std}-${member.section}`;
      classDistribution[classKey] = (classDistribution[classKey] || 0) + member.students.length;
    });

    res.status(200).json({
      success: true,
      data: {
        total_members: members.length,
        total_students: totalStudents,
        total_male: totalMale,
        total_female: totalFemale,
        male_quota_remaining: Math.max(0, 24 - totalMale),
        female_quota_remaining: Math.max(0, 24 - totalFemale),
        class_distribution: classDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Check if student can join club
// @route   GET /api/members/check-student/:clubId/:studentId
// @access  Public
const checkStudentEligibility = async (req, res) => {
  try {
    const { clubId, studentId } = req.params;

    // Check if student already in this club
    const inSameClub = await Member.checkStudentInSameClub(clubId, studentId);
    
    // Check if student in any club (for information)
    const inAnyClub = await Member.checkStudentInAnyClub(studentId);

    res.status(200).json({
      success: true,
      data: {
        can_join: !inSameClub,
        in_same_club: inSameClub,
        in_any_club: inAnyClub,
        message: inSameClub 
          ? 'Student already exists in this club' 
          : 'Student can join this club'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getClubStats,
  checkStudentEligibility
};