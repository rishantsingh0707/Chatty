import { Router } from 'express';
import { signup, logout, login, updateProfile, checkRoute, searchByCode } from '../controller/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.middleware.js';

const router = Router();

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.put('/update-profile', protectedRoute, updateProfile);

router.get("/check", protectedRoute, checkRoute);

router.get("/search/:code", protectedRoute, searchByCode);

export default router;