const StudyGroup = require('../models/StudyGroup');
const crypto = require('crypto');

exports.getGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find({ 'members.userId': req.user._id }).populate('members.userId', 'name email avatar');
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const group = await StudyGroup.create({
      ...req.body,
      creatorId: req.user._id,
      inviteCode,
      members: [{ userId: req.user._id, role: 'admin' }]
    });
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const group = await StudyGroup.findOne({ inviteCode });
    if (!group) return res.status(404).json({ success: false, message: 'Invalid code' });

    if (group.members.some(m => m.userId.toString() === req.user._id.toString())) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    group.members.push({ userId: req.user._id, role: 'member' });
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.addSharedTask = async (req, res) => {
  try {
    const group = await StudyGroup.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) return res.status(404).json({ success: false, message: 'Not found' });

    group.sharedTasks.push(req.body);
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.completeSharedTask = async (req, res) => {
  try {
    const group = await StudyGroup.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) return res.status(404).json({ success: false, message: 'Not found' });

    const task = group.sharedTasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (!task.completedBy.includes(req.user._id)) {
      task.completedBy.push(req.user._id);
      await group.save();
    }
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
