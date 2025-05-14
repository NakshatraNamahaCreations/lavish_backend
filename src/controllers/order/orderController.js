// controllers/orderController.js
import Order from "../../models/order/Order.js"

export const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      eventDate,
      eventTime,
      pincode,
      balloonsColor,
      subTotal,
      grandTotal,
      paidAmount,
      dueAmount,
      deliveryCharges,
      couponDiscount,
      gstAmount,
      paymentType,
      address,
      customerName,
      customerId,
      items
    } = req.body;


    const order = new Order({
      orderId,
      eventDate,
      eventTime,
      pincode,
      balloonsColor,
      subTotal,
      grandTotal,
      paidAmount,
      dueAmount,
      deliveryCharges,
      couponDiscount,
      gstAmount,
      paymentType,
      address,
      items,
      customerName,
      customerId
    });
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: "681db1b5117e43dd67dde994" }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query
    const orders = await Order.find({ orderStatus: status }).sort({ createdAt: -1 });
    console.log("Orders", orders)
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
};

// length of the orders.
export const getOrdersCount = async (req, res) => {
  try {
    const orders = await Order.find();
    const total = orders.length;

    return res.status(200).json({
      success: true,
      total,
    });
  } catch (error) {
    console.error("Error counting orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to count orders",
      error: error.message,
    });
  }
};

// Controller for fetching orders by event date, with search and pagination
export const getOrdersByStatus = async (req, res) => {
  try {
    const { eventDate, search, page = 1, limit = 10, status } = req.query;

    if (!status) {
      return res.status(400).json({ message: 'Order status is required' });
    }

    if (status === 'created' && !eventDate) {
      return res.status(400).json({ message: 'Event date is required when status is "created"' });
    }


    const searchConditions = {
      $and: [
        // Apply eventDate only if the status is "created"
        ...(status === 'created' && eventDate ? [{ eventDate }] : []),

        // Filter by orderStatus based on the status passed in the query
        { orderStatus: status },

        // If there's a search term, apply the search condition
        ...(search ? [{
          $or: [
            { orderId: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } },
          ]
        }] : [])
      ]
    };


    const skip = (page - 1) * limit;

    const orders = await Order.find(searchConditions)
      .skip(skip)
      .limit(Number(limit))
      .sort({ eventTime: 1 });

    const totalOrders = await Order.countDocuments(searchConditions);
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching orders by event date:', error);
    res.status(500).json({ message: 'Error fetching orders by event date', error: error.message });
  }
};

// get ordersDetails by order id
export const getOrderDetailsbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

//get Order Count
export const getOrderCount = async (req, res) => {
  try {
    const totalCount = await Order.countDocuments();
    console.log("Total number of documents:", totalCount);
    return res.status(200).json({
      success: true,
      count: totalCount
    })
  } catch (error) {
    console.log("Error", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Order Count",
      error: error.message,
    });
  }
}

// cancel order with id
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body; // Assuming the reason comes from the request body
    const canceledDate = new Date(); // Set the current date as the canceled date

    // Validate input
    if (!id || !reason) {
      return res.status(400).json({ message: "Order ID and reason are required" });
    }

    // Find the order by ID
    const order = await Order.findOne({ _id: id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status to 'canceled' and add reason and canceledDate
    order.orderStatus = "cancelled";
    order.reason = reason;
    order.canceledDate = canceledDate;

    // Save the updated order
    await order.save();

    return res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ message: "Failed to cancel the order", error: error.message });
  }
};

export const rescheduleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { rescheduledDate, rescheduledAddress, reason } = req.body;

    // Validate input
    if (!id || (!rescheduledDate && !rescheduledAddress) || !reason) {
      return res.status(400).json({
        message: "Order ID, at least one of rescheduled date or address, and reason are required"
      });
    }

    // Find the order by ID
    const order = await Order.findOne({ _id: id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order with new rescheduled details
    order.rescheduledEventDate = rescheduledDate;
    order.rescheduledAddress = rescheduledAddress;
    order.reason = reason;
    order.orderStatus = "rescheduled"; // Optionally, you can set the order status to "rescheduled"

    // Save the updated order
    await order.save();

    return res.json({ message: "Order rescheduled successfully", order });
  } catch (error) {
    console.error("Error rescheduling order:", error);
    res.status(500).json({ message: "Failed to reschedule the order", error: error.message });
  }
};





