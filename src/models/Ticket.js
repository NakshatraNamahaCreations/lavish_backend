import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  mobileNumber: Number,


}, { timestamps: true });


const Ticket = mongoose.model("Ticket", TicketSchema);

export default Ticket;

  // images: [String], 