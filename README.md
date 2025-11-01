# 🏛️ Civic Participation App

A modern web application that empowers citizens to report civic issues, track their resolution, and engage with their local government. Built with React, FastAPI, and Supabase.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-009688?logo=fastapi)
![Supabase](https://img.shields.io/badge/Supabase-2.9.1-3ECF8E?logo=supabase)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Citizens
- 🔐 **Secure Authentication** - Sign up and login with email/password
- 📝 **Report Issues** - Submit civic issues with photos, descriptions, and location
- 🗂️ **Categorize Reports** - Organize issues by category (Infrastructure, Sanitation, Safety, etc.)
- 👍 **Vote & Engage** - Upvote/downvote issues to show community support
- 💬 **Comment & Discuss** - Add feedback and discuss issues with other citizens
- 📊 **Track Progress** - Monitor issue status (Pending, In Progress, Resolved)
- 🔔 **Notifications** - Get updates on your reported issues
- 📈 **Personal Dashboard** - View your activity stats and recent notifications
- 👤 **Profile Management** - Update your profile and view your contribution history

### For Administrators
- 📊 **Admin Dashboard** - Overview of all issues and statistics
- ✏️ **Issue Management** - Update issue status and respond to reports
- 📈 **Analytics** - View trends and metrics across all civic issues

### Technical Features
- 🎨 **Modern UI/UX** - Professional black & white theme with accent colors
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Live data synchronization with Supabase
- 🔄 **Optimistic Updates** - Instant UI feedback with React Query
- 🖼️ **Image Upload** - Store and display issue photos via Supabase Storage
- 🔒 **Row Level Security** - Database-level security with Supabase RLS policies
- ♿ **Accessibility** - WCAG compliant with keyboard navigation and ARIA labels

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI framework
- **Vite 7.1.7** - Build tool and dev server
- **React Router 7.9.5** - Client-side routing
- **TanStack Query 5.90.5** - Server state management and caching
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Framer Motion 12.23.24** - Animation library
- **Lucide React 0.552.0** - Icon library
- **React Hot Toast 2.6.0** - Toast notifications

### Backend
- **FastAPI 0.115.6** - Python web framework
- **Uvicorn 0.32.1** - ASGI server
- **Supabase 2.9.1** - Backend-as-a-Service (Auth, Database, Storage)
- **PostgreSQL** - Database (via Supabase)
- **PyJWT 2.8.0** - JWT authentication
- **Python-dotenv 1.0.1** - Environment variable management

### Testing
- **Pytest 7.4.3** - Python testing framework
- **Pytest-asyncio 0.21.1** - Async test support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **pip** - Comes with Python
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** - [Sign up](https://supabase.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ananyasethi1907/Civic-Participation-App.git
cd Civic-Participation-App
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd civic-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd ../Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret_key
```

### 4. Database Setup

Run the SQL migrations in your Supabase SQL Editor in order:

```bash
# Run migrations in order
1. Backend/migrations/001_initial_schema.sql
2. Backend/migrations/002_add_realtime.sql
3. Backend/migrations/003_add_rls_policies.sql
4. Backend/migrations/004_fix_rls_policies.sql
```

Or use the setup script:

```bash
python Backend/setup_db.py
```

## ⚙️ Configuration

### Supabase Setup

1. **Create a new project** at [supabase.com](https://supabase.com)
2. **Get your credentials** from Project Settings → API
3. **Enable Storage** and create a bucket named `issue_images`
4. **Set bucket to public** for image access
5. **Run database migrations** as described above

### Environment Variables

#### Frontend (.env.local)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
JWT_SECRET=your-secret-key-here
PORT=8000
```

## 🏃 Running the Application

### Development Mode

#### Start Frontend (Terminal 1)
```bash
cd civic-frontend
npm run dev
```
Frontend will run on: http://localhost:5173

#### Start Backend (Terminal 2)
```bash
cd Backend
# Activate venv first
python -m uvicorn main:app --reload
```
Backend will run on: http://localhost:8000

### Production Build

#### Build Frontend
```bash
cd civic-frontend
npm run build
npm run preview
```

#### Run Backend in Production
```bash
cd Backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📁 Project Structure

```
Civic-Participation-App/
├── civic-frontend/              # React frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/             # Images, fonts, etc.
│   │   ├── components/         # React components
│   │   │   ├── forms/         # Form components
│   │   │   ├── layout/        # Layout components (Navbar, Sidebar, Footer)
│   │   │   └── ui/            # Reusable UI components
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── QueryProvider.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Issues.jsx
│   │   │   ├── IssueDetail.jsx
│   │   │   ├── CreateIssue.jsx
│   │   │   ├── MyReports.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/          # API services
│   │   │   ├── api.js
│   │   │   └── supabaseClient.js
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── Backend/                     # FastAPI backend
│   ├── migrations/             # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_realtime.sql
│   │   ├── 003_add_rls_policies.sql
│   │   └── 004_fix_rls_policies.sql
│   ├── main.py                # FastAPI app entry point
│   ├── auth.py                # Authentication logic
│   ├── database.py            # Database configuration
│   ├── services.py            # Business logic
│   ├── setup_db.py            # Database setup script
│   ├── test_backend.py        # Backend tests
│   └── requirements.txt       # Python dependencies
│
├── .gitignore
├── README.md
├── COMPLETION_SUMMARY.md
└── TESTING_GUIDE.md
```

## 🗄️ Database Schema

### Tables

#### citizens
- `citizen_id` (UUID, PK) - Unique identifier
- `name` (VARCHAR) - User's full name
- `email` (VARCHAR, UNIQUE) - Email address
- `password_hash` (VARCHAR) - Hashed password
- `ward` (VARCHAR) - Ward/district
- `created_at` (TIMESTAMP) - Account creation date

#### issues
- `issue_id` (UUID, PK) - Unique identifier
- `title` (VARCHAR) - Issue title
- `description` (TEXT) - Detailed description
- `category` (VARCHAR) - Issue category
- `image_url` (TEXT) - Photo URL
- `location` (VARCHAR) - Issue location
- `status` (VARCHAR) - Pending/In Progress/Resolved
- `created_by` (UUID, FK) - References citizens
- `created_at` (TIMESTAMP) - Creation date

#### votes
- `vote_id` (UUID, PK) - Unique identifier
- `issue_id` (UUID, FK) - References issues
- `citizen_id` (UUID, FK) - References citizens
- `vote_type` (VARCHAR) - Upvote/Downvote
- `created_at` (TIMESTAMP) - Vote date

#### feedbacks
- `feedback_id` (UUID, PK) - Unique identifier
- `citizen_id` (UUID, FK) - References citizens
- `issue_id` (UUID, FK) - References issues
- `message` (TEXT) - Comment text
- `created_at` (TIMESTAMP) - Comment date

#### notifications
- `notification_id` (UUID, PK) - Unique identifier
- `citizen_id` (UUID, FK) - References citizens
- `message` (TEXT) - Notification message
- `is_read` (BOOLEAN) - Read status
- `created_at` (TIMESTAMP) - Creation date

## 📚 API Documentation

### Authentication Endpoints

```
POST   /auth/signup          - Register new user
POST   /auth/login           - Login user
POST   /auth/logout          - Logout user
GET    /auth/me              - Get current user
```

### Issues Endpoints

```
GET    /issues               - Get all issues (with filters)
GET    /issues/:id           - Get single issue
POST   /issues               - Create new issue
PUT    /issues/:id           - Update issue
DELETE /issues/:id           - Delete issue
GET    /issues/user/:userId  - Get user's issues
```

### Votes Endpoints

```
POST   /votes                - Cast vote
GET    /votes/:issueId       - Get vote counts
GET    /votes/user/:userId   - Get user's votes
```

### Feedback Endpoints

```
POST   /feedbacks            - Add comment
GET    /feedbacks/:issueId   - Get issue comments
```

For detailed API documentation, visit: http://localhost:8000/docs (when backend is running)

## 🧪 Testing

### Frontend Tests
```bash
cd civic-frontend
npm run test
```

### Backend Tests
```bash
cd Backend
pytest
```

For detailed testing guide, see [TESTING_GUIDE.md](TESTING_GUIDE.md)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Frontend: Follow ESLint rules (run `npm run lint`)
- Backend: Follow PEP 8 Python style guide
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Ananya Sethi** - [@ananyasethi1907](https://github.com/ananyasethi1907)

## 🙏 Acknowledgments

- React team for the amazing framework
- FastAPI for the blazing-fast Python framework
- Supabase for the excellent backend infrastructure
- Tailwind CSS for the utility-first styling approach
- All contributors and users of this application

## 📞 Support

For support, email support@civicapp.com or open an issue on GitHub.

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] SMS alerts for critical issues
- [ ] Issue analytics dashboard
- [ ] Multi-language support
- [ ] Integration with government APIs
- [ ] Chatbot for quick issue reporting
- [ ] Gamification (badges, points)
- [ ] Issue clustering on map view
- [ ] Advanced search and filters

---

Made with ❤️ for civic engagement
