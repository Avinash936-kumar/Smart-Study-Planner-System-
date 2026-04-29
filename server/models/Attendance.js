const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: [true, 'Subject name is required'], trim: true },
    totalClasses: { type: Number, default: 0, min: 0 },
    attendedClasses: { type: Number, default: 0, min: 0 },
    minimumPercentage: { type: Number, default: 75, min: 0, max: 100 },
  },
  { timestamps: true }
);

// Virtual for calculating current percentage
attendanceSchema.virtual('percentage').get(function () {
  if (this.totalClasses === 0) return 100;
  return Math.round((this.attendedClasses / this.totalClasses) * 100);
});

attendanceSchema.set('toJSON', { virtuals: true });
attendanceSchema.set('toObject', { virtuals: true });

attendanceSchema.index({ userId: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
