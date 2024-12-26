import { verifyToken } from '../middleware/auth.js';
import {
  createOrder,
  confirmOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/order/order.controller.js';

export const orderRoutes = async (fastify) => {
  fastify.addHook('preHandler', async (request, response) => {
    const isAuthenticated = await verifyToken(request, response);

    if (isAuthenticated === false) {
      return response.status(401).send({ message: 'Unauthorized' });
    }
  });

  fastify.get('/order', getOrders);
  fastify.post('/order', createOrder);
  fastify.get('/order/:orderId', getOrderById);
  fastify.patch('/order/:orderId/status', updateOrderStatus);
  fastify.post('/order/:orderId/confirm', confirmOrder);
};
