const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  smartSchedule,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/tasks/stats  (must be before /:id)
router.get('/stats', getTaskStats);

// @route   POST /api/tasks/schedule
router.post('/schedule', smartSchedule);

// @route   PATCH /api/tasks/:id/status — quick status change
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/tasks/bulk-status — bulk status update
router.post('/bulk-status', async (req, res) => {
  try {
    const { taskIds, status } = req.body;
    if (!taskIds || !Array.isArray(taskIds) || !status) {
      return res.status(400).json({ success: false, message: 'taskIds array and status required' });
    }
    await Task.updateMany(
      { _id: { $in: taskIds }, userId: req.user._id },
      { status }
    );
    res.status(200).json({ success: true, message: `${taskIds.length} tasks updated` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/tasks/bulk-delete — bulk delete
router.post('/bulk-delete', async (req, res) => {
  try {
    const { taskIds } = req.body;
    if (!taskIds || !Array.isArray(taskIds)) {
      return res.status(400).json({ success: false, message: 'taskIds array required' });
    }
    await Task.deleteMany({ _id: { $in: taskIds }, userId: req.user._id });
    res.status(200).json({ success: true, message: `${taskIds.length} tasks deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/tasks
router.get('/', getTasks);

// @route   GET /api/tasks/:id
router.get('/:id', getTask);

// @route   POST /api/tasks
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('deadline').notEmpty().withMessage('Deadline is required'),
    body('priority')
      .optional()
      .isIn(['high', 'medium', 'low'])
      .withMessage('Priority must be high, medium, or low'),
  ],
  createTask
);

// @route   PUT /api/tasks/:id
router.put('/:id', updateTask);

// @route   DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
