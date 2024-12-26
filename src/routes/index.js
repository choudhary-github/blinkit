import { authRoutes } from './auth.route.js';
import { productRoutes, categoryRoutes } from './product.js';
import { orderRoutes } from './order.js';

const prefix = '/api';

export const registerRoutes = async (fastify) => {
  fastify.register(authRoutes, { prefix });
  fastify.register(categoryRoutes, { prefix });
  fastify.register(productRoutes, { prefix });
  fastify.register(orderRoutes, { prefix });
};
