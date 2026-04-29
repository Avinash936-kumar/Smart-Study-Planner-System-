/**
 * Seed script — Creates a demo user with sample tasks and V2 data
 * Run: node seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const User = require('./server/models/User');
const Task = require('./server/models/Task');
const Subject = require('./server/models/Subject');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Task.deleteMany({});
        await Subject.deleteMany({});
        await require('./server/models/Attendance').deleteMany({});
        await require('./server/models/Syllabus').deleteMany({});
        await require('./server/models/Revision').deleteMany({});
        await require('./server/models/Resource').deleteMany({});
        await require('./server/models/Budget').deleteMany({});
        
        console.log('🧹 Cleared existing data');

        // Create demo user
        const user = await User.create({
            name: 'Avinash Kumar',
            email: 'demo@studyplanner.com',
            password: 'password123',
            bio: 'Computer Science Student at LPU',
            xp: 1250,
            level: 3
        });
        console.log(`👤 Created user: ${user.email}`);

        const userId = user._id;
        const now = new Date();

        // Create sample tasks
        const tasks = [
            {
                userId,
                title: 'Complete Operating Systems Lab',
                subject: 'Operating Systems',
                description: 'Implement Bankers Algorithm in C',
                deadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
                priority: 'high',
                status: 'in-progress',
                estimatedHours: 3,
            },
            {
                userId,
                title: 'Database Management Quiz',
                subject: 'DBMS',
                description: 'Quiz on SQL Joins and Aggregates',
                deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
                priority: 'high',
                status: 'pending',
                estimatedHours: 1,
            }
        ];
        await Task.insertMany(tasks);
        console.log('📝 Created sample tasks');

        // Sample Subjects
        await Subject.insertMany([
            { userId, name: 'Operating Systems', color: '#3b82f6', targetHours: 40, completedHours: 10 },
            { userId, name: 'Database Management', color: '#10b981', targetHours: 35, completedHours: 15 },
            { userId, name: 'Computer Networks', color: '#f59e0b', targetHours: 30, completedHours: 5 }
        ]);
        console.log('📚 Created sample subjects');

        // Sample Attendance
        await require('./server/models/Attendance').insertMany([
            { userId, subject: 'Operating Systems', totalClasses: 20, attendedClasses: 18, minimumPercentage: 75 },
            { userId, subject: 'Database Management', totalClasses: 22, attendedClasses: 15, minimumPercentage: 75 },
            { userId, subject: 'Computer Networks', totalClasses: 18, attendedClasses: 12, minimumPercentage: 75 }
        ]);
        console.log('✅ Created sample attendance');

        // Sample Syllabus
        await require('./server/models/Syllabus').insertMany([
            { 
                userId, subject: 'Operating Systems',
                units: [
                    { unitName: 'Unit 1: Introduction', topics: [{ title: 'OS Basics', completed: true }, { title: 'System Calls', completed: false }] },
                    { unitName: 'Unit 2: Process Management', topics: [{ title: 'Process Scheduling', completed: false }, { title: 'Deadlocks', completed: false }] }
                ]
            }
        ]);
        console.log('📄 Created sample syllabus');

        // Sample Budget
        await require('./server/models/Budget').insertMany([
            {
                userId, month: new Date().toISOString().slice(0, 7), monthlyLimit: 5000,
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
        await require('./server/models/Revision').insertMany([
            { userId, topic: 'Normal Forms (1NF, 2NF, 3NF)', subject: 'Database Management', nextRevisionDate: nextWeek, intervalDays: 3 },
            { userId, topic: 'Page Replacement Algorithms', subject: 'Operating Systems', nextRevisionDate: new Date(), intervalDays: 1 }
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
