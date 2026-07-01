// ===== models/Follower.js =====
// Followers Table — who is following whom

const mongoose = require('mongoose');

const FollowerSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',            // The user who IS following someone
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',            // The user being followed
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Prevent duplicate follows (same pair can't follow twice) ─────────────────
FollowerSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Follower', FollowerSchema);
