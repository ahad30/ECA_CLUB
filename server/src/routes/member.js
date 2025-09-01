const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getClubStats,
  checkStudentEligibility
} = require('../controllers/member');

// GET /api/members - Get all members with optional filtering
router.get('/members', getMembers);

// GET /api/members/stats/:clubId - Get club statistics
router.get('/members/stats/:clubId', getClubStats);

// GET /api/members/check-student/:clubId/:studentId - Check student eligibility
router.get('/members/check-student/:clubId/:studentId', checkStudentEligibility);

// GET /api/members/:id - Get single member
router.get('/members/:id', getMember);

// POST /api/members - Create new member record
router.post('/members', createMember);

// PUT /api/members/:id - Update member record
router.put('/members/:id', updateMember);

// DELETE /api/members/:id - Delete member record
router.delete('/members/:id', deleteMember);

module.exports = router;