const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
});

const unitSchema = new mongoose.Schema({
  unitName: { type: String, required: true, trim: true },
  topics: [topicSchema],
});

const syllabusSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true, trim: true },
    units: [unitSchema],
  },
  { timestamps: true }
);

// Virtual for calculating completion percentage
syllabusSchema.virtual('completionPercentage').get(function () {
  let totalTopics = 0;
  let completedTopics = 0;

  this.units.forEach((unit) => {
    unit.topics.forEach((topic) => {
      totalTopics++;
      if (topic.completed) completedTopics++;
    });
  });

  if (totalTopics === 0) return 0;
  return Math.round((completedTopics / totalTopics) * 100);
});

syllabusSchema.set('toJSON', { virtuals: true });
syllabusSchema.set('toObject', { virtuals: true });

syllabusSchema.index({ userId: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Syllabus', syllabusSchema);
