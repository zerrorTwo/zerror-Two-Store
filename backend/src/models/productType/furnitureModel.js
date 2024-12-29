import mongoose, { Schema } from "mongoose";

const furnitureSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true }, // Thương hiệu
    material: { type: String, required: true }, // Chất liệu
    dimensions: { type: String }, // Kích thước
    weight: { type: Number }, // Cân nặng
  },
  { timestamps: true }
);

const furnitureModel = mongoose.model("Furniture", furnitureSchema);

export default furnitureModel;
