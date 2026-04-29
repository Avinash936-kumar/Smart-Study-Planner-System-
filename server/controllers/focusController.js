const FocusSession = require('../models/FocusSession');

/**
 * @desc    Create a new focus session
 * @route   POST /api/focus
 * @access  Private
 */
exports.createFocusSession = async (req, res) => {
  try {
    const session = await FocusSession.create({
      ...req.body,
      userId: req.user._id,
      completedAt: new Date(),
    });
    res.status(201).json({ success: true, message: 'Focus session saved!', data: session });
  } catch (error) {
    console.error('Create Focus Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving focus session' });
  }
};

/**
 * @desc    Get all focus sessions for a user
 * @route   GET /api/focus
 * @access  Private
 */
exports.getFocusSessions = async (req, res) => {
  try {
    const sessions = await FocusSession.find({ userId: req.user._id })
      .sort({ completedAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    console.error('Get Focus Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching focus sessions' });
  }
};

/**
 * @desc    Get focus statistics
 * @route   GET /api/focus/stats
 * @access  Private
 */
exports.getFocusStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Today's focus
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const todaySessions = await FocusSession.aggregate([
      { $match: { userId, completedAt: { $gte: todayStart, $lte: todayEnd } } },
      { $group: { _id: null, totalMinutes: { $sum: '$duration' }, count: { $sum: 1 } } },
    ]);

    // This week's focus
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekSessions = await FocusSession.aggregate([
      { $match: { userId, completedAt: { $gte: weekStart } } },
      { $group: { _id: null, totalMinutes: { $sum: '$duration' }, count: { $sum: 1 } } },
    ]);

    // Weekly chart data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayData = await FocusSession.aggregate([
        { $match: { userId, completedAt: { $gte: dayStart, $lte: dayEnd } } },
        { $group: { _id: null, totalMinutes: { $sum: '$duration' } } },
      ]);

      weeklyData.push({
        day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dayStart.toISOString().split('T')[0],
        minutes: dayData[0]?.totalMinutes || 0,
      });
    }

    // Focus by subject
    const subjectData = await FocusSession.aggregate([
      { $match: { userId, subject: { $ne: '' } } },
      { $group: { _id: '$subject', totalMinutes: { $sum: '$duration' }, count: { $sum: 1 } } },
      { $sort: { totalMinutes: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        todayMinutes: todaySessions[0]?.totalMinutes || 0,
        todaySessions: todaySessions[0]?.count || 0,
        weekMinutes: weekSessions[0]?.totalMinutes || 0,
        weekSessions: weekSessions[0]?.count || 0,
        weeklyData,
        subjectData,
      },
    });
  } catch (error) {
    console.error('Focus Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching focus stats' });
  }
};
