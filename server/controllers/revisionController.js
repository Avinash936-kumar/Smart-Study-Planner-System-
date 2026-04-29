const Revision = require('../models/Revision');

exports.getRevisions = async (req, res) => {
  try {
    const revisions = await Revision.find({ userId: req.user._id }).sort({ nextRevisionDate: 1 });
    res.status(200).json({ success: true, data: revisions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createRevision = async (req, res) => {
  try {
    const revision = await Revision.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: revision });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateRevision = async (req, res) => {
  try {
    const revision = await Revision.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!revision) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: revision });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteRevision = async (req, res) => {
  try {
    const revision = await Revision.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!revision) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.logRevision = async (req, res) => {
  try {
    const { status } = req.body; // 'easy', 'medium', 'hard'
    const revision = await Revision.findOne({ _id: req.params.id, userId: req.user._id });
    if (!revision) return res.status(404).json({ success: false, message: 'Not found' });

    // Simple spaced repetition math
    let multiplier = 1;
    if (status === 'easy') multiplier = 2;
    if (status === 'medium') multiplier = 1.5;
    if (status === 'hard') multiplier = 1;

    revision.intervalDays = Math.max(1, Math.round(revision.intervalDays * multiplier));
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + revision.intervalDays);
    revision.nextRevisionDate = nextDate;
    
    revision.history.push({ status, date: new Date() });
    
    await revision.save();
    res.status(200).json({ success: true, data: revision });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
