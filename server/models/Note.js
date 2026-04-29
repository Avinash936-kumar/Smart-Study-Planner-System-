const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      default: '',
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
    subject: {
      type: String,
      default: '',
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    linkedTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    linkedExamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });
noteSchema.index({ userId: 1, subject: 1 });

module.exports = mongoose.model('Note', noteSchema);
