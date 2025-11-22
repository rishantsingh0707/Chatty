
import {Router} from 'express';
import {getUserForSidebar,getMessage,sendMessage} from '../controller/message.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.middleware.js';
const router = Router();

router.get('/', protectedRoute,getUserForSidebar);

router.get('/:id', protectedRoute,getMessage);

router.post('/send/:id',protectedRoute,sendMessage);
export default router;
