const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
} = require('../controllers/comments');

// Validation rules
const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
];

router.get('/comments',auth, getComments);
router.post('/comments', auth, commentValidation, createComment);
router.put('/comments/:id', auth, commentValidation, updateComment);
router.delete('/comments/:id', auth, deleteComment);
router.post('/comments/:id/like', auth, likeComment);
router.post('/comments/:id/dislike', auth, dislikeComment);
module.exports = router;