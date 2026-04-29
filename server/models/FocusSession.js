const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    subject: {
      type: String,
      default: '',
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
      min: [1, 'Minimum duration is 1 minute'],
      max: [480, 'Maximum duration is 8 hours'],
    },
    type: {
      type: String,
      enum: ['pomodoro', 'custom'],
      default: 'pomodoro',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

focusSessionSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('FocusSession', focusSessionSchema);
