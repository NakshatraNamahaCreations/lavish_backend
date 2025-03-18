import Order from '../../models/admin/Order.js';

export const createOrder = async (req, res) => {
    try {
        // const { customerId, orderId, serviceName, servicePrice, address, addons, totalPrice, status } = req.body;
        const order = await Order.create(req.body);
        res.status(201).json({ success: true, message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating order", error: error.message });
    }
}


export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching order", error: error.message });
    }
}

export const getOrderswithpageination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';

        const skip = (page - 1) * limit;

        // Build search query
        const searchQuery = search ? {
            $or: [
                { orderId: { $regex: search, $options: 'i' } },
                // { mobile: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const orders = await Order.find(searchQuery).skip(skip).limit(limit).populate('customerId', 'email mobile firstName lastName ');
        const totalOrders = await Order.countDocuments(searchQuery);
        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    totalOrders,
                    totalPages: Math.ceil(totalOrders / limit),
                    currentPage: page,
                    limit,
                    searchQuery: search
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching order", error: error.message });
    }
}

export const getOrderDetailsById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customerId', 'email mobile firstName lastName ');// populate the customer data (you can specify the fields you want)


        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching order", error: error.message });
    }
}


// export const getOrderById = async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id);
//         res.status(200).json({ success: true, order });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Error fetching order", error: error.message });
//     }
// }


