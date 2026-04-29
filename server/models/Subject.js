const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [60, 'Subject name cannot exceed 60 characters'],
    },
    color: {
      type: String,
      default: '#6366f1', // primary indigo
      match: [/^#([0-9A-Fa-f]{6})$/, 'Please enter a valid hex color'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    targetHours: {
      type: Number,
      default: 10,
      min: [1, 'Minimum target is 1 hour'],
      max: [500, 'Maximum target is 500 hours'],
    },
    icon: {
      type: String,
      default: '📚',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for user-specific queries
subjectSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
