// ===== routes/follows.js =====
// Follow/Unfollow routes

const express = require('express');
const router = express.Router();
const Follower = require('../models/Follower');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ─── POST /api/follows/:userId ────────────────────────────────────────────────
// Follow or Unfollow a user (toggle)
router.post('/:userId', protect, async (req, res) => {
  try {
    const targetUserId = req.params.userId;

    // Can't follow yourself
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You can't follow yourself." });
    }

    // Check target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found.' });

    // Check if already following
    const existing = await Follower.findOne({
      follower: req.user._id,
      following: targetUserId,
    });

    if (existing) {
      // Unfollow
      await existing.deleteOne();
      const followersCount = await Follower.countDocuments({ following: targetUserId });
      return res.json({ success: true, following: false, followersCount });
    } else {
      // Follow
      await Follower.create({ follower: req.user._id, following: targetUserId });
      const followersCount = await Follower.countDocuments({ following: targetUserId });
      return res.json({ success: true, following: true, followersCount });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── GET /api/follows/:userId/followers ───────────────────────────────────────
// Get all followers of a user
router.get('/:userId/followers', protect, async (req, res) => {
  try {
    const followers = await Follower.find({ following: req.params.userId })
      .populate('follower', 'name username avatar bio');

    res.json({ success: true, followers: followers.map(f => f.follower) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── GET /api/follows/:userId/following ───────────────────────────────────────
// Get all users that a user is following
router.get('/:userId/following', protect, async (req, res) => {
  try {
    const following = await Follower.find({ follower: req.params.userId })
      .populate('following', 'name username avatar bio');

    res.json({ success: true, following: following.map(f => f.following) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── GET /api/follows/suggestions ────────────────────────────────────────────
// Get follow suggestions (users not yet followed)
router.get('/suggestions/list', protect, async (req, res) => {
  try {
    const alreadyFollowing = await Follower.find({ follower: req.user._id });
    const followingIds = alreadyFollowing.map(f => f.following);
    followingIds.push(req.user._id); // Exclude self too

    const suggestions = await User.find({ _id: { $nin: followingIds } })
      .select('name username avatar bio')
      .limit(5);

    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
