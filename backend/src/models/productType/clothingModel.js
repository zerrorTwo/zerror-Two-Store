import mongoose, { Schema } from "mongoose";

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    color: { type: String },
    size: { type: String },
    material: { type: String },
  },
  { timestamps: true }
);

const ClothingModel = mongoose.model("Clothing", clothingSchema);

export default ClothingModel;
