const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use('/api', limiter);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Increased for base64 files
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Export Data Route
app.get('/api/export', require('./middleware/auth').protect, async (req, res) => {
  try {
    const data = {
      user: req.user,
      tasks: await require('./models/Task').find({ userId: req.user._id }),
      subjects: await require('./models/Subject').find({ userId: req.user._id }),
      attendance: await require('./models/Attendance').find({ userId: req.user._id }),
      budget: await require('./models/Budget').find({ userId: req.user._id })
    };
    res.setHeader('Content-disposition', 'attachment; filename=my-study-data.json');
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(data, null, 2), function (err) { res.end(); });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Export failed' });
  }
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const goalRoutes = require('./routes/goalRoutes');
const examRoutes = require('./routes/examRoutes');
const routineRoutes = require('./routes/routineRoutes');
const focusRoutes = require('./routes/focusRoutes');
const noteRoutes = require('./routes/noteRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const syllabusRoutes = require('./routes/syllabusRoutes');
const revisionRoutes = require('./routes/revisionRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const studyGroupRoutes = require('./routes/studyGroupRoutes');
const riskRoutes = require('./routes/riskRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/routine', routineRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/revisions', revisionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/groups', studyGroupRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Study Planner API is running 🚀' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
