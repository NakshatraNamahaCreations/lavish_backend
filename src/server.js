import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Import DB connection and routes
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminAuthRoutes from "./routes/admin/authRoutes.js";
import userRoutes from "./routes/admin/userRoutes.js";


// Import category routes
import categoryRoutes from "./routes/category/categoryRoutes.js";
import subCategoryRoutes from "./routes/category/subCategoryRoutes.js";
import subSubCategoryRoutes from "./routes/category/subSubCategoryRoutes.js";
import themeRoutes from "./routes/category/themeRoutes.js";
import balloonRoutes from "./routes/category/balloonRoutes.js";
import addonsRoutes from "./routes/serviceManagement/addonsRoutes.js";
import couponRoutes from "./routes/serviceManagement/couponRoutes.js";
import serviceRoutes from "./routes/serviceManagement/serviceRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import orderRoutes from "./routes/order/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// ✅ Serve static files from the public directory
app.use(express.static("public"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/users", userRoutes);


// Category Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/subsubcategories", subSubCategoryRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/balloons", balloonRoutes);
app.use("/api/addons", addonsRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/orders", orderRoutes);

// Root
app.get("/", (req, res) => res.send("🚀 Lavish Events Auth Server Running!"));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
