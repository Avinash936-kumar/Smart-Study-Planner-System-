const mongoose = require('mongoose');

const syllabusTopicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
});

const examSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
      maxlength: [100, 'Exam name cannot exceed 100 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    examDate: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    syllabus: [syllabusTopicSchema],
    preparationStatus: {
      type: String,
      enum: ['not-started', 'in-progress', 'revision', 'ready'],
      default: 'not-started',
    },
    notes: {
      type: String,
      default: '',
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

examSchema.index({ userId: 1, examDate: 1 });

module.exports = mongoose.model('Exam', examSchema);
