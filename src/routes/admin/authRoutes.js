import express from 'express';
import { register, login , logout} from '../../controllers/admin/authController.js';
import { adminauthenticateToken } from '../../middleware/admin/authMiddleware.js';  // If needed for protected routes

const router = express.Router();

router.post('/register', register);
router.post('/login', login);  
router.post('/logout', adminauthenticateToken,  logout);  

export default router;
