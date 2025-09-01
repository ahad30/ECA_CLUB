const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');

const populateComment = async (commentId) => {
  return await Comment.findById(commentId)
    .populate('author', 'username')
};

exports.getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'newest';
    
    const skip = (page - 1) * limit;
    
    let sortOptions = {};
    switch(sortBy) {
      case 'most-liked':
        sortOptions = { likes: -1, createdAt: -1 };
        break;
      case 'most-disliked':
        sortOptions = { dislikes: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }
    
    const comments = await Comment.find({ parentComment: null })
      .populate('author', 'username')
      .populate({
        path: 'replies',
        populate: [
          {
            path: 'author',
            select: 'username'
          },
          {
            path: 'replies',
            populate: {
              path: 'author',
              select: 'username'
            }
          }
        ]
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const totalComments = await Comment.countDocuments({ parentComment: null });
    
    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, parentCommentId } = req.body;
    
    const comment = new Comment({
      content,
      author: req.user._id,
      parentComment: parentCommentId || null
    });
    
    const savedComment = await comment.save();
    
    // If it's a reply, add it to the parent comment's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(
        parentCommentId,
        { $push: { replies: savedComment._id } }
      );
    }
    
    // Properly populate the comment with all nested replies
    const populatedComment = await populateComment(savedComment._id);
    
    // Get io instance from app and emit event
    const io = req.app.get('io');
    if (io) {
      io.emit('comment-added', populatedComment);
    }
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    comment.content = content;
    await comment.save();
    
    // Properly populate the comment with all nested replies
    const populatedComment = await populateComment(comment._id);
    
    // Get io instance from app and emit event
    const io = req.app.get('io');
    if (io) {
      io.emit('comment-updated', populatedComment);
    }
    
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    
    if (comment.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Comment already liked' });
    }
    
   
    if (comment.dislikes.includes(req.user._id)) {
      comment.dislikes = comment.dislikes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    }
    
    comment.likes.push(req.user._id);
    await comment.save();
    
    const populatedComment = await populateComment(comment._id);
    
    const io = req.app.get('io');
    if (io) {
      io.emit('reaction-updated', populatedComment);
    }
    
    res.json({ message: 'Comment liked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.dislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    
    if (comment.dislikes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Comment already disliked' });
    }
    
   
    if (comment.likes.includes(req.user._id)) {
      comment.likes = comment.likes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    }
    
    comment.dislikes.push(req.user._id);
    await comment.save();
    
  
    const populatedComment = await populateComment(comment._id);
    
    const io = req.app.get('io');
    if (io) {
      io.emit('reaction-updated', populatedComment);
    }
    
    res.json({ message: 'Comment disliked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
  
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    


    await Comment.findByIdAndDelete(req.params.id);
    
  
    const io = req.app.get('io');
    if (io) {
      io.emit('comment-deleted', { _id: req.params.id });
    }
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

