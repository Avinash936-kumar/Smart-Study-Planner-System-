const { validationResult } = require('express-validator');
const Task = require('../models/Task');

/**
 * @desc    Get all tasks for a user (with filtering & sorting)
 * @route   GET /api/tasks
 * @access  Private
 */
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, search, sort, subject } = req.query;

    // Build query filter
    const filter = { userId: req.user._id };
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'deadline') sortOption = { deadline: 1 };
    if (sort === 'priority') {
      // Custom sort: high > medium > low
      sortOption = { priority: 1, deadline: 1 };
    }
    if (sort === 'title') sortOption = { title: 1 };

    const tasks = await Task.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
    });
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error('Get Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching task',
    });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const taskData = {
      ...req.body,
      userId: req.user._id,
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating task',
    });
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const wasCompleted = task.status === 'completed';
    const isCompleted = req.body.status === 'completed';

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Gamification Logic: Award XP if task is newly completed
    let xpAwarded = 0;
    let levelUp = false;
    let user = req.user;

    if (!wasCompleted && isCompleted) {
      // Base XP
      xpAwarded = 50;
      
      // Bonus XP for priority
      if (task.priority === 'high') xpAwarded += 30;
      if (task.priority === 'medium') xpAwarded += 15;

      user.xp += xpAwarded;

      // Level up formula: 500 XP per level
      const newLevel = Math.floor(user.xp / 500) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        levelUp = true;
      }

      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
      gamification: xpAwarded > 0 ? { xpAwarded, newTotalXp: user.xp, levelUp, newLevel: user.level } : null
    });
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating task',
    });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting task',
    });
  }
};

/**
 * @desc    Get task statistics for analytics
 * @route   GET /api/tasks/stats
 * @access  Private
 */
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Overall counts
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ userId, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ userId, status: 'in-progress' });

    // Priority breakdown
    const highPriority = await Task.countDocuments({ userId, priority: 'high', status: { $ne: 'completed' } });
    const mediumPriority = await Task.countDocuments({ userId, priority: 'medium', status: { $ne: 'completed' } });
    const lowPriority = await Task.countDocuments({ userId, priority: 'low', status: { $ne: 'completed' } });

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      userId,
      status: { $ne: 'completed' },
      deadline: { $lt: new Date() },
    });

    // Tasks completed this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const completedThisWeek = await Task.countDocuments({
      userId,
      status: 'completed',
      updatedAt: { $gte: startOfWeek },
    });

    // Weekly completion data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await Task.countDocuments({
        userId,
        status: 'completed',
        updatedAt: { $gte: dayStart, $lte: dayEnd },
      });

      weeklyData.push({
        day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dayStart.toISOString().split('T')[0],
        completed: count,
      });
    }

    // Subject breakdown
    const subjectStats = await Task.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$subject',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        completedThisWeek,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        priorityBreakdown: { high: highPriority, medium: mediumPriority, low: lowPriority },
        weeklyData,
        subjectStats,
      },
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
    });
  }
};

/**
 * @desc    Smart schedule — auto-prioritize and schedule tasks
 * @route   POST /api/tasks/schedule
 * @access  Private
 *
 * Algorithm:
 *  1. Get all pending/in-progress tasks
 *  2. Score each task based on deadline urgency + priority weight
 *  3. Distribute across available days, max ~4 hrs/day to avoid overload
 */
exports.smartSchedule = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user._id,
      status: { $ne: 'completed' },
    });

    if (tasks.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending tasks to schedule',
        data: [],
      });
    }

    const now = new Date();

    // Score tasks: higher score = should be done sooner
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const scoredTasks = tasks.map((task) => {
      const hoursUntilDeadline = Math.max(
        (new Date(task.deadline) - now) / (1000 * 60 * 60),
        1
      );
      const urgencyScore = 100 / hoursUntilDeadline; // More urgent = higher score
      const priorityScore = priorityWeight[task.priority] || 1;
      return {
        task,
        score: urgencyScore * priorityScore,
      };
    });

    // Sort by score descending (most urgent first)
    scoredTasks.sort((a, b) => b.score - a.score);

    // Get User preferences
    const maxHoursPerDay = req.user.dailyStudyTarget || 4;
    const preferredTime = req.user.preferredStudyTime || 'evening';
    
    // Determine start hour based on preference
    let startHour = 18; // Evening default
    if (preferredTime === 'morning') startHour = 8;
    if (preferredTime === 'afternoon') startHour = 13;
    if (preferredTime === 'night') startHour = 22;

    let currentDay = new Date();
    currentDay.setHours(startHour, 0, 0, 0); 
    if (currentDay < now) {
      currentDay.setDate(currentDay.getDate() + 1);
    }
    let hoursUsedToday = 0;

    const scheduledTasks = [];
    for (const { task } of scoredTasks) {
      const est = task.estimatedHours || 1;

      if (hoursUsedToday + est > maxHoursPerDay) {
        // Move to next day
        currentDay = new Date(currentDay);
        currentDay.setDate(currentDay.getDate() + 1);
        hoursUsedToday = 0;
      }

      task.scheduledDate = new Date(currentDay);
      task.status = task.status === 'pending' ? 'in-progress' : task.status;
      await task.save();

      hoursUsedToday += est;
      scheduledTasks.push(task);
    }

    res.status(200).json({
      success: true,
      message: `${scheduledTasks.length} tasks scheduled successfully`,
      data: scheduledTasks,
    });
  } catch (error) {
    console.error('Smart Schedule Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during scheduling',
    });
  }
};
