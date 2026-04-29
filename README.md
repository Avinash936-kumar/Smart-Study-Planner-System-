# Smart Study Planner

A full-stack, production-ready MERN productivity application designed for students to manage their academic life.

![Dashboard Preview](https://via.placeholder.com/1200x600/6366f1/ffffff?text=Smart+Study+Planner+Dashboard)

## 🌟 Features

- **Smart Dashboard**: Comprehensive overview with real-time widgets, upcoming deadlines, and motivational quotes.
- **Task Management**: Advanced CRUD, priority levels, status tracking, and smart scheduling algorithm.
- **Subjects Tracker**: Organize courses, set study targets, and track completion progress.
- **Goal Setting**: Weekly and monthly goals with milestone tracking and progress bars.
- **Exam Planner**: Track exam dates, urgency levels, syllabus completion, and generate AI-driven revision plans.
- **Daily Routine**: Manage your daily schedule with visual timeline blocks for classes, study, and breaks.
- **Pomodoro Focus Timer**: Built-in 25/5 focus timer with session history, subject tracking, and productivity charts.
- **Notes System**: Create, search, and pin important study notes with markdown support.
- **Analytics Dashboard**: Deep insights into study patterns, completion trends, focus time, and subject priorities.
- **Profile & Settings**: Manage academic details, study preferences, dark mode, and account settings.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS 3, React Router DOM, Framer Motion, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose (with in-memory fallback)
- **Authentication**: JWT, bcryptjs

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "smart study"
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example
   npm run seed # (Optional) Seed the database with demo data
   npm run dev  # Starts backend on http://localhost:5000
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev  # Starts frontend on http://localhost:5173
   ```

## 📚 API Endpoints

- **Auth**: `/api/auth/register`, `/login`, `/profile`, `/account`
- **Tasks**: `/api/tasks`, `/api/tasks/stats`, `/api/tasks/schedule`, `/bulk-status`, `/bulk-delete`
- **Subjects**: `/api/subjects`
- **Goals**: `/api/goals`
- **Exams**: `/api/exams`, `/api/exams/:id/revision-plan`
- **Routine**: `/api/routine`, `/api/routine/score`
- **Focus**: `/api/focus`, `/api/focus/stats`
- **Notes**: `/api/notes`, `/api/notes/:id/pin`

## 🎨 UI/UX Design

The application features a modern SaaS aesthetic with:
- **Glassmorphism**: Translucent cards and panels.
- **Gradients**: Custom `primary` and `accent` gradient flows.
- **Animations**: Smooth page transitions and micro-interactions via Framer Motion.
- **Dark Mode**: Fully supported, accessible dark theme.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the MIT License.
