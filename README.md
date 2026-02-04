# IMS: Next-Gen Institutional Management System
### *Elevating Academic Governance through Modern Engineering*

![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![Node Version](https://img.shields.io/badge/Node-v18%2B-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Executive Summary](#-executive-summary)
3. [Core Features](#-core-functional-modules)
4. [Tech Stack](#-tech-stack)
5. [System Architecture](#-system-architecture)
6. [Prerequisites](#-prerequisites)
7. [Installation & Setup](#-installation--setup)
8. [Environment Configuration](#-environment-configuration)
9. [Database Setup](#-database-setup)
10. [Running the Application](#-running-the-application)
11. [API Endpoints](#-api-endpoints)
12. [Project Structure](#-project-structure)
13. [Design Philosophy](#-design--uiux-philosophy)
14. [Performance & Optimization](#-performance--optimization)
15. [Troubleshooting](#-troubleshooting)
16. [Future Roadmap](#-future-roadmap)
17. [Contributing](#-contributing)
18. [License](#-license)

---

## 📖 Project Overview
The **Institutional Management System (IMS)** is a flagship academic platform engineered to replace legacy university portals with a high-performance, real-time, and aesthetically premium solution. Built with a focus on speed, security, and intuitive user experience, IMS centralizes all institutional workflows—from student attendance to complex result publication.

## 🎯 Executive Summary
Traditional management systems are often slow, cluttered, and difficult to navigate on mobile devices. **IMS solves this** by utilizing a lightweight "Shell Architecture" with modular view rendering, ensuring that the interface feels immediate and responsive.

---

## 🚀 Core Functional Modules

### 1. Unified Authentication Suite
- **Multi-Role RBAC:** Robust Role-Based Access Control for Students, Teachers, Dept Heads, Course Coordinators, and Super Admins.
- **Security Protocols:** JWT-based session management with secure local storage and automatic session invalidation upon detection of unauthorized access.
- **Password Recovery:** Integrated automated secure password reset flow.
- **Email Verification:** Secure email-based account verification system.

### 2. Academic Lifecycle Management
- **Smart Attendance:** A teacher-friendly terminal for real-time attendance logging with automatic percentage calculation and streak tracking for students.
- **Result Processing Engine:** A sophisticated pipeline for teachers to upload student marks and digital scripts, which are instantly accessible to students in a secure vault.
- **Dynamic Curriculum:** Batch-specific course management ensuring students only see materials and schedules relevant to their specific academic group.
- **Material Management:** Upload, organize, and distribute course materials to enrolled students.

### 3. Institutional Governance Terminal
- **Coordinator Dashboard:** Advanced course-to-teacher assignment matrix with semester-wide filtering.
- **Admit Card Issuance:** Department-controlled gatekeeping for exam eligibility and digital permit generation.
- **Centralized Notice Board:** A global communication hub supporting rich-text announcements and emergency alerts.
- **Policy Management:** Role-based access control and institutional policies enforcement.
- **Finance Dashboard:** Treasurer view for financial management and budget tracking.

### 4. Additional Features
- **Notifications:** Real-time notification system for all user roles.
- **System Logs:** Comprehensive audit logs for administrative oversight.
- **Department Management:** Multi-department support with departmental segregation.
- **Semester Management:** Academic calendar management with active semester designation.

---

## 💻 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Vite** | Build tool & development server |
| **Vanilla JavaScript** | Core application logic |
| **Tailwind CSS** | Responsive styling |
| **GSAP** | Smooth animations |
| **Three.js** | 3D particle effects |
| **Cloudinary** | Asset CDN integration |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **PostgreSQL** | Relational database |
| **Drizzle ORM** | Type-safe ORM |
| **JWT** | Authentication tokens |
| **Cloudinary** | Media storage |
| **Nodemailer** | Email service |

---

## 🏗️ System Architecture

### Frontend Architecture
- **Modular Shell Design:** Component-on-Demand rendering system where HTML is injected only when needed.
- **Single-Page Application:** Smooth transitions between roles and views without page reloads.
- **Responsive Design:** 100% responsive across Mobile, Tablet, and Desktop devices.
- **Performance-First:** Lazy loading, asset minification, and optimized DOM manipulation.

### Backend Architecture
- **MVC Pattern:** Clear separation of controllers, services, middleware, and routes.
- **Middleware Stack:** Authentication, Policy enforcement, and error handling middleware.
- **Policy Engine:** Dynamic role-based policy enforcement system.
- **Service Layer:** Centralized business logic and event handling.
- **Event System:** Real-time event broadcasting for notifications.

### Database Architecture
- **Highly Normalized Schema:** Designed for academic interlocking relationships.
- **Foreign Key Constraints:** Relational integrity through cascade operations.
- **Prepared Statements:** Protection against SQL injection via Drizzle ORM.

---

## 📋 Prerequisites

Before installation, ensure you have:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ or **yarn** ([Download](https://yarnpkg.com/))
- **PostgreSQL** v14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **Cloudinary Account** ([Sign up](https://cloudinary.com/))
- A code editor (VS Code recommended)

### Verification
```bash
# Verify installations
node --version
npm --version
psql --version
git --version
```

---

## ⚙️ Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd IMS
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Environment Configuration
```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Configuration](#-environment-configuration) section).

#### 2.3 Database Setup
```bash
# Create PostgreSQL database
createdb ims_db

# Run migrations
npx drizzle-kit push:pg

# Seed initial data (optional)
npm run seed
```

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Environment Configuration
Create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🔐 Environment Configuration

### Backend `.env` File
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/ims_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=noreply@ims.edu

# Admin Configuration
ADMIN_EMAIL=admin@ims.edu
ADMIN_DEFAULT_PASSWORD=AdminPassword123!
```

### Frontend `.env.local` File
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Security Note:** Never commit `.env` files to version control. Add to `.gitignore`.

---

## 🗄️ Database Setup

### PostgreSQL Installation (macOS)
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Verify installation
psql --version
```

### Database Initialization
```bash
cd backend

# Create database
createdb ims_db

# Apply schema migrations
npx drizzle-kit push:pg

# Seed with initial policies and data
npm run seed
```

### Database Access
```bash
# Connect to database
psql -U postgres -d ims_db

# List tables
\dt

# Exit psql
\q
```

---

## 🚀 Running the Application

### Development Mode

#### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

#### Terminal 2: Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

#### Terminal 3: Database (if not using brew services)
```bash
brew services start postgresql
```

### Production Build

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Output in dist/
```

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | User registration |
| POST | `/login` | User login |
| POST | `/logout` | User logout |
| POST | `/refresh` | Refresh JWT token |
| POST | `/forgot-password` | Initiate password reset |
| POST | `/reset-password/:token` | Reset password |
| GET | `/verify/:token` | Verify email |

### User Routes (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get current user profile |
| PUT | `/profile` | Update user profile |
| GET | `/all` | List all users (Admin) |
| DELETE | `/:id` | Delete user (Admin) |

### Student Routes (`/api/students`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Student dashboard |
| GET | `/courses` | Enrolled courses |
| GET | `/results` | Student results |
| GET | `/attendance` | Attendance records |
| GET | `/materials` | Course materials |

### Teacher Routes (`/api/teachers`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Teacher dashboard |
| GET | `/courses` | Assigned courses |
| POST | `/attendance` | Mark attendance |
| POST | `/results` | Upload results |
| GET | `/students/:courseId` | Course students |

### Course Routes (`/api/courses`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all courses |
| POST | `/` | Create course (Admin) |
| GET | `/:id` | Get course details |
| PUT | `/:id` | Update course |
| DELETE | `/:id` | Delete course |

### Attendance Routes (`/api/attendance`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get attendance records |
| POST | `/` | Record attendance |
| GET | `/:studentId` | Student attendance |

### Results Routes (`/api/results`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Upload results |
| GET | `/` | List results |
| GET | `/:studentId` | Student results |
| PUT | `/:id` | Update result |

### Notice Routes (`/api/notices`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List notices |
| POST | `/` | Create notice |
| PUT | `/:id` | Update notice |
| DELETE | `/:id` | Delete notice |

### Department Routes (`/api/departments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List departments |
| POST | `/` | Create department |
| GET | `/:id` | Get department |
| PUT | `/:id` | Update department |

### Semester Routes (`/api/semesters`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List semesters |
| POST | `/` | Create semester |
| PUT | `/:id` | Update semester |
| GET | `/active` | Get active semester |

### Material Routes (`/api/materials`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List materials |
| POST | `/` | Upload material |
| DELETE | `/:id` | Delete material |
| GET | `/course/:courseId` | Course materials |

### Notification Routes (`/api/notifications`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get notifications |
| POST | `/` | Create notification |
| PUT | `/:id/read` | Mark as read |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/logs` | View system logs |
| GET | `/users` | Manage users |
| GET | `/policies` | View policies |
| POST | `/policies` | Create policies |

---

## 📂 Project Structure

```
IMS/
├── backend/
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Route controllers (business logic)
│   │   ├── db/                  # Database schema & migrations
│   │   ├── middleware/          # Auth, policy, error handling
│   │   ├── routes/              # API route definitions
│   │   ├── scripts/             # Database seeding scripts
│   │   ├── services/            # Business logic & events
│   │   └── utils/               # Helper functions
│   ├── index.js                 # Express app entry point
│   ├── package.json             # Backend dependencies
│   └── drizzle.config.js        # Drizzle ORM configuration
│
├── frontend/
│   ├── src/
│   │   ├── views/               # Role-based view components
│   │   ├── utils/               # Helper functions
│   │   ├── animations.js        # GSAP animations
│   │   ├── auth.js              # Authentication logic
│   │   ├── dashboard.js         # Dashboard controller
│   │   └── style.css            # Tailwind styles
│   ├── public/                  # Static assets
│   ├── index.html               # Main HTML
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite configuration
│
├── README.md                     # This file
├── DESIGN_TRANSFORMATION.md      # Design documentation
└── package.json                  # Root dependencies
```

---

## 🎨 Design & UI/UX Philosophy ("Neon-Pro")

IMS isn't just a tool; it's an experience. The design system is crafted to "wow" users while maintaining professional utility:

### Visual Design
- **Glassmorphism:** Frosted glass effects with backdrop blur for modern aesthetic
- **Dark-Deep-Space Theme:** Reduces eye strain and emphasizes content hierarchy
- **Color System:** Carefully selected palette for accessibility and visual hierarchy
- **Typography:** Clear hierarchy with readable sans-serif fonts

### Interactivity
- **GSAP Animations:** Buttery-smooth entrance transitions and micro-interactions
- **Toast Notifications:** Custom-styled notifications for user feedback
- **Loading States:** Animated loaders that provide clear feedback
- **Responsive Interactions:** Touch-friendly on mobile, precise on desktop

### 3D Effects
- **Three.js Particle Engine:** Custom-coded background effects that react to performance
- **Performance Scaling:** Reduces visual complexity on lower-end devices
- **Battery Optimization:** Lazy-loaded canvases that deactivate on mobile

---

## 🛠️ Performance & Optimization

### Frontend Optimizations
- **Asset Minification:** Zero-bloat JavaScript bundles via Vite
- **Code Splitting:** Routes and views loaded on-demand
- **Image Optimization:** Cloudinary integration for automatic image optimization
- **Lazy Loading:** 3D effects and heavy assets load conditionally

### Backend Optimizations
- **Database Query Optimization:** Prepared statements and index optimization
- **Connection Pooling:** Efficient database connection management
- **Caching:** Redis-ready architecture for future caching layer
- **Compression:** GZIP compression for API responses

### Monitoring
- **Error Logging:** Comprehensive error tracking
- **Performance Metrics:** Response time monitoring
- **User Activity Logs:** Audit trail for compliance

---

## 🐛 Troubleshooting

### Common Issues

#### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
```bash
# Start PostgreSQL service
brew services start postgresql

# Or verify connection
psql -U postgres
```

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

#### JWT Token Expired
**Solution:** Refresh token using `/api/auth/refresh` endpoint or re-login

#### Cloudinary Upload Fails
**Solution:** Verify Cloudinary credentials in `.env` file and ensure account is active

#### Database Migration Error
**Solution:**
```bash
# Reset database
dropdb ims_db
createdb ims_db
npx drizzle-kit push:pg
npm run seed
```

#### CORS Error
**Solution:** Ensure `CLIENT_URL` in backend `.env` matches frontend URL

---

## 🔮 Future Roadmap

### Phase 1 (Q2 2026)
- [ ] **AI-Predictive Analytics:** Identifying students at risk based on attendance patterns
- [ ] **Advanced Reporting:** Customizable report generation system
- [ ] **Mobile Responsive Enhancement:** Full mobile-first redesign

### Phase 2 (Q3 2026)
- [ ] **Integrated Chat Terminals:** Real-time peer-to-peer and student-teacher messaging
- [ ] **Video Conferencing:** Built-in video call capabilities for classes
- [ ] **Assignment Management:** Complete assignment submission and grading system

### Phase 3 (Q4 2026)
- [ ] **Mobile Native App:** React Native version with push notifications
- [ ] **Blockchain Verification:** Certificate verification via blockchain
- [ ] **API Gateway:** Public API for third-party integrations

### Backlog
- [ ] **Two-Factor Authentication:** Enhanced security
- [ ] **Biometric Login:** Fingerprint/face recognition support
- [ ] **Multi-language Support:** Internationalization (i18n)
- [ ] **LDAP/Active Directory:** Enterprise directory integration

---

## 👥 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR
- Include descriptive commit messages

### Code Style
```bash
# Backend: Node.js conventions
# - Use ES6+ syntax
# - 2-space indentation
# - Meaningful variable names

# Frontend: Vanilla JS conventions
# - DOM manipulation via event delegation
# - Modular component design
# - Comprehensive comments
```

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- **GitHub Issues:** [Report bugs](../../issues)
- **Email:** support@ims.edu
- **Documentation:** See [DESIGN_TRANSFORMATION.md](./DESIGN_TRANSFORMATION.md)

---

## 🙏 Acknowledgments

- Built with ❤️ for modern educational institutions
- Inspired by best practices in full-stack development
- Special thanks to the open-source community

---

**IMS is more than software—it is the digital foundation of a modern academic institution.**

*Last Updated: February 4, 2026*
