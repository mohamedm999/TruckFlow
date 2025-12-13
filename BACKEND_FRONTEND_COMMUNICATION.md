# 🔄 Backend ↔️ Frontend Communication Guide

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)                                            │
│  http://localhost:3002                                       │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Pages      │───▶│  Redux Store │───▶│  API Service │ │
│  │ (Login, etc) │    │  (State)     │    │  (api.ts)    │ │
│  └──────────────┘    └──────────────┘    └──────┬───────┘ │
│                                                   │          │
└───────────────────────────────────────────────────┼──────────┘
                                                    │
                                    HTTP Request    │
                                    (fetch API)     │
                                                    ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (Node.js + Express)                                 │
│  http://localhost:5000                                       │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Routes     │───▶│ Controllers  │───▶│   Models     │ │
│  │ (Endpoints)  │    │ (Logic)      │    │ (MongoDB)    │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 1. Authentication Flow (Login Example)

### Step-by-Step Process:

#### **Frontend (User Action):**
```
User enters email + password in Login page
         ↓
Login.tsx calls: login(email, password)
         ↓
AuthContext.tsx calls: api.login(email, password)
         ↓
api.ts sends HTTP request
```

#### **HTTP Request:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
Credentials: include

Body:
{
  "email": "admin@truckflow.com",
  "password": "admin123"
}
```

#### **Backend Processing:**
```
Express receives request
         ↓
app.js routes to: /api/auth → authRoutes.js
         ↓
authRoutes.js routes to: POST /login → authController.login
         ↓
authController.js:
  1. Validates credentials
  2. Generates accessToken (JWT)
  3. Generates refreshToken
  4. Saves refreshToken to MongoDB
  5. Sets refreshToken as HttpOnly cookie
         ↓
Returns response
```

#### **HTTP Response:**
```http
HTTP/1.1 200 OK
Set-Cookie: refreshToken=xyz123...; HttpOnly; Secure; SameSite=Strict
Content-Type: application/json

Body:
{
  "success": true,
  "data": {
    "user": {
      "_id": "123",
      "email": "admin@truckflow.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Frontend (Response Handling):**
```
api.ts receives response
         ↓
Stores accessToken in memory: api.setAccessToken(token)
         ↓
Returns data to AuthContext
         ↓
AuthContext updates user state
         ↓
User redirected to Dashboard
```

---

## 📡 2. API Request Flow (Get Trucks Example)

### Frontend Code:
```typescript
// pages/TrucksPage.tsx
import { useAppDispatch } from '../store/hooks';
import { fetchTrucks } from '../store/slices/trucksSlice';

const TrucksPage = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchTrucks()); // Trigger Redux action
  }, []);
};
```

### Redux Thunk:
```typescript
// store/slices/trucksSlice.ts
export const fetchTrucks = createAsyncThunk('trucks/fetchAll', async () => {
  const response = await api.getTrucks(); // Call API service
  return response.data;
});
```

### API Service:
```typescript
// services/api.ts
async getTrucks() {
  return this.request<any[]>('/trucks'); // Make HTTP request
}

private async request(endpoint, options) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.accessToken}` // Add token
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
    credentials: 'include' // Send cookies
  });
  
  return response.json();
}
```

### HTTP Request:
```http
GET http://localhost:5000/api/trucks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Cookie: refreshToken=xyz123...
```

### Backend Processing:
```
Express receives request
         ↓
app.js: /api/trucks → truckRoutes.js
         ↓
truckRoutes.js: GET / → protect middleware → getTrucks controller
         ↓
protect middleware (authMiddleware.js):
  1. Extracts token from Authorization header
  2. Verifies JWT signature
  3. Decodes user info
  4. Attaches req.user
         ↓
truckController.getTrucks:
  1. Queries MongoDB: Truck.find({})
  2. Returns trucks array
```

### HTTP Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": [
    {
      "_id": "abc123",
      "registrationNumber": "TX-123-AB",
      "brand": "Volvo",
      "model": "FH16",
      "year": 2021,
      "status": "Active"
    },
    ...
  ]
}
```

### Frontend Updates:
```
api.ts receives response
         ↓
Returns to Redux thunk
         ↓
Redux updates state: state.trucks = response.data
         ↓
React component re-renders with new data
         ↓
User sees trucks list on screen
```

---

## 🔄 3. Token Refresh Flow

### When Access Token Expires:

```
Frontend makes API request
         ↓
Backend returns 401 Unauthorized
         ↓
Frontend detects 401
         ↓
Calls api.refreshToken()
         ↓
Backend validates HttpOnly cookie
         ↓
Returns new accessToken
         ↓
Frontend stores new token in memory
         ↓
Retries original request
```

### Automatic on Page Refresh:

```
User refreshes browser
         ↓
App.tsx loads
         ↓
AuthContext useEffect runs
         ↓
Calls api.refreshToken() (uses HttpOnly cookie)
         ↓
Backend validates cookie → returns new accessToken
         ↓
Calls api.getMe() with new token
         ↓
User data loaded → User stays logged in ✅
```

---

## 🔐 4. Security Layers

### Request Security:

```
Frontend Request
    ↓
┌─────────────────────────────────────┐
│ 1. CORS Check                       │
│    Origin: http://localhost:3002    │
│    ✅ Allowed in backend .env       │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 2. Rate Limiting                    │
│    Max 100 requests/15min           │
│    ✅ Within limit                  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 3. Authentication                   │
│    Authorization: Bearer token      │
│    ✅ Valid JWT signature           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 4. Authorization                    │
│    User role: admin                 │
│    Required: admin                  │
│    ✅ Authorized                    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 5. Validation                       │
│    Joi schema validation            │
│    ✅ Valid input                   │
└─────────────────────────────────────┘
    ↓
Process Request ✅
```

---

## 📦 5. Data Flow Diagram

### Create Truck Example:

```
┌──────────────────────────────────────────────────────────────┐
│ FRONTEND                                                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  User fills form:                                            │
│  ┌─────────────────────────────────────┐                    │
│  │ Registration: TX-999-ZZ             │                    │
│  │ Brand: Volvo                        │                    │
│  │ Model: FH16                         │                    │
│  │ Year: 2024                          │                    │
│  └─────────────────────────────────────┘                    │
│                    ↓                                          │
│  dispatch(createTruck(formData))                            │
│                    ↓                                          │
│  Redux Thunk → api.createTruck(data)                        │
│                    ↓                                          │
│  HTTP POST /api/trucks                                       │
│  Body: { registrationNumber, brand, model, year }           │
│                                                               │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │ HTTP Request
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ BACKEND                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Express Router                                              │
│  POST /api/trucks → truckRoutes.js                          │
│                    ↓                                          │
│  Middleware Chain:                                           │
│  1. protect (verify JWT)                                     │
│  2. adminOnly (check role)                                   │
│  3. validate(createTruckSchema)                             │
│                    ↓                                          │
│  truckController.createTruck                                │
│  1. Check if truck exists                                    │
│  2. Truck.create({ ...data })                               │
│  3. Save to MongoDB                                          │
│                    ↓                                          │
│  MongoDB                                                     │
│  ┌─────────────────────────────────────┐                    │
│  │ trucks collection                   │                    │
│  │ {                                   │                    │
│  │   _id: "abc123",                    │                    │
│  │   registrationNumber: "TX-999-ZZ",  │                    │
│  │   brand: "Volvo",                   │                    │
│  │   model: "FH16",                    │                    │
│  │   year: 2024,                       │                    │
│  │   createdAt: "2024-12-11T..."       │                    │
│  │ }                                   │                    │
│  └─────────────────────────────────────┘                    │
│                    ↓                                          │
│  Return Response:                                            │
│  { success: true, data: { ...truck } }                      │
│                                                               │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │ HTTP Response
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ FRONTEND                                                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Redux receives response                                     │
│                    ↓                                          │
│  Updates state:                                              │
│  state.trucks.push(newTruck)                                │
│                    ↓                                          │
│  React re-renders                                            │
│                    ↓                                          │
│  User sees new truck in list ✅                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🗂️ 6. File Relationships

### Frontend Files:
```
pages/TrucksPage.tsx
    ↓ uses
store/hooks.ts (useAppDispatch, useAppSelector)
    ↓ dispatches
store/slices/trucksSlice.ts (fetchTrucks, createTruck)
    ↓ calls
services/api.ts (getTrucks, createTruck)
    ↓ sends HTTP to
Backend API
```

### Backend Files:
```
app.js (Express app)
    ↓ registers
routes/truckRoutes.js
    ↓ uses
middleware/authMiddleware.js (protect, adminOnly)
middleware/validationMiddleware.js (validate)
    ↓ calls
controllers/truckController.js
    ↓ uses
models/Truck.js (Mongoose schema)
    ↓ queries
MongoDB Database
```

---

## 🔑 7. Key Concepts

### 1. **Stateless Backend**
- Backend doesn't store user sessions
- Every request must include JWT token
- Token contains user info (id, role)

### 2. **Token-Based Auth**
- Access Token: Short-lived (15min), in memory
- Refresh Token: Long-lived (7 days), HttpOnly cookie + DB

### 3. **RESTful API**
- GET /api/trucks → List all
- GET /api/trucks/:id → Get one
- POST /api/trucks → Create
- PUT /api/trucks/:id → Update
- DELETE /api/trucks/:id → Delete

### 4. **Redux State Management**
- Frontend stores data in Redux
- Backend is source of truth
- Redux syncs with backend via API calls

### 5. **CORS (Cross-Origin)**
- Frontend: http://localhost:3002
- Backend: http://localhost:5000
- Backend allows frontend origin in CORS config

---

## 📝 8. Environment Variables

### Backend (.env):
```env
PORT=5000                              # Backend port
MONGO_URI=mongodb://localhost:27017    # Database
JWT_ACCESS_SECRET=secret123            # Token signing
JWT_ACCESS_EXPIRE=15m                  # Token lifetime
CORS_ORIGIN=http://localhost:3002      # Frontend URL
```

### Frontend (.env.local):
```env
VITE_API_URL=http://localhost:5000/api # Backend URL
```

---

## ✅ Summary

**Communication Flow:**
```
User Action → React Component → Redux → API Service → HTTP Request
    ↓
Backend Route → Middleware → Controller → Model → MongoDB
    ↓
HTTP Response → API Service → Redux → React Component → UI Update
```

**Key Points:**
1. ✅ Frontend and backend are separate applications
2. ✅ They communicate via HTTP/REST API
3. ✅ JWT tokens for authentication
4. ✅ Redux manages frontend state
5. ✅ MongoDB stores backend data
6. ✅ CORS allows cross-origin requests
7. ✅ Middleware handles security/validation

**Next:** Implement actual pages (Dashboard, Trucks, Trips) using this communication pattern! 🚀
