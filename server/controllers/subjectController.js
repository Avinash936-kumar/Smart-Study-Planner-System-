const Subject = require('../models/Subject');
const Task = require('../models/Task');

/**
 * @desc    Get all subjects for a user
 * @route   GET /api/subjects
 * @access  Private
 */
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort({ name: 1 });

    // Enrich with task stats
    const enriched = await Promise.all(
      subjects.map(async (subject) => {
        const totalTasks = await Task.countDocuments({
          userId: req.user._id,
          subject: { $regex: new RegExp(`^${subject.name}$`, 'i') },
        });
        const completedTasks = await Task.countDocuments({
          userId: req.user._id,
          subject: { $regex: new RegExp(`^${subject.name}$`, 'i') },
          status: 'completed',
        });
        const totalHours = await Task.aggregate([
          {
            $match: {
              userId: req.user._id,
              subject: { $regex: new RegExp(`^${subject.name}$`, 'i') },
              status: 'completed',
            },
          },
          { $group: { _id: null, total: { $sum: '$estimatedHours' } } },
        ]);

        return {
          ...subject.toObject(),
          totalTasks,
          completedTasks,
          completedPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          currentHours: totalHours[0]?.total || 0,
        };
      })
    );

    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    console.error('Get Subjects Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching subjects' });
  }
};

/**
 * @desc    Create a new subject
 * @route   POST /api/subjects
 * @access  Private
 */
exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: 'Subject created successfully', data: subject });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Subject with this name already exists' });
    }
    console.error('Create Subject Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating subject' });
  }
};

/**
 * @desc    Update a subject
 * @route   PUT /api/subjects/:id
 * @access  Private
 */
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, message: 'Subject updated', data: subject });
  } catch (error) {
    console.error('Update Subject Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating subject' });
  }
};

/**
 * @desc    Delete a subject
 * @route   DELETE /api/subjects/:id
 * @access  Private
 */
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    console.error('Delete Subject Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting subject' });
  }
};
