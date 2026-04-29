const Exam = require('../models/Exam');

/**
 * @desc    Get all exams for a user
 * @route   GET /api/exams
 * @access  Private
 */
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.user._id }).sort({ examDate: 1 });

    // Enrich with computed fields
    const enriched = exams.map((exam) => {
      const now = new Date();
      const examDate = new Date(exam.examDate);
      const daysLeft = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
      const totalTopics = exam.syllabus.length;
      const completedTopics = exam.syllabus.filter((t) => t.completed).length;
      const syllabusProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      return {
        ...exam.toObject(),
        daysLeft,
        syllabusProgress,
        completedTopics,
        totalTopics,
        isUrgent: daysLeft <= 7 && daysLeft > 0,
        isPast: daysLeft < 0,
      };
    });

    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    console.error('Get Exams Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching exams' });
  }
};

/**
 * @desc    Create a new exam
 * @route   POST /api/exams
 * @access  Private
 */
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: 'Exam created successfully', data: exam });
  } catch (error) {
    console.error('Create Exam Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating exam' });
  }
};

/**
 * @desc    Update an exam
 * @route   PUT /api/exams/:id
 * @access  Private
 */
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.status(200).json({ success: true, message: 'Exam updated', data: exam });
  } catch (error) {
    console.error('Update Exam Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating exam' });
  }
};

/**
 * @desc    Delete an exam
 * @route   DELETE /api/exams/:id
 * @access  Private
 */
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.status(200).json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    console.error('Delete Exam Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting exam' });
  }
};

/**
 * @desc    Generate revision plan for an exam
 * @route   POST /api/exams/:id/revision-plan
 * @access  Private
 */
exports.generateRevisionPlan = async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, userId: req.user._id });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    const now = new Date();
    const examDate = new Date(exam.examDate);
    const daysLeft = Math.max(Math.ceil((examDate - now) / (1000 * 60 * 60 * 24)), 1);
    const pendingTopics = exam.syllabus.filter((t) => !t.completed);

    if (pendingTopics.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'All topics completed! Focus on revision.',
        data: [],
      });
    }

    // Distribute topics across remaining days
    const topicsPerDay = Math.ceil(pendingTopics.length / daysLeft);
    const plan = [];
    for (let i = 0; i < daysLeft && pendingTopics.length > 0; i++) {
      const dayDate = new Date(now);
      dayDate.setDate(dayDate.getDate() + i);
      const dayTopics = pendingTopics.splice(0, topicsPerDay);
      plan.push({
        date: dayDate.toISOString().split('T')[0],
        day: dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        topics: dayTopics.map((t) => t.title),
        topicCount: dayTopics.length,
      });
    }

    res.status(200).json({
      success: true,
      message: `Revision plan: ${plan.length} days, ~${topicsPerDay} topics/day`,
      data: plan,
    });
  } catch (error) {
    console.error('Revision Plan Error:', error);
    res.status(500).json({ success: false, message: 'Server error generating revision plan' });
  }
};
