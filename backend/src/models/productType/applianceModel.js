import mongoose, { Schema } from "mongoose";

const applianceSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true }, // Thương hiệu
    type: { type: String, required: true }, // Loại thiết bị (ví dụ: Máy giặt, Lò vi sóng)
    energyRating: { type: String }, // Xếp hạng năng lượng
    capacity: { type: String }, // Dung tích
  },
  { timestamps: true }
);

const applianceModel = mongoose.model("Appliance", applianceSchema);

export default applianceModel;
