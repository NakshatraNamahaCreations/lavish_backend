import mongoose from "mongoose";


const AdminSchema = new mongoose.Schema({
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false }
})

export default mongoose.model("Admin", AdminSchema)