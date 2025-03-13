import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!mobile || isNaN(mobile)) {
      return res.status(400).json({ message: "Mobile number must be a valid number" });
    }

    if (mobile.length < 10 || mobile.length > 10) {
      return res.status(400).json({ message: "Mobile number must be 10 digits" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({ mobile, email, password: hashedPassword, isActive: true });
    await user.save();

    // Generate Access Token
    const accessToken = generateAccessToken(user);

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};



// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    user.isActive = true;
    await user.save();

    // Generate Access Token
    const accessToken = generateAccessToken(user);

    // Send response with access token and user details
    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};


// LOGOUT
export const logout = async (req, res) => {
  try {
    // console.log("Logging out user...",req.user.id);  

    const userId = req.user.id;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
    // await User.findOneAndUpdate({ _id: userId, isActive: false }, { new: true });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
};

