const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getClubs,
  getClub,
  createClub,
  updateClub,
  deleteClub
} = require('../controllers/club');

router.get('/clubs', auth, getClubs);
router.get('/clubs/:id', auth, getClub);
router.post('/clubs', auth, createClub);
router.put('/clubs/:id', auth, updateClub);
router.delete('/clubs/:id', auth, deleteClub);

module.exports = router;
