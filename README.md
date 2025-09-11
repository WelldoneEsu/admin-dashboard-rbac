# Project Title
## Admin Dashboard RBAC

A secure **Node.js + Express** backend with **JWT authentication**, **refresh tokens**, and **Role-Based Access Control (RBAC)**.  
Implements user management, activity logs, and stats aggregation with MongoDB.

---

## Features

- **Authentication**
  - Signup, Login, Logout
  - Short-lived Access Tokens + Refresh Tokens
  - Passwords hashed with bcrypt
  - Refresh tokens stored in DB (revocable on logout)

- **Role-Based Access Control**
  - **Admin**: full access (manage users, view stats, view/export logs)
  - **Manager**: view stats, manage logs, no user deletion
  - **User**: access own profile and data only

- **Stats Endpoints**
  - `/api/stats/users` → count users by role
  - `/api/stats/logins` → successful vs failed logins
  - `/api/stats/active-users` → users active in last 24h

- **Activity Logs**
  - Store: userId, action type, timestamp, IP address
  - Logs recorded for login attempts, role changes, CRUD
  - Export logs to **CSV/JSON** (admin/manager)

- **Security**
  - Helmet (secure headers)
  - Rate limiting (on login route)
  - Centralized error handling

---

## Project Structure
admin-dashboard-rbac/
├── controllers/
│ ├── authController.js
│ ├── statsController.js
│ └── logsController.js
├── middleware/
│ ├── authMiddleware.js
│ ├── rbacMiddleware.js
│ └── errorMiddleware.js
├── models/
│ ├── User.js
│ ├── RefreshToken.js
│ └── ActivityLog.js
├── routes/
│ ├── authRoutes.js
│ ├── statsRoutes.js
│ └── logsRoutes.js
├── utils/
  └──activity.js
│ └── token.js
├── app.js
├── server.js
├── .env.example
├── package.json
└── README.md


## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- helmet
- express-rate-limit
- cors
- dotenv


---

## Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/WelldoneEsu/admin-dashboard-rbac.git
   cd admin-dashboard-rbac

# 2. Install dependencies
- npm install


# 3. Setup environment
Create a .env 

PORT=5000
MONGO_URI=mongodb://localhost:27017/admin-dashboard-rbac
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=jwst-refresh-secret


# 4. Run server

- npm run dev

## API Endpoints
# Auth
POST /api/auth/signup → register new user (role = user by default)
POST /api/auth/login → login, returns access + refresh tokens
POST /api/auth/refresh-token → refresh access token
POST /api/auth/logout → revoke refresh token

# Stats
GET /api/stats/users → users count by role (admin, manager)
GET /api/stats/logins → login success/fail count (admin, manager)
GET /api/stats/active-users → active users last 24h (admin, manager)

# Logs
GET /api/logs → all logs (admin)
GET /api/logs/export?format=csv/json → export logs (admin, manager)
RBAC (Role Access Matrix)
Endpoint	           Admin	Manager	User
Auth (signup/login)	✅	   ✅	   ✅
Stats endpoints	   ✅	   ✅	   ❌
View all logs	      ✅	   ❌	   ❌
Export logs	         ✅	   ✅	   ❌
Profile (self)	      ✅	   ✅	   ✅


 ## Usage 
npm start     # Start normally
npm run dev   # Start with nodemon


## License
- MIT © 2025


## Author
Welldone Esu 

---
## API Endpoints

### User Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/refresh-token - Refresh access token
- POST /api/auth/logout - Logout user


## Third commit and Push

- git add .
- git commit -m "feat: setup project with auth, RBAC, stats, and logs"
- git push origin main