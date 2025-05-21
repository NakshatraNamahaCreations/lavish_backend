import express from 'express';
import { createOrder, getUserOrders, getUserUpcomingOrders, getUserPastOrders, getAllOrders, getOrderCount, getOrdersByStatus, getOrderDetailsbyId, cancelOrder, rescheduleOrder, getRecentOrders } from '../../controllers/order/orderController.js';

const router = express.Router();

// Create a new order
router.post('/create', createOrder);

// Cancel order route
router.put('/cancelOrder/:id', cancelOrder);

// Reschedule order route
router.put('/rescheduleOrder/:id', rescheduleOrder);  // Add route for rescheduling the order

// Get all orders for a user
router.get('/getuserOrders/:userId', getUserOrders);

// Get all orders
router.get('/', getAllOrders);


router.get('/getCount', getOrderCount);

// Get orders by status (created, rescheduled, etc.)
router.get('/getordersbystatus', getOrdersByStatus);

// Get order details by ID
router.get('/getOrderDetails/:id', getOrderDetailsbyId);


// Route to get upcoming orders for a user
router.get('/upcoming/:userId', getUserUpcomingOrders);

// Route to get past orders for a user
router.get('/past/:userId', getUserPastOrders);

router.get('/recent-orders', getRecentOrders);

export default router;
