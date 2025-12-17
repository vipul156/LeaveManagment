# Role-Based Leave Management System

A full-stack leave management system built with Vite + React (Frontend) and Express + MongoDB (Backend).

## Tech Stack

- **Frontend**: React with Vite, TailwindCSS, React Router DOM, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)

## Features

### User Roles

1. **Admin**
   - View all users and leave requests
   - Approve/reject any leave request
   - Create and manage leave policies
   - Set leave balances (global and individual)
   - Enable/disable user accounts
   - Create new users with any role

2. **Manager**
   - View and approve/reject team employee leave requests
   - Apply for own leave (requires Admin approval)
   - View leave policies

3. **Employee**
   - Apply for leave
   - View personal leave history and status
   - Cancel pending leave requests
   - View leave policies

### Leave Rules

- Leave status flow: Pending → Approved / Rejected
- Approved leaves decrement the user's available balance
- Employee leaves → Approved by Manager or Admin
- Manager leaves → Approved by Admin only

## Project Structure

```
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Role-based pages
│   │   │   ├── admin/
│   │   │   ├── manager/
│   │   │   └── employee/
│   │   └── utils/          # API utilities
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/             # Database config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── seed.js             # Database seeder
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/leave-management
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=5000
   ```

4. Seed the database (creates test users and policies):
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Test Credentials

After running the seed script:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Manager | manager@company.com | manager123 |
| Employee | employee@company.com | employee123 |
| Employee | bob@company.com | employee123 |

## API Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id/toggle-status` - Enable/disable user
- `GET /api/users/managers` - Get all managers

### Leave Requests
- `POST /api/leaves` - Create leave request
- `GET /api/leaves/my` - Get my leaves
- `GET /api/leaves/all` - Get all leaves (Admin)
- `GET /api/leaves/team` - Get team leaves (Manager)
- `PATCH /api/leaves/:id/status` - Update status
- `DELETE /api/leaves/:id` - Cancel leave

### Leave Policies
- `GET /api/policies` - Get all policies
- `POST /api/policies` - Create policy (Admin)
- `PUT /api/policies/:id` - Update policy (Admin)
- `DELETE /api/policies/:id` - Delete policy (Admin)

## Assumptions Made

1. Admin account is seeded via the seed script
2. New registrations default to "employee" role
3. Only Admin can create manager accounts
4. Leave balance is a simple integer representing days
5. Leave dates are inclusive (start and end dates both count)
6. Employees must be assigned to a manager for the manager approval flow
7. All authenticated users can view leave policies

## Security Features

- JWT-based authentication with token expiry
- Password hashing with bcrypt
- Role-based route protection (backend middleware)
- Protected routes (frontend)
- Account disable functionality
