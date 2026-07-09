// ===== models/Comment.js =====
// Comments Table — which comment came on which post, by whom

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',            // Reference to Posts table
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',            // Reference to Users table (who commented)
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      maxlength: [300, 'Comment cannot exceed 300 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,         // createdAt = when comment was made
  }
);

module.exports = mongoose.model('Comment', CommentSchema);
