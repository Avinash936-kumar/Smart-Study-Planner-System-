const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
});

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    type: {
      type: String,
      enum: ['weekly', 'monthly'],
      default: 'weekly',
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required'],
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    linkedSubject: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    milestones: [milestoneSchema],
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, targetDate: 1 });

module.exports = mongoose.model('Goal', goalSchema);
