const mongoose = require('mongoose');

const routineBlockSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Block title is required'],
      trim: true,
      maxlength: [80, 'Title cannot exceed 80 characters'],
    },
    type: {
      type: String,
      enum: ['class', 'study', 'break', 'exercise', 'meal', 'sleep', 'other'],
      default: 'study',
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0, // Sunday
      max: 6, // Saturday
    },
    startTime: {
      type: String, // "HH:MM" format (24h)
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    subject: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

routineBlockSchema.index({ userId: 1, dayOfWeek: 1 });

module.exports = mongoose.model('RoutineBlock', routineBlockSchema);
