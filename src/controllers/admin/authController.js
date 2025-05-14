import bcrypt from "bcryptjs";
import Admin from "../../models/admin/Admin.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET
    // { expiresIn: "2m"}
    // { expiresIn: process.env.JWT_EXPIRATION }
  );
};


export const register = async (req, res) => {
  try {
    const { email, mobile, password, name, accessTabs = [] } = req.body;

    // Validate mobile number
    if (!mobile || isNaN(mobile) || mobile.length !== 10) {
      return res.status(400).json({ message: "Invalid 10-digit mobile number" });
    }

    // Validate name
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if email or mobile already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { mobile }] });
    if (existingAdmin) {
      return res.status(400).json({ message: existingAdmin.email === email ? "Email already exists" : "Mobile number already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile image upload (if provided)
    let profileImagePath = req.file ? req.file.filename : ""; // Default to empty string if no file uploaded

    // Ensure accessTabs is always an array
    let parsedAccessTabs = Array.isArray(accessTabs) ? accessTabs : JSON.parse(accessTabs || '[]');

    // Create new admin record
    const admin = new Admin({
      name,
      mobile,
      email,
      password: hashedPassword,
      isActive: true,
      profileImage: profileImagePath, 
      accessTabs: parsedAccessTabs, 
    });

    // Save the new admin to the database
    await admin.save();

    // Generate access token
    const accessToken = generateAccessToken(admin);

    // Send response with admin details and token
    res.status(201).json({
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        profileImage: admin.profileImage, // Image filename
        accessTabs: admin.accessTabs
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering Admin", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if either email or mobile already exists using $or
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin)
      return res.status(400).json({ message: "Invalid credentials" });

    // Validate password
    const isMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    existingAdmin.isActive = true;
    await existingAdmin.save();

    // Generate Access Token
    const accessToken = generateAccessToken(existingAdmin);

    // Send response
    res.status(201).json({
      accessToken,
      admin: {
        id: existingAdmin._id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        mobile: existingAdmin.mobile,
        profileImage: existingAdmin.profileImage,
        accessTabs: existingAdmin.accessTabs,
        isActive: existingAdmin.isActive,
      },
    });
    // make the token expiry after 1hr
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const logout = async (req, res) => {
  try {
    // console.log("AdminId:", req.admin.id)
    const adminId = req.admin.id;
    if (!adminId)
      return res.status(404).json({ message: "Admin not found ", adminId });

    await Admin.findByIdAndUpdate(adminId, { isActive: false }, { new: true });

    res.status(200).json({ message: "Admin Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
};


export const getAllteamsMember = async (req, res) => {
  try {
    const admins = await Admin.find({}, "-password");

    res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin users",
      error: error.message,
    });
  }
};

