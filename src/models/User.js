import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  mobile: { type: String, required: true, },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  alternateMobile: { type: String },
  firstName: { type: String, },
  lastName: { type: String, },
  addressLine1: { type: String, },
  addressLine2: { type: String, },
  city: { type: String, },
  state: { type: String },
  landmark: { type: String },
  pincode: { type: String, },
  // country: { type: String },
  // profileImage: { type: String, },
});

export default mongoose.model("User", UserSchema);
