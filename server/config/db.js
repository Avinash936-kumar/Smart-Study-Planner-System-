const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Helper to seed demo data for all models
const seedDemoData = async () => {
  try {
    const User = require('../models/User');
    const Task = require('../models/Task');
    const Subject = require('../models/Subject');
    const Goal = require('../models/Goal');
    const Exam = require('../models/Exam');
    const RoutineBlock = require('../models/RoutineBlock');
    const FocusSession = require('../models/FocusSession');
    const Note = require('../models/Note');

    const count = await User.countDocuments();
    if (count > 0) return;

    // Create demo user
    const user = await User.create({
      name: 'Avinash Kumar',
      email: 'demo@studyplanner.com',
      password: 'password123',
      bio: 'Computer Science Student at LPU',
      course: 'B.Tech Computer Science',
      semester: '6th Semester',
      dailyStudyTarget: 5,
      preferredStudyTime: 'evening',
    });

    const uid = user._id;
    const now = new Date();
    const day = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    // Subjects
    const subjects = await Subject.insertMany([
      { userId: uid, name: 'Data Structures', color: '#6366f1', targetHours: 40, icon: '🌳' },
      { userId: uid, name: 'DBMS', color: '#d946ef', targetHours: 30, icon: '🗃️' },
      { userId: uid, name: 'Operating Systems', color: '#f59e0b', targetHours: 35, icon: '⚙️' },
      { userId: uid, name: 'Web Development', color: '#10b981', targetHours: 50, icon: '🌐' },
      { userId: uid, name: 'Mathematics', color: '#ef4444', targetHours: 25, icon: '📐' },
    ]);

    // Tasks
    await Task.insertMany([
      { userId: uid, title: 'Complete DSA Assignment', subject: 'Data Structures', description: 'Implement binary search tree operations', deadline: day(2), priority: 'high', status: 'in-progress', estimatedHours: 3, tags: ['assignment', 'coding'] },
      { userId: uid, title: 'DBMS Lab Report', subject: 'DBMS', description: 'Write lab report for normalization', deadline: day(1), priority: 'high', status: 'pending', estimatedHours: 2, tags: ['lab'] },
      { userId: uid, title: 'OS Process Scheduling Notes', subject: 'Operating Systems', description: 'Study CPU scheduling algorithms', deadline: day(3), priority: 'medium', status: 'pending', estimatedHours: 2 },
      { userId: uid, title: 'React Portfolio Project', subject: 'Web Development', description: 'Build personal portfolio with React', deadline: day(7), priority: 'medium', status: 'in-progress', estimatedHours: 8, tags: ['project'] },
      { userId: uid, title: 'Linear Algebra Practice', subject: 'Mathematics', description: 'Solve eigenvalue problems', deadline: day(-1), priority: 'low', status: 'pending', estimatedHours: 1.5 },
      { userId: uid, title: 'Graph Algorithms Study', subject: 'Data Structures', description: 'BFS, DFS, Dijkstra implementations', deadline: day(5), priority: 'high', status: 'pending', estimatedHours: 4, tags: ['exam-prep'] },
      { userId: uid, title: 'SQL Queries Practice', subject: 'DBMS', deadline: day(4), priority: 'medium', status: 'completed', estimatedHours: 2 },
      { userId: uid, title: 'HTML/CSS Revision', subject: 'Web Development', deadline: day(-3), priority: 'low', status: 'completed', estimatedHours: 1 },
    ]);

    // Goals
    await Goal.insertMany([
      { userId: uid, title: 'Complete DSA Module', type: 'weekly', targetDate: day(7), progress: 40, linkedSubject: 'Data Structures', milestones: [{ title: 'Arrays & Strings', completed: true }, { title: 'Trees & Graphs', completed: false }, { title: 'Dynamic Programming', completed: false }] },
      { userId: uid, title: 'Finish DBMS Project', type: 'monthly', targetDate: day(21), progress: 20, linkedSubject: 'DBMS', milestones: [{ title: 'ER Diagram', completed: true }, { title: 'Schema Design', completed: false }, { title: 'Implementation', completed: false }] },
    ]);

    // Exams
    await Exam.insertMany([
      { userId: uid, name: 'DSA Mid-Term', subject: 'Data Structures', examDate: day(14), priority: 'high', preparationStatus: 'in-progress', syllabus: [{ title: 'Arrays', completed: true }, { title: 'Linked Lists', completed: true }, { title: 'Trees', completed: false }, { title: 'Graphs', completed: false }, { title: 'Sorting', completed: false }] },
      { userId: uid, name: 'DBMS End-Term', subject: 'DBMS', examDate: day(28), priority: 'medium', preparationStatus: 'not-started', syllabus: [{ title: 'ER Model', completed: false }, { title: 'Normalization', completed: false }, { title: 'SQL', completed: false }, { title: 'Transactions', completed: false }] },
    ]);

    // Routine Blocks (for today's day of week)
    const todayDay = now.getDay();
    await RoutineBlock.insertMany([
      { userId: uid, title: 'Morning Class', type: 'class', dayOfWeek: todayDay, startTime: '09:00', endTime: '10:30', color: '#6366f1', subject: 'Data Structures' },
      { userId: uid, title: 'Study Session', type: 'study', dayOfWeek: todayDay, startTime: '11:00', endTime: '13:00', color: '#10b981', subject: 'DBMS' },
      { userId: uid, title: 'Lunch Break', type: 'meal', dayOfWeek: todayDay, startTime: '13:00', endTime: '14:00', color: '#f59e0b' },
      { userId: uid, title: 'Lab Work', type: 'class', dayOfWeek: todayDay, startTime: '14:00', endTime: '16:00', color: '#d946ef', subject: 'Web Development' },
      { userId: uid, title: 'Self Study', type: 'study', dayOfWeek: todayDay, startTime: '18:00', endTime: '20:00', color: '#ef4444', subject: 'Operating Systems' },
    ]);

    // Focus Sessions
    await FocusSession.insertMany([
      { userId: uid, subject: 'Data Structures', duration: 25, type: 'pomodoro', completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
      { userId: uid, subject: 'DBMS', duration: 25, type: 'pomodoro', completedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000) },
      { userId: uid, subject: 'Data Structures', duration: 50, type: 'pomodoro', completedAt: day(-1) },
    ]);

    // Notes
    await Note.insertMany([
      { userId: uid, title: 'BST Implementation Notes', content: '## Binary Search Tree\n\n- Insert: O(log n)\n- Search: O(log n)\n- Delete: O(log n)\n\nRemember to handle edge cases for deletion with two children.', subject: 'Data Structures', isPinned: true, tags: ['important'] },
      { userId: uid, title: 'SQL Join Types', content: '### JOIN Types\n\n1. INNER JOIN\n2. LEFT JOIN\n3. RIGHT JOIN\n4. FULL OUTER JOIN\n5. CROSS JOIN', subject: 'DBMS', tags: ['reference'] },
    ]);

    console.log('✨ Demo data seeded successfully');
    console.log('📧 Login: demo@studyplanner.com / password123');
  } catch (error) {
    console.error('⚠️ Seeding error:', error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    // Optional: Seed data if empty
    await seedDemoData();
  } catch (error) {
    console.error(`❌ Local MongoDB Connection Error: ${error.message}`);
    console.log('💡 TIP: Make sure MongoDB is running locally on port 27017.');
    process.exit(1);
  }
};

module.exports = connectDB;
