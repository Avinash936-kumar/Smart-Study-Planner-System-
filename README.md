# 🎓 Smart Study Planner v2 — "Student Life OS"

A premium, all-in-one productivity operating system designed for students. Built with the MERN stack (MongoDB, Express, React, Node), featuring a stunning Bento-grid dashboard, AI-powered scheduling, and academic lifestyle tracking.

![Dashboard Preview](https://via.placeholder.com/1200x600/6366f1/ffffff?text=Smart+Study+Planner+v2+Student+OS)

## 🌟 Key Features (v2)

### 📊 Premium Bento Dashboard
- **Active Focus Widget**: Your most important task, front and center.
- **Efficiency Pulse**: Real-time study efficiency visualization.
- **Quick Toolbox**: Instant access to your Timer, Exams, Revision, and Finance tools.
- **Academic Risk Alerts**: Smart notifications for attendance drops or upcoming high-priority exams.

### 🧠 Academic Intelligence
- **Spaced Repetition**: Revision system for long-term memory retention.
- **Syllabus Tracker**: Unit-by-unit breakdown of your courses.
- **Exam Readiness**: Preparation status tracking with automated syllabus progress.
- **Attendance Monitor**: Keep track of your class presence with minimum requirement alerts.

### 🛠️ Utilities & Tools
- **Budget Planner**: Track your monthly student expenses and limits.
- **Study Groups**: Create and manage groups with shared tasks.
- **Resource Vault**: Upload and categorize your study materials.
- **Focus Timer**: High-end Pomodoro timer with detailed productivity analytics.

---

## 🚀 Installation & Setup Guide

Share these steps with your friends to get the app running in minutes!

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local Community Server installed)

### 🛠️ Step-by-Step Installation

1. **Clone the Project**
   ```bash
   git clone https://github.com/Avinash936-kumar/Smart-Study-Planner-System-.git
   cd Smart-Study-Planner-System-
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # IMPORTANT: Create your environment file
   cp .env.example .env  # or manually copy .env.example to .env
   
   # Run this to get all the demo data (Tasks, Subjects, etc.)
   node seed.js 
   
   # Start the server
   npm run dev
   ```

3. **Frontend Setup**
   *Open a new terminal window*
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the App**
   - Open your browser and go to: **[http://localhost:5173](http://localhost:5173)**

---

## 📧 Demo Login (Use this to explore!)
Don't want to create a new account? Use our pre-filled demo account:
- **Email**: `demo@studyplanner.com`
- **Password**: `password123`

---

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion (Animations), Recharts (Analytics).
- **Backend**: Node.js, Express.js, JWT Authentication.
- **Database**: MongoDB (Mongoose).
- **Security**: Helmet, Rate Limiting, Mongo Sanitize.

---

## 🤝 Contributing
Feel free to fork this project, open issues, and submit pull requests to make the Student OS even better!

## 📝 License
This project is licensed under the MIT License.
