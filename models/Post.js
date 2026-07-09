// ===== models/Post.js =====
// Posts Table — stores post content, who posted it, and when

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',            // Reference to Users table
      required: true,
    },
    text: {
      type: String,
      maxlength: [500, 'Post cannot exceed 500 characters'],
      default: '',
    },
    image: {
      type: String,           // URL/path to uploaded image
      default: '',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',          // Array of user IDs who liked this post
      }
    ],
  },
  {
    timestamps: true,         // createdAt = when post was made
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── VIRTUAL: Comment count (computed from Comment model) ────────────────────
PostSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

// ─── VALIDATION: Post must have text or image ────────────────────────────────
PostSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    this.invalidate('text', 'Post must have either text or an image');
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
