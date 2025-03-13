import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminAuthRoutes from "./routes/admin/authRoutes.js";
import userRoutes from "./routes/admin/userRoutes.js";
import orderRoutes from "./routes/admin/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/orders', orderRoutes);

app.get("/", (req, res) => res.send("🚀 Lavish Events Auth Server Running!"));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
