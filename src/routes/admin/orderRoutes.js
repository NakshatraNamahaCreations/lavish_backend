import express from 'express';
import { createOrder , getAllOrders, getOrderswithpageination, getOrderDetailsById} from '../../controllers/admin/orderController.js';

const router = express.Router();

router.post('/create', createOrder);
router.get('/', getAllOrders);
router.get('/paginated', getOrderswithpageination);
router.get('/order/:id', getOrderDetailsById);
// router.put('/order/:id', updateOrder);

export default router;
