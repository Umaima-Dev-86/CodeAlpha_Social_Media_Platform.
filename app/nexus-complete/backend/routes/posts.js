// ===== routes/posts.js =====
// Posts routes: Create, Read, Delete, Like/Unlike

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Follower = require('../models/Follower');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ─── GET /api/posts/feed ──────────────────────────────────────────────────────
// Get feed posts (from people the current user follows)
router.get('/feed', protect, async (req, res) => {
  try {
    // Get list of users the current user follows
    const followingDocs = await Follower.find({ follower: req.user._id });
    const followingIds = followingDocs.map(f => f.following);
    followingIds.push(req.user._id); // Include own posts

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user', 'name username avatar')
      .populate('commentCount')
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── GET /api/posts ───────────────────────────────────────────────────────────
// Get all posts (for Explore page)
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name username avatar')
      .populate('commentCount')
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── POST /api/posts ──────────────────────────────────────────────────────────
// Create a new post
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    if (!text && !image) {
      return res.status(400).json({ success: false, message: 'Post must have text or an image.' });
    }

    const post = await Post.create({ user: req.user._id, text, image });
    await post.populate('user', 'name username avatar');

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── DELETE /api/posts/:id ────────────────────────────────────────────────────
// Delete a post (only the owner can delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post.' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── PUT /api/posts/:id/like ──────────────────────────────────────────────────
// Like or Unlike a post (toggle)
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike: remove user from likes array
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Like: add user to likes array
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
