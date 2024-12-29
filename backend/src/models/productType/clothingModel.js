import mongoose, { Schema } from "mongoose";

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
  },
  { timestamps: true }
);

const clothingModel = mongoose.model("Clothing", clothingSchema);

export default clothingModel;
