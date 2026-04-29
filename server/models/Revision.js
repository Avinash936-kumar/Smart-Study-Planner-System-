const mongoose = require('mongoose');

const revisionHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
});

const revisionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    nextRevisionDate: { type: Date, required: true },
    intervalDays: { type: Number, default: 1 }, // Spaced repetition interval (e.g., 1, 3, 7, 15, 30)
    history: [revisionHistorySchema],
  },
  { timestamps: true }
);

revisionSchema.index({ userId: 1, nextRevisionDate: 1 });

module.exports = mongoose.model('Revision', revisionSchema);
