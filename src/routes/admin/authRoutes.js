import express from 'express';
import { register, login, logout, getAllteamsMember, updateAdmin, deleteAdmin, getAdminById } from '../../controllers/admin/authController.js';
import { adminauthenticateToken } from '../../middleware/admin/authMiddleware.js';  // If needed for protected routes
import upload from "../../middleware/multer/multer.js"
const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post('/login', login);
router.post('/logout', adminauthenticateToken, logout);
router.get('/teamMembers', getAllteamsMember);
router.put('/update/:id', updateAdmin);
router.delete('/delete/:id', deleteAdmin);
router.get('/getAdminById/:id', getAdminById);

export default router;
