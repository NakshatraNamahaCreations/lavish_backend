import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'categoryType'  // Dynamically reference based on `categoryType`
  },
  serviceName: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String },
  categoryType: {
    type: String,
    required: true,
    enum: ['Service', 'Addon']  // Must match your actual model names
  }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true },
  rescheduledEventDate: { type: String },
  rescheduledAddress: { type: String },
  pincode: { type: String, required: true },
  balloonsColor: [String],
  subTotal: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  dueAmount: { type: Number, required: true },
  deliveryCharges: { type: Number, required: true },
  couponDiscount: { type: Number, default: 0 },
  gstAmount: { type: Number, required: true },

  orderStatus: {
    type: String,
    required: true,
    default: "created",

  },
  reason: { type: String },
  address: { type: String, required: true },
  customerName: { type: String },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [itemSchema]
}, { timestamps: true });



const Order = mongoose.model('Order', orderSchema);

export default Order;


// paymentOption: { type: String, required: true },
// paymentType: { type: String, required: true },