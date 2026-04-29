const Syllabus = require('../models/Syllabus');

exports.getSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: syllabus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: syllabus });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Subject already exists' });
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!syllabus) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: syllabus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!syllabus) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
