# Learning Management System (LMS) - Janashiri Institute

A comprehensive full-stack Learning Management System built with modern web technologies, featuring role-based authentication, admission management, student portals, and administrative dashboards.

## 🚀 Features

### Public Features
- **Home Page**: Institute overview with modern responsive design
- **About Page**: Detailed institute information and mission
- **Gallery**: Interactive photo gallery of campus and events
- **Contact Form**: Direct communication with institute administration
- **Admission Form**: Online application with photo upload
- **Admission Status Checker**: Real-time application status tracking

### Student Portal
- **Dashboard**: Personal overview and quick access to features
- **Profile Management**: Complete profile with photo upload, personal details, and emergency contact
- **Account Settings**: Security settings, password change, notification preferences
- **Privacy Settings**: Control visibility of profile information
- **ID Card Generation**: Download printable student ID card (PDF/PNG)
- **Secure Authentication**: JWT-based login with student ID or email
- **Notification System**: Customizable email and SMS notifications for:
  - Academic updates and announcements
  - Exam reminders and schedules
  - Fee payment reminders
  - General institute notifications

### Admin Panel
- **Dashboard**: Comprehensive statistics and overview
- **Admission Management**: Review, approve, or reject applications
- **Student Management**: Complete student database with status controls
- **Contact Management**: Handle and respond to inquiries
- **Email Integration**: Automated notifications for all processes
- **Credential Management**: Send login credentials to approved students via email

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for responsive, modern UI design
- **React Router DOM** for client-side routing
- **Axios** for API communication
- **React Hook Form** for form handling
- **Heroicons** for consistent iconography
- **jsPDF & html-to-image** for ID card generation

### Backend
- **Node.js** with Express.js framework
- **MongoDB Atlas** for cloud database
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **Multer & Cloudinary** for file upload and storage
- **Nodemailer** for email functionality
- **Express Rate Limiting** for API protection

## 📁 Project Structure

```
LMS_Janashiri/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin dashboard pages
│   │   │   └── student/    # Student portal pages
│   │   ├── context/        # React Context providers
│   │   ├── utils/          # Utility functions and API
│   │   └── ...
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                 # Node.js backend API
│   ├── models/             # MongoDB models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Helper functions
│   ├── scripts/            # Utility scripts
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- Gmail account for email functionality

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LMS_Janashiri
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configurations:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. **Create Admin User**
   ```bash
   cd ../backend
   npm run create-admin
   ```

5. **Start Development Servers**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Database Migration (For Existing Installations)**
   
   If you're updating from a previous version, run the migration script to update existing student records with new profile fields:
   ```bash
   cd backend
   npm run migrate-students
   ```

The application will be available at:
- Frontend: http://localhost:5174
- Backend API: http://localhost:3001

## 🔄 Recent Updates

### Version 2.0 - Enhanced Student Portal (Latest)
- **Complete Profile Management**: Added comprehensive student profile with photo upload, emergency contact, and personal details
- **Account Settings Page**: Security settings, password change, and notification preferences
- **Privacy Controls**: Granular privacy settings for profile visibility
- **Notification System**: Customizable email and SMS notification preferences
- **Database Migration**: Automatic migration for existing student records
- **Enhanced Validation**: Improved form validation and error handling
- **Admin Credential Sending**: Automated email delivery of login credentials to approved students

### Key Improvements
- Enhanced user experience with modern, responsive design
- Improved data validation and error handling
- Better security with granular privacy controls
- Streamlined onboarding process for new students
- Comprehensive profile management system

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Login: admin@janashiri.edu / Admin@123456

## 🔧 Configuration Guide

### MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your IP address
4. Get the connection string

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Update the `.env` file

### Gmail SMTP Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `.env`

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/student/login` - Student login  
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Admission Endpoints
- `POST /api/admission/submit` - Submit admission form
- `GET /api/admission/status/:email` - Check status
- `GET /api/admission/stats` - Public statistics

### Admin Endpoints
- `GET /api/admin/admissions` - List all admissions
- `POST /api/admin/admissions/process` - Accept/reject admission
- `POST /api/admin/send-credentials` - Send login credentials to student
- `GET /api/admin/students` - List all students
- `GET /api/admin/dashboard/stats` - Dashboard statistics

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update profile
- `PUT /api/student/profile/photo` - Update profile photo
- `POST /api/student/change-password` - Change password
- `PUT /api/student/notification-settings` - Update notification preferences
- `PUT /api/student/privacy-settings` - Update privacy settings
- `GET /api/student/id-card` - Get ID card data

## 🎨 Design System

The application uses a consistent design system built with TailwindCSS:

- **Primary Colors**: Blue gradient (#667eea to #764ba2)
- **Secondary Colors**: Light blue variants
- **Typography**: Inter font family
- **Components**: Reusable button, form, and card styles
- **Responsive**: Mobile-first approach with breakpoints

## 🔒 Security Features

- JWT-based authentication with secure token handling
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- File upload restrictions and validation
- CORS protection
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Ensure MongoDB Atlas connectivity
3. Configure Cloudinary and email settings

### Frontend Deployment (Vercel/Netlify)
1. Update API URL in environment variables
2. Build the application
3. Deploy static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions:
- Email: support@janashiri.edu
- Documentation: Refer to inline code comments
- Issues: Use GitHub issues for bug reports

## 📝 License

This project is licensed under the ISC License.

---

**Built with ❤️ by the Janashiri Development Team**
