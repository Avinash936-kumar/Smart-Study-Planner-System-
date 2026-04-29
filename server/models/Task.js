const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [50, 'Subject cannot exceed 50 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    estimatedHours: {
      type: Number,
      default: 1,
      min: [0.25, 'Minimum estimate is 15 minutes'],
      max: [24, 'Maximum estimate is 24 hours'],
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters'],
      },
    ],
    attachmentUrl: {
      type: String,
      default: '',
      trim: true,
    },
    reminderTime: {
      type: Date,
      default: null,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringInterval: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, deadline: 1 });
taskSchema.index({ userId: 1, priority: 1 });

module.exports = mongoose.model('Task', taskSchema);
