const Goal = require('../models/Goal');

/**
 * @desc    Get all goals for a user
 * @route   GET /api/goals
 * @access  Private
 */
exports.getGoals = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = { userId: req.user._id };
    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.type = type;

    const goals = await Goal.find(filter).sort({ targetDate: 1 });
    res.status(200).json({ success: true, count: goals.length, data: goals });
  } catch (error) {
    console.error('Get Goals Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching goals' });
  }
};

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
exports.createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: 'Goal created successfully', data: goal });
  } catch (error) {
    console.error('Create Goal Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating goal' });
  }
};

/**
 * @desc    Update a goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.status(200).json({ success: true, message: 'Goal updated', data: goal });
  } catch (error) {
    console.error('Update Goal Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating goal' });
  }
};

/**
 * @desc    Delete a goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    console.error('Delete Goal Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting goal' });
  }
};
