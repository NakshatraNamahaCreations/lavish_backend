import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import {authenticateToken }  from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);

export default router;
