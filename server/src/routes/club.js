const express = require('express');
const router = express.Router();
const {
  getClubs,
  getClub,
  createClub,
  updateClub,
  deleteClub
} = require('../controllers/club');


router.get('/clubs', getClubs);
router.get('/clubs/:id', getClub);
router.post('/clubs', createClub);
router.put('/clubs/:id', updateClub);
router.delete('/clubs/:id', deleteClub);

module.exports = router;