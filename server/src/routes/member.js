const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getClubStats,
  checkStudentEligibility
} = require('../controllers/member');

router.get('/members', auth, getMembers);
router.get('/members/stats/:clubId', auth, getClubStats);
router.get('/members/check-student/:clubId/:studentId', auth, checkStudentEligibility);
router.get('/members/:id', auth, getMember);
router.post('/members', auth, createMember);
router.put('/members/:id', auth, updateMember);
router.delete('/members/:id', auth, deleteMember);

module.exports = router;
