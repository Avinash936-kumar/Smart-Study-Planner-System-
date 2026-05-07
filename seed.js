/**
 * Seed script — Creates a demo user with sample tasks
 * Run: node seed.js
 */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Task = require('./models/Task');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Task.deleteMany({});
        console.log('🧹 Cleared existing data');

        // Create demo user (password is auto-hashed by User model pre-save hook)
        const user = await User.create({
            name: 'Avinash Kumar',
            email: 'demo@studyplanner.com',
            password: 'password123',
            bio: 'Computer Science Student at LPU',
        });
        console.log(`👤 Created user: ${user.email}`);

        // Create sample tasks
        const now = new Date();
        const tasks = [
            {
                userId: user._id,
                title: 'Complete Data Structures Assignment',
                subject: 'Data Structures',
                description: 'Implement binary search tree with all operations',
                deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
                priority: 'high',
                status: 'in-progress',
                estimatedHours: 3,
            },
            {
                userId: user._id,
                title: 'Database Management Lab Report',
                subject: 'DBMS',
                description: 'Write lab report for normalization experiment',
                deadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
                priority: 'high',
                status: 'pending',
                estimatedHours: 2,
            },
            {
                userId: user._id,
                title: 'Read Chapter 5 - Operating Systems',
                subject: 'Operating Systems',
                description: 'Process scheduling algorithms and deadlocks',
                deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
                priority: 'medium',
                status: 'pending',
                estimatedHours: 1.5,
            },
            {
                userId: user._id,
                title: 'Web Development Project Milestone 2',
                subject: 'Web Development',
                description: 'Complete React frontend with API integration',
                deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
                priority: 'high',
                status: 'in-progress',
                estimatedHours: 4,
            },
            {
                userId: user._id,
                title: 'Machine Learning Quiz Prep',
                subject: 'Machine Learning',
                description: 'Review regression, classification, and clustering',
                deadline: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
                priority: 'medium',
                status: 'pending',
                estimatedHours: 2,
            },
            {
                userId: user._id,
                title: 'Computer Networks Lab Viva',
                subject: 'Computer Networks',
                description: 'Prepare for lab viva on TCP/IP and OSI model',
                deadline: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
                priority: 'low',
                status: 'pending',
                estimatedHours: 1,
            },
            {
                userId: user._id,
                title: 'Python Practice Problems',
                subject: 'Programming',
                description: 'Solve 10 problems on LeetCode',
                deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                priority: 'low',
                status: 'pending',
                estimatedHours: 2,
            },
            {
                userId: user._id,
                title: 'Software Engineering Presentation',
                subject: 'Software Engineering',
                description: 'Prepare slides for SDLC presentation',
                deadline: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                priority: 'high',
                status: 'completed',
                estimatedHours: 3,
            },
            {
                userId: user._id,
                title: 'Math Assignment - Linear Algebra',
                subject: 'Mathematics',
                description: 'Solve exercises from Chapter 4: Eigenvalues',
                deadline: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
                priority: 'medium',
                status: 'completed',
                estimatedHours: 2,
            },
            {
                userId: user._id,
                title: 'English Communication Essay',
                subject: 'English',
                description: 'Write 1000-word essay on technology in education',
                deadline: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
                priority: 'low',
                status: 'completed',
                estimatedHours: 1.5,
            },
        ];

        await Task.insertMany(tasks);
        console.log(`📝 Created ${tasks.length} sample tasks`);

        // Sample Subjects
        const Subject = require('./models/Subject');
        const subjects = await Subject.insertMany([
          { userId: user._id, name: 'Operating Systems', color: '#3b82f6', targetHours: 40, completedHours: 10 },
          { userId: user._id, name: 'Database Management', color: '#10b981', targetHours: 35, completedHours: 15 },
          { userId: user._id, name: 'Computer Networks', color: '#f59e0b', targetHours: 30, completedHours: 5 }
        ]);
        console.log('📚 Created sample subjects');

        // Sample Attendance
        await require('./models/Attendance').insertMany([
          { userId: user._id, subject: 'Operating Systems', totalClasses: 20, attendedClasses: 18, minimumPercentage: 75 },
          { userId: user._id, subject: 'Database Management', totalClasses: 22, attendedClasses: 15, minimumPercentage: 75 },
          { userId: user._id, subject: 'Computer Networks', totalClasses: 18, attendedClasses: 12, minimumPercentage: 75 }
        ]);
        console.log('✅ Created sample attendance');

        // Sample Syllabus
        await require('./models/Syllabus').insertMany([
          { 
            userId: user._id, subject: 'Operating Systems',
            units: [
              { unitName: 'Unit 1: Introduction', topics: [{ title: 'OS Basics', completed: true }, { title: 'System Calls', completed: false }] },
              { unitName: 'Unit 2: Process Management', topics: [{ title: 'Process Scheduling', completed: false }, { title: 'Deadlocks', completed: false }] }
            ]
          }
        ]);
        console.log('📄 Created sample syllabus');

        // Sample Budget
        await require('./models/Budget').insertMany([
          {
            userId: user._id, month: new Date().toISOString().slice(0, 7), monthlyLimit: 5000,
            expenses: [
              { amount: 150, description: 'Lunch at Canteen', category: 'food' },
              { amount: 500, description: 'OS Textbook', category: 'books' }
            ]
          }
        ]);
        console.log('💰 Created sample budget');

        // Sample Revisions
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 3);
        await require('./models/Revision').insertMany([
          { userId: user._id, topic: 'Normal Forms (1NF, 2NF, 3NF)', subject: 'Database Management', nextRevisionDate: nextWeek, intervalDays: 3 },
          { userId: user._id, topic: 'Page Replacement Algorithms', subject: 'Operating Systems', nextRevisionDate: new Date(), intervalDays: 1 } // Due today
        ]);
        console.log('⏳ Created sample revisions');

        console.log('\n✅ Seed data created successfully!');
        console.log('📧 Demo Login: demo@studyplanner.com / password123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
