# Smart Healthcare System - Backend API

A comprehensive healthcare management backend built with Express.js, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.x
- MongoDB >= 5.x
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```
Edit `.env` file with your configuration:
- MongoDB connection string
- JWT secret key
- CORS origin
- Other settings

4. **Start MongoDB** (if running locally)
```bash
mongod
```

5. **Run the server**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

6. **Seed database** (optional)
```bash
npm run seed
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── database.js  # MongoDB connection
│   ├── controllers/     # Route controllers
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── appointmentController.js
│   │   ├── visitController.js
│   │   ├── prescriptionController.js
│   │   ├── scheduleController.js
│   │   ├── notificationController.js
│   │   └── userController.js
│   ├── middlewares/     # Custom middleware
│   │   ├── auth.js      # JWT authentication
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   ├── Visit.js
│   │   ├── Prescription.js
│   │   ├── Schedule.js
│   │   └── Notification.js
│   ├── routes/          # API routes
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── visitRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   ├── scheduleRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   └── server.js        # App entry point
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "password123"
}
```

### Using the token
Include the token in the Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/logout` | Logout user | Private |
| GET | `/auth/me` | Get current user | Private |
| PUT | `/auth/profile` | Update profile | Private |
| PUT | `/auth/password` | Change password | Private |

### Patients
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/patients` | Get all patients | Private |
| GET | `/patients/:id` | Get patient by ID | Private |
| POST | `/patients` | Create patient | Nurse, Doctor, Admin |
| PUT | `/patients/:id` | Update patient | Nurse, Doctor, Admin |
| DELETE | `/patients/:id` | Delete patient | Admin |
| GET | `/patients/search?query=` | Search patients | Private |
| GET | `/patients/:id/history` | Get patient history | Private |

### Appointments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/appointments` | Get appointments | Private |
| GET | `/appointments/:id` | Get appointment | Private |
| POST | `/appointments` | Create appointment | Private |
| PATCH | `/appointments/:id` | Update appointment | Private |
| POST | `/appointments/:id/cancel` | Cancel appointment | Private |
| POST | `/appointments/:id/check-in` | Check-in patient | Nurse, Doctor |
| GET | `/appointments/availability` | Get available slots | Private |

### Visits
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/visits` | Create visit | Nurse, Doctor |
| GET | `/visits/:id` | Get visit | Private |
| PATCH | `/visits/:id` | Update visit | Nurse, Doctor |
| POST | `/visits/:id/triage` | Add triage data | Nurse, Doctor |
| POST | `/visits/:id/consultation` | Add consultation | Doctor |
| POST | `/visits/:id/complete` | Complete visit | Doctor |
| GET | `/visits/queue` | Get visit queue | Nurse, Doctor |

### Prescriptions
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/prescriptions` | Get prescriptions | Private |
| GET | `/prescriptions/:id` | Get prescription | Private |
| POST | `/prescriptions` | Create prescription | Doctor |
| POST | `/prescriptions/:id/sign` | Sign prescription | Doctor |
| POST | `/prescriptions/:id/dispense` | Dispense prescription | Pharmacist |
| POST | `/prescriptions/:id/cancel` | Cancel prescription | Doctor |

### Schedules
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/schedules` | Get schedules | Manager, Admin |
| GET | `/schedules/:id` | Get schedule | Private |
| POST | `/schedules` | Create schedule | Manager, Admin |
| PATCH | `/schedules/:id` | Update schedule | Manager, Admin |
| POST | `/schedules/:id/publish` | Publish schedule | Manager, Admin |
| GET | `/schedules/week` | Get weekly schedule | Private |

### Notifications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/notifications` | Get notifications | Private |
| PATCH | `/notifications/:id/read` | Mark as read | Private |
| PATCH | `/notifications/read-all` | Mark all as read | Private |
| DELETE | `/notifications/:id` | Delete notification | Private |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Manager, Admin |
| GET | `/users/:id` | Get user | Private |
| PATCH | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| GET | `/users/doctors` | Get all doctors | Private |

## 🎭 User Roles

- **patient**: Can book appointments, view records
- **nurse**: Check-in patients, record triage
- **doctor**: Full consultation access, prescriptions
- **manager**: Schedule management, resource allocation
- **pharmacist**: Dispense prescriptions
- **admin**: Full system access

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet.js security headers
- CORS protection
- Input validation
- Role-based access control

## ⚠️ Error Handling

The API uses consistent error handling with appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **express-validator**: Input validation
- **express-rate-limit**: Rate limiting
- **morgan**: HTTP request logger
- **dotenv**: Environment variables
- **date-fns**: Date manipulation

## 🚀 Deployment

### Environment Variables for Production
```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

### Build and Deploy
```bash
# Install production dependencies
npm ci --production

# Start production server
npm start
```

## 📊 Database Indexes

The application creates indexes automatically for optimal query performance:
- Patient MRN
- Appointment date and doctor
- Visit check-in time
- Prescription status
- Schedule week dates

## 🔄 Data Seeding

To populate the database with sample data:
```bash
npm run seed
```

This creates:
- Sample users (all roles)
- Patients
- Appointments
- Sample data for testing

## 📞 Support

For issues or questions, please create an issue in the repository.

## 📄 License

MIT License
