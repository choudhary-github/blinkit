import "dotenv/config.js";
import mongoose from "mongoose";
import { Category, Product } from "./src/models/index.js";
import { categories, products } from "./seedData.js";

async function seedDB(params) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Category.deleteMany();

    const categoryDocs = await Category.insertMany(categories);

    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    const productWithCategoryId = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    const ProductDocs = await Product.insertMany(productWithCategoryId);
    console.log(ProductDocs);
  } catch (error) {
    console.log("from seedScript" + error);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
