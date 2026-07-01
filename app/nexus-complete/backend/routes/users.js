// ===== routes/users.js =====
// User profile routes

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Follower = require('../models/Follower');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ─── GET /api/users ───────────────────────────────────────────────────────────
// Get all users (for Explore page)
router.get('/', protect, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { _id: { $ne: req.user._id } }; // Exclude current user

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── GET /api/users/:username ─────────────────────────────────────────────────
// Get a user's profile by username
router.get('/:username', protect, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const posts = await Post.find({ user: user._id })
      .populate('user', 'name username avatar')
      .sort({ createdAt: -1 });

    const followersCount = await Follower.countDocuments({ following: user._id });
    const followingCount = await Follower.countDocuments({ follower: user._id });
    const isFollowing = await Follower.findOne({ follower: req.user._id, following: user._id });

    res.json({
      success: true,
      user,
      posts,
      followersCount,
      followingCount,
      isFollowing: !!isFollowing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── PUT /api/users/profile/update ───────────────────────────────────────────
// Update logged-in user's profile
router.put('/profile/update', protect, upload.single('avatar'), async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;
    if (req.file) updates.avatar = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
