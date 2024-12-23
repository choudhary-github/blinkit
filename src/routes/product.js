import { getAllCategories } from '../controllers/product/category.controller.js';
import { getProductsbyCategoryId } from '../controllers/product/product.controller.js';

export const productRoutes = async (fastify) => {
  fastify.get('/products/:categoryId', getProductsbyCategoryId);
};

export const categoryRoutes = async (fastify) => {
  fastify.get('/categories', getAllCategories);
};
