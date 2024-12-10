import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to mongoDB ;) ");
  } catch (err) {
    console.error(`ERRROR: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
