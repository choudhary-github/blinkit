import { Product } from '../../models/index.js';

export const getProductsbyCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const product = await Product.find({ category: categoryId })
      .select('-category')
      .exec();

    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    return res
      .status(200)
      .send({ message: 'Product fetched successfully', product });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
