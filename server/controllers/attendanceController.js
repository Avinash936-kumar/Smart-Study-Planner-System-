const Attendance = require('../models/Attendance');

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Subject already exists' });
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!attendance) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!attendance) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
