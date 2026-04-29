const Task = require('../models/Task');
const Exam = require('../models/Exam');
const Attendance = require('../models/Attendance');
const FocusSession = require('../models/FocusSession');

exports.getRisks = async (req, res) => {
  try {
    const risks = [];
    const userId = req.user._id;

    // 1. Check Overdue Tasks
    const overdueTasks = await Task.countDocuments({
      userId,
      status: { $ne: 'completed' },
      deadline: { $lt: new Date() }
    });
    if (overdueTasks > 0) {
      risks.push({
        type: 'danger',
        title: 'Overdue Tasks',
        message: `You have ${overdueTasks} overdue task(s). Please address them immediately.`,
        actionLink: '/tasks'
      });
    }

    // 2. Check Attendance Risk
    const attendanceRecords = await Attendance.find({ userId });
    attendanceRecords.forEach(record => {
      if (record.percentage < record.minimumPercentage) {
        risks.push({
          type: 'danger',
          title: 'Low Attendance',
          message: `Attendance for ${record.subject} is at ${record.percentage}%, which is below the required ${record.minimumPercentage}%.`,
          actionLink: '/attendance'
        });
      } else if (record.percentage <= record.minimumPercentage + 5) {
        risks.push({
          type: 'warning',
          title: 'Attendance Warning',
          message: `Attendance for ${record.subject} is ${record.percentage}%, close to the danger zone.`,
          actionLink: '/attendance'
        });
      }
    });

    // 3. Check Upcoming Exams with low preparation
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingExams = await Exam.find({
      userId,
      examDate: { $gte: new Date(), $lte: nextWeek }
    });

    upcomingExams.forEach(exam => {
      if (exam.syllabusProgress < 50) {
        risks.push({
          type: 'danger',
          title: 'Exam Risk',
          message: `${exam.name} is within 7 days but syllabus completion is only ${exam.syllabusProgress}%.`,
          actionLink: '/exams'
        });
      }
    });

    // 4. Low Focus Time
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const focusSessions = await FocusSession.find({
      userId,
      startTime: { $gte: startOfWeek }
    });
    const weekFocusMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);
    if (weekFocusMinutes < 120 && new Date().getDay() > 3) { // If less than 2 hours by Thursday
      risks.push({
        type: 'warning',
        title: 'Low Focus Time',
        message: `You've only focused for ${Math.round(weekFocusMinutes/60)} hours this week. Try a Pomodoro session!`,
        actionLink: '/focus'
      });
    }

    res.status(200).json({ success: true, data: risks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
