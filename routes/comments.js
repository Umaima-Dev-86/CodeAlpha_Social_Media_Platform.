// ===== routes/comments.js =====
// Comment routes: Add and Get comments on posts

const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// ─── GET /api/comments/:postId ────────────────────────────────────────────────
// Get all comments for a specific post
router.get('/:postId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name username avatar')
      .sort({ createdAt: 1 }); // Oldest first

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── POST /api/comments/:postId ───────────────────────────────────────────────
// Add a comment to a post
router.post('/:postId', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    // Check if the post exists
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const comment = await Comment.create({
      post: req.params.postId,
      user: req.user._id,
      text: text.trim(),
    });

    await comment.populate('user', 'name username avatar');

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── DELETE /api/comments/:id ─────────────────────────────────────────────────
// Delete a comment (only the comment owner can delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment.' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
