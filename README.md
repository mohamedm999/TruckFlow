# TruckFlow - Fleet Management System

A web application for managing a trucking fleet: trucks, trailers, tires, fuel, trips, drivers, and maintenance.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Docker)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run seed:admin   # Create initial admin user
npm run dev          # Start development server
```

### Environment Variables
Copy `backend/.env.example` to `backend/.env` and configure:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/truckflow
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

## 📁 Project Structure
```
TruckFlow/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, validation, errors
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── scripts/      # Seed scripts
│   │   └── services/     # Business logic
│   └── package.json
├── frontend/         # React + Vite (coming soon)
└── docker-compose.yml
```

## 🔐 Default Credentials
- **Admin**: admin@truckflow.com / admin123

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/password | Update password |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List users |
| GET | /api/users/:id | Get user |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

## 🐳 Docker
```bash
docker-compose up -d mongodb   # Start MongoDB
docker-compose up --build      # Start all services
```

## 📝 License
ISC
