# 🏗️ Technical Architecture Documentation
## Janashiri Learning Management System

---

## 📊 **System Overview**

The Janashiri LMS is built using a modern, scalable, microservices-inspired architecture that separates concerns and enables independent scaling of different components.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
├─────────────────────────────────────────────────────────┤
│  React Frontend (Port 5173)                            │
│  ├── Public Pages (Home, About, Gallery, Contact)      │
│  ├── Student Portal (Dashboard, Profile, ID Cards)     │
│  ├── Admin Panel (Management, Analytics, Reports)      │
│  └── Authentication (JWT-based, Role-based)            │
└─────────────────────────────────────────────────────────┘
                             │ HTTP/HTTPS
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                     │
├─────────────────────────────────────────────────────────┤
│  Express.js Server (Port 3001)                         │
│  ├── Authentication Middleware                         │
│  ├── Rate Limiting & Security                          │
│  ├── Request Validation                                │
│  └── CORS & Security Headers                           │
└─────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                   │
├─────────────────────────────────────────────────────────┤
│  Route Controllers                                      │
│  ├── Auth Routes (/api/auth/*)                         │
│  ├── Admin Routes (/api/admin/*)                       │
│  ├── Student Routes (/api/student/*)                   │
│  ├── Public Routes (/api/public/*)                     │
│  └── Gallery Routes (/api/gallery/*)                   │
└─────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                            │
├─────────────────────────────────────────────────────────┤
│  MongoDB Atlas (Cloud Database)                        │
│  ├── User Collection (Students & Admins)               │
│  ├── Admission Collection (Applications)               │
│  ├── Contact Collection (Inquiries)                    │
│  ├── Gallery Collection (Images & Metadata)            │
│  └── Session Collection (JWT Tokens)                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                       │
├─────────────────────────────────────────────────────────┤
│  ├── Cloudinary (Image Storage & Optimization)         │
│  ├── Gmail SMTP (Email Service)                        │
│  ├── JWT Service (Token Management)                    │
│  └── bcrypt (Password Hashing)                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ **Architecture Patterns**

### **1. Model-View-Controller (MVC) Pattern**
```
Frontend (View) ↔ API Routes (Controller) ↔ Models (Data)
```

### **2. RESTful API Design**
```
GET    /api/resource        # Retrieve all
GET    /api/resource/:id    # Retrieve one
POST   /api/resource        # Create new
PUT    /api/resource/:id    # Update existing
DELETE /api/resource/:id    # Delete existing
```

### **3. Middleware Chain Pattern**
```
Request → Authentication → Validation → Rate Limiting → Controller → Response
```

---

## 📁 **Project Structure**

```
LMS_Janashiri/
├── 📁 frontend/                    # React.js Client Application
│   ├── 📁 public/
│   │   ├── 📄 index.html
│   │   ├── 🎨 favicon.ico
│   │   └── 📄 manifest.json
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI Components
│   │   │   ├── 🎨 Navbar.jsx
│   │   │   ├── 🎨 Footer.jsx
│   │   │   ├── 🎨 Loading.jsx
│   │   │   └── 📁 student/
│   │   │       └── 🎨 StudentLayout.jsx
│   │   ├── 📁 pages/              # Page Components
│   │   │   ├── 📄 Home.jsx
│   │   │   ├── 📄 About.jsx
│   │   │   ├── 📄 Gallery.jsx
│   │   │   ├── 📄 Contact.jsx
│   │   │   ├── 📁 admin/          # Admin Pages
│   │   │   │   ├── 📊 Dashboard.jsx
│   │   │   │   ├── 👥 Students.jsx
│   │   │   │   ├── 📝 Admissions.jsx
│   │   │   │   ├── 📞 Contacts.jsx
│   │   │   │   ├── 🖼️ Gallery.jsx
│   │   │   │   └── 📈 Analytics.jsx
│   │   │   └── 📁 student/        # Student Pages
│   │   │       ├── 📊 Dashboard.jsx
│   │   │       ├── 👤 Profile.jsx
│   │   │       ├── 🆔 IdCard.jsx
│   │   │       └── ⚙️ AccountSettings.jsx
│   │   ├── 📁 context/            # React Context
│   │   │   └── 🔐 AuthContext.jsx
│   │   ├── 📁 utils/              # Utility Functions
│   │   │   ├── 🌐 api.js
│   │   │   └── 🛠️ helpers.js
│   │   ├── 📁 styles/             # CSS Files
│   │   │   ├── 🎨 index.css
│   │   │   └── 🎨 dashboard.css
│   │   ├── 📄 App.jsx             # Main App Component
│   │   └── 📄 main.jsx            # Entry Point
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 tailwind.config.js
│
├── 📁 backend/                     # Node.js API Server
│   ├── 📁 models/                 # MongoDB Models
│   │   ├── 👤 User.js
│   │   ├── 📝 Admission.js
│   │   ├── 📞 Contact.js
│   │   └── 🖼️ Gallery.js
│   ├── 📁 routes/                 # API Route Handlers
│   │   ├── 🔐 auth.js
│   │   ├── 👨‍💼 admin.js
│   │   ├── 🎓 student.js
│   │   ├── 🌐 public.js
│   │   └── 🖼️ gallery.js
│   ├── 📁 middleware/             # Custom Middleware
│   │   ├── 🔐 auth.js
│   │   ├── 📊 validation.js
│   │   └── 🛡️ security.js
│   ├── 📁 utils/                  # Utility Functions
│   │   ├── ☁️ cloudinary.js
│   │   ├── 📧 email.js
│   │   └── 🛠️ helpers.js
│   ├── 📁 scripts/                # Utility Scripts
│   │   ├── 👤 createAdmin.js
│   │   └── 🔄 migrate.js
│   ├── 📄 server.js               # Main Server File
│   ├── 📄 package.json
│   └── 📄 .env                    # Environment Variables
│
├── 📄 README.md
├── 📄 PROJECT_DOCUMENTATION.md
├── 📄 FEATURE_SUMMARY.md
└── 📄 .gitignore
```

---

## 🗄️ **Database Schema**

### **Users Collection**
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'admin']),
  studentId: String (unique for students),
  profilePhoto: String (Cloudinary URL),
  personalInfo: {
    dateOfBirth: Date,
    phoneNumber: String,
    address: Object,
    emergencyContact: Object,
    medicalInfo: String
  },
  academicInfo: {
    course: String,
    batch: String,
    rollNumber: String,
    academicYear: String
  },
  preferences: {
    notifications: Object,
    privacy: Object
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Admissions Collection**
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  course: String,
  status: String (enum: ['pending', 'approved', 'rejected']),
  documents: {
    photo: String (Cloudinary URL),
    idProof: String (Cloudinary URL),
    academicCertificate: String (Cloudinary URL)
  },
  personalInfo: Object,
  academicBackground: Object,
  rejectionReason: String,
  processedBy: ObjectId,
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **Gallery Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String (enum: ['Campus', 'Events', 'Sports', 'Facilities', 'Students', 'Faculty']),
  imageUrl: String (Cloudinary URL),
  cloudinaryPublicId: String,
  metadata: {
    fileSize: Number,
    dimensions: Object,
    uploadedBy: ObjectId
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Contacts Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phoneNumber: String,
  subject: String,
  message: String,
  status: String (enum: ['new', 'read', 'responded', 'closed']),
  response: String,
  respondedBy: ObjectId,
  respondedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 **Security Architecture**

### **Authentication Flow**
```
1. User Login → 2. Validate Credentials → 3. Generate JWT Token
      ↓                    ↓                        ↓
4. Store Token → 5. Include in Headers → 6. Verify on Each Request
```

### **Authorization Middleware**
```javascript
// auth.js middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
```

### **Security Layers**
1. **Input Validation**: Joi/Express-validator
2. **Rate Limiting**: Express-rate-limit
3. **CORS Protection**: Configurable origins
4. **Helmet.js**: Security headers
5. **bcrypt**: Password hashing
6. **JWT**: Stateless authentication
7. **File Validation**: Type and size limits

---

## ⚡ **Performance Optimization**

### **Frontend Optimizations**
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format, responsive images
- **Bundle Optimization**: Tree shaking, minification
- **Caching Strategy**: Browser and service worker caching
- **CDN Integration**: Cloudinary for global delivery

### **Backend Optimizations**
- **Database Indexing**: Optimized queries
- **Connection Pooling**: MongoDB connection management
- **Middleware Optimization**: Efficient request processing
- **Response Compression**: Gzip compression
- **Memory Management**: Garbage collection optimization

### **Caching Strategy**
```
Browser Cache → CDN Cache → Application Cache → Database Cache
     ↓              ↓              ↓              ↓
Static Assets → Images/Media → API Responses → Query Results
```

---

## 📊 **Monitoring & Analytics**

### **Performance Metrics**
- **Response Time**: <200ms API endpoints
- **Page Load Time**: <2s frontend pages
- **Database Queries**: <100ms average
- **Memory Usage**: <512MB typical usage
- **CPU Utilization**: <30% under normal load

### **Error Tracking**
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Log to external service (planned)
  // logger.error(err);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

### **Analytics Integration**
- **User Behavior**: Page views, click tracking
- **Performance Metrics**: Load times, error rates
- **Business Metrics**: Conversion rates, user engagement
- **System Health**: Uptime, response times

---

## 🚀 **Deployment Architecture**

### **Development Environment**
```
Local Development:
├── Frontend: http://localhost:5173
├── Backend: http://localhost:3001
├── Database: MongoDB Atlas (Cloud)
└── File Storage: Cloudinary (Cloud)
```

### **Production Environment (Planned)**
```
Production Setup:
├── Frontend: Vercel/Netlify (CDN)
├── Backend: Railway/Render (Container)
├── Database: MongoDB Atlas (Production Cluster)
├── File Storage: Cloudinary (Production)
├── Domain: Custom domain with SSL
└── Monitoring: Uptime monitoring service
```

### **CI/CD Pipeline (Planned)**
```
Git Push → Automated Tests → Build Process → Deploy to Staging → Manual Approval → Deploy to Production
```

---

## 🔄 **API Design Principles**

### **RESTful Endpoints**
```
Authentication:
POST   /api/auth/admin/login      # Admin login
POST   /api/auth/student/login    # Student login
GET    /api/auth/me               # Current user info
POST   /api/auth/logout           # Logout

Student Management:
GET    /api/admin/students        # List students
GET    /api/admin/students/:id    # Get student details
PUT    /api/admin/students/:id    # Update student
DELETE /api/admin/students/:id    # Deactivate student

Gallery Management:
GET    /api/gallery               # Public gallery
POST   /api/gallery/upload        # Admin upload
PUT    /api/gallery/:id           # Update image
DELETE /api/gallery/:id           # Delete image
DELETE /api/gallery/bulk          # Bulk delete
```

### **Response Format Standards**
```javascript
// Success Response
{
  "success": true,
  "data": {
    "item": {},
    "pagination": {}
  },
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": []
  }
}
```

---

## 🛠️ **Development Guidelines**

### **Code Standards**
- **JavaScript**: ES6+ features, async/await
- **React**: Functional components, hooks
- **CSS**: TailwindCSS utility-first approach
- **File Naming**: PascalCase for components, camelCase for utilities
- **Git**: Conventional commits, feature branches

### **Testing Strategy**
```
Unit Tests → Integration Tests → E2E Tests → Performance Tests
    ↓              ↓               ↓              ↓
Components → API Endpoints → User Flows → Load Testing
```

### **Documentation Standards**
- **Inline Comments**: JSDoc format
- **API Documentation**: OpenAPI/Swagger (planned)
- **Component Documentation**: Storybook (planned)
- **Architecture Docs**: Regular updates

---

## 📈 **Scalability Considerations**

### **Horizontal Scaling**
- **Load Balancing**: Multiple server instances
- **Database Sharding**: Distribute data across clusters
- **Microservices**: Split into smaller services
- **CDN Integration**: Global content distribution

### **Vertical Scaling**
- **Resource Optimization**: Memory and CPU usage
- **Database Indexing**: Query performance
- **Caching Layers**: Reduce database load
- **Code Optimization**: Efficient algorithms

---

## 🔮 **Future Technical Enhancements**

### **Short Term (2025)**
- **Redis Caching**: In-memory data store
- **ElasticSearch**: Advanced search capabilities
- **WebSockets**: Real-time features
- **Docker**: Containerized deployment
- **Monitoring**: Comprehensive observability

### **Long Term (2026+)**
- **Kubernetes**: Container orchestration
- **GraphQL**: Flexible API queries
- **Microservices**: Service decomposition
- **AI Integration**: Machine learning features
- **Edge Computing**: Global edge deployment

---

**📧 Technical Queries**: tech@janashiri.edu  
**🔧 Architecture Reviews**: architecture@janashiri.edu

---

*Last Updated: August 20, 2025*  
*Document Version: 1.0*
