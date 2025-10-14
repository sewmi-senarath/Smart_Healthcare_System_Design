import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDoctors
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/doctors', getDoctors);

router.route('/')
  .get(authorize('manager', 'admin'), getUsers);

router.route('/:id')
  .get(getUser)
  .patch(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

export default router;
