import bcrypt from "bcryptjs";
import Admin from "../../models/admin/Admin.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = (admin) => {
    return jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    )
}

export const register = async (req, res) => {
    try {
        const { email, mobile, password } = req.body;

        if (!mobile || isNaN(mobile)) {
            return res.status(400).json({ message: "Mobile number must be a valid number" });
        }

        if (mobile.length < 10 || mobile.length > 10) {
            return res.status(400).json({ message: "Mobile number must be 10 digits" });
        }

        // Check if either email or mobile already exists using $or
        const existingAdmin = await Admin.findOne({
            $or: [{ email }, { mobile }],
        });

        if (existingAdmin) {
            // Determine which field caused the conflict
            if (existingAdmin.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (existingAdmin.mobile === mobile) {
                return res.status(400).json({ message: "Mobile number already exists" });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const admin = new Admin({
            mobile,
            email,
            password: hashedPassword,
            isActive: true,
        });

        // Save the admin in the database
        await admin.save();

        // Generate Access Token
        const accessToken = generateAccessToken(admin);

        // Send response
        res.status(201).json({
            accessToken,
            admin: {
                id: admin._id,
                email: admin.email,
                mobile: admin.mobile,
            },
        });

    } catch (error) {
        console.log("err:", error);
        res.status(500).json({ message: "Error registering Admin", error: error.message });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if either email or mobile already exists using $or
        const existingAdmin = await Admin.findOne({ email });

        if (!existingAdmin) return res.status(400).json({ message: "Invalid credentials" });

        // Validate password
        const isMatch = await bcrypt.compare(password, existingAdmin.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

        existingAdmin.isActive = true;
        await existingAdmin.save();

        // Generate Access Token
        const accessToken = generateAccessToken(existingAdmin);

        // Send response
        res.status(201).json({
            accessToken,
            admin: {
                id: existingAdmin._id,
                email: existingAdmin.email,
                mobile: existingAdmin.mobile,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in", error });
    }
};

export const logout = async (req, res) => {
    try {
        // console.log("AdminId:", req.admin.id)
        const adminId = req.admin.id;
        if (!adminId) return res.status(404).json({ message: "Admin not found ",adminId })

        await Admin.findByIdAndUpdate(adminId, { isActive: false }, { new: true })

        res.status(200).json({ message: "Admin Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error });
    }
}