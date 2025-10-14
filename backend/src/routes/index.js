import express from 'express';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import visitRoutes from './visitRoutes.js';
import prescriptionRoutes from './prescriptionRoutes.js';
import scheduleRoutes from './scheduleRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import userRoutes from './userRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

// API Routes
router.use('/', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/visits', visitRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

// API Info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Healthcare System API v1.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      patients: '/api/v1/patients',
      appointments: '/api/v1/appointments',
      visits: '/api/v1/visits',
      prescriptions: '/api/v1/prescriptions',
      schedules: '/api/v1/schedules',
      notifications: '/api/v1/notifications',
      dashboard: '/api/v1/dashboard'
    }
  });
});

export default router;
