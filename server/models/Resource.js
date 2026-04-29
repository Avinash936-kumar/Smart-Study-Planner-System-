const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    subject: { type: String, default: '', trim: true },
    type: { type: String, enum: ['link', 'file'], required: true },
    data: { type: String, required: true }, // URL if type=link, Base64 string if type=file
    fileType: { type: String, default: '' }, // e.g., 'application/pdf', 'image/png'
    isPinned: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

resourceSchema.index({ userId: 1, isPinned: -1, createdAt: -1 });

module.exports = mongoose.model('Resource', resourceSchema);
