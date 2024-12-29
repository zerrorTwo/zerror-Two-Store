import mongoose, { Schema } from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true }, // Thương hiệu
    expirationDate: { type: Date, required: true }, // Ngày hết hạn
    ingredients: { type: [String] }, // Thành phần
    isOrganic: { type: Boolean, default: false }, // Sản phẩm hữu cơ
  },
  { timestamps: true }
);

const FoodModel = mongoose.model("Food", foodSchema);

export default FoodModel;
