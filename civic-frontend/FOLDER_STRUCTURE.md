# Civic Participation App - Frontend Structure

```
civic-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Navigation bar with auth state
│   │   │   └── Footer.jsx          # Footer with links and info
│   │   ├── ui/
│   │   │   ├── IssueCard.jsx       # Reusable issue display card
│   │   │   ├── VoteButton.jsx      # Voting component with counts
│   │   │   └── ProtectedRoute.jsx  # Route protection wrapper
│   │   └── forms/
│   │       └── ReportForm.jsx      # Issue reporting form
│   ├── pages/
│   │   ├── Home.jsx               # Landing page with hero & features
│   │   ├── Login.jsx              # Authentication login form
│   │   ├── Register.jsx           # User registration form
│   │   ├── Dashboard.jsx          # User dashboard with stats
│   │   ├── Issues.jsx             # Issues feed with filtering
│   │   ├── IssueDetail.jsx        # Single issue view with voting
│   │   ├── CreateIssue.jsx        # Report new issue page
│   │   ├── MyReports.jsx          # User's submitted issues
│   │   └── AdminDashboard.jsx     # Admin panel for issue management
│   ├── services/
│   │   └── api.js                 # API service for backend calls
│   ├── context/
│   │   └── AuthContext.jsx        # Authentication state management
│   ├── assets/
│   ├── App.jsx                    # Main app component with routing
│   ├── main.jsx                   # React app entry point
│   └── index.css                  # Tailwind CSS imports & custom styles
├── package.json
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js
└── vite.config.js
```

## Component Architecture

### Layout Components
- **Navbar**: Responsive navigation with authentication state
- **Footer**: Site-wide footer with links and contact info

### UI Components  
- **IssueCard**: Modular issue display with compact/full modes
- **VoteButton**: Interactive voting with real-time counts
- **ProtectedRoute**: Authentication and authorization wrapper

### Form Components
- **ReportForm**: Complete issue reporting with image upload

### Pages
- **Home**: Hero section, features, and community stats
- **Issues**: Filterable feed of all community issues
- **IssueDetail**: Full issue view with voting and comments
- **Dashboard**: User profile and activity overview
- **MyReports**: Personal issue tracking with status filters
- **AdminDashboard**: Issue management and status updates

## Key Features

✅ **Responsive Design** - Mobile-first approach
✅ **Authentication Flow** - JWT-based auth with context
✅ **Protected Routes** - Role-based access control
✅ **Real-time Voting** - Interactive vote buttons
✅ **Image Upload** - File handling for issue photos
✅ **Status Filtering** - Dynamic issue filtering
✅ **Admin Panel** - Issue status management
✅ **Modern UI** - Tailwind CSS with blue theme
✅ **Modular Components** - Reusable and maintainable code