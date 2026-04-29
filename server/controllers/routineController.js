const RoutineBlock = require('../models/RoutineBlock');

/**
 * @desc    Get all routine blocks for a user (optionally filtered by day)
 * @route   GET /api/routine
 * @access  Private
 */
exports.getRoutineBlocks = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.day !== undefined) filter.dayOfWeek = parseInt(req.query.day);

    const blocks = await RoutineBlock.find(filter).sort({ dayOfWeek: 1, startTime: 1 });
    res.status(200).json({ success: true, count: blocks.length, data: blocks });
  } catch (error) {
    console.error('Get Routine Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching routine' });
  }
};

/**
 * @desc    Create a new routine block
 * @route   POST /api/routine
 * @access  Private
 */
exports.createRoutineBlock = async (req, res) => {
  try {
    const block = await RoutineBlock.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: 'Routine block created', data: block });
  } catch (error) {
    console.error('Create Routine Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating routine block' });
  }
};

/**
 * @desc    Update a routine block
 * @route   PUT /api/routine/:id
 * @access  Private
 */
exports.updateRoutineBlock = async (req, res) => {
  try {
    const block = await RoutineBlock.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!block) return res.status(404).json({ success: false, message: 'Routine block not found' });
    res.status(200).json({ success: true, message: 'Routine block updated', data: block });
  } catch (error) {
    console.error('Update Routine Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating routine block' });
  }
};

/**
 * @desc    Delete a routine block
 * @route   DELETE /api/routine/:id
 * @access  Private
 */
exports.deleteRoutineBlock = async (req, res) => {
  try {
    const block = await RoutineBlock.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!block) return res.status(404).json({ success: false, message: 'Routine block not found' });
    res.status(200).json({ success: true, message: 'Routine block deleted' });
  } catch (error) {
    console.error('Delete Routine Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting routine block' });
  }
};

/**
 * @desc    Toggle completion status of a routine block
 * @route   PATCH /api/routine/:id/toggle
 * @access  Private
 */
exports.toggleRoutineBlock = async (req, res) => {
  try {
    const block = await RoutineBlock.findOne({ _id: req.params.id, userId: req.user._id });
    if (!block) return res.status(404).json({ success: false, message: 'Routine block not found' });

    block.completed = !block.completed;
    await block.save();
    res.status(200).json({ success: true, data: block });
  } catch (error) {
    console.error('Toggle Routine Error:', error);
    res.status(500).json({ success: false, message: 'Server error toggling routine block' });
  }
};

/**
 * @desc    Get daily completion score
 * @route   GET /api/routine/score
 * @access  Private
 */
exports.getDailyScore = async (req, res) => {
  try {
    const today = new Date().getDay(); // 0=Sun ... 6=Sat
    const blocks = await RoutineBlock.find({ userId: req.user._id, dayOfWeek: today });
    const total = blocks.length;
    const completed = blocks.filter((b) => b.completed).length;
    const score = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: { total, completed, score, dayOfWeek: today },
    });
  } catch (error) {
    console.error('Daily Score Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching daily score' });
  }
};
