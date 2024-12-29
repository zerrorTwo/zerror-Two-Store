import mongoose, { Schema } from "mongoose";

const electronicsSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true }, // Thương hiệu
    model: { type: String, required: true }, // Model của sản phẩm
    warranty: { type: String }, // Thời gian bảo hành
    power: { type: String }, // Công suất
  },
  { timestamps: true }
);

const electronicsModel = mongoose.model("Electronics", electronicsSchema);

export default electronicsModel;
