import mongoose from "mongoose";
import "dotenv/config";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Successfully Connected with MongoDB");
  } catch (e) {
    console.log("MongoDB connection Failed ", e);
  }
};
