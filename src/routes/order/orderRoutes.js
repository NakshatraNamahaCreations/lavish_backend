import express from 'express';
import { createOrder, getUserOrders, getAllOrders, getOrderCount, getOrdersByStatus, getOrderDetailsbyId, cancelOrder, rescheduleOrder } from '../../controllers/order/orderController.js';

const router = express.Router();

// Create a new order
router.post('/create', createOrder);

// Get all orders for a user
router.get('/getuserOrders', getUserOrders);

// Get all orders
router.get('/', getAllOrders);


router.get('/getCount', getOrderCount);


// Get orders by status (created, rescheduled, etc.)
router.get('/getordersbystatus', getOrdersByStatus);

// Get order details by ID
router.get('/getOrderDetails/:id', getOrderDetailsbyId);

// Cancel order route
router.put('/cancelOrder/:id', cancelOrder);

// Reschedule order route
router.put('/rescheduleOrder/:id', rescheduleOrder);  // Add route for rescheduling the order

export default router;
