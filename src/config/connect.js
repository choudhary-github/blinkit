import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("DB connected ✅");
    });
  } catch (error) {
    console.log("DB Connection error ❌", error);
  }
};

export { connectDB };
