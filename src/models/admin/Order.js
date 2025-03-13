import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        unique: true,
        default: function () {
            // return 'ORD-' + Date.now().toString(36).substring(2, 15);
            return 'ORD-' + Date.now().toString(36)
        }
    },
    serviceName: {
        type: String,
        required: true
    },
    servicePrice: {
        type: Number,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
    },
    city: {
        type: String,

    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    pincode: {
        type: String,
    },
    addons: [
        {
            addonsName: {
                type: String,
            },
            addonsPrice: {
                type: Number,
            },
            addonsQuantity: {
                type: Number,
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

// Pre-save hook to calculate totalPrice before saving the document
// orderSchema.pre('save', function (next) {
//     let totalAddonsPrice = 0;
//     if (this.addons && this.addons.length > 0) {
//         totalAddonsPrice = this.addons.reduce((sum, addon) => {
//             return sum + addon.addonsPrice * addon.addonsQuantity;
//         }, 0);
//     }
//     this.totalPrice = this.servicePrice + totalAddonsPrice;
//     next();
// });

export default mongoose.model('Order', orderSchema);

