const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now }
});

const studyGroupSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: '', maxlength: 500 },
    inviteCode: { type: String, required: true, unique: true },
    members: [groupMemberSchema],
    sharedTasks: [{
      title: { type: String, required: true },
      deadline: { type: Date },
      completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }]
  },
  { timestamps: true }
);

studyGroupSchema.index({ "members.userId": 1 });

module.exports = mongoose.model('StudyGroup', studyGroupSchema);
