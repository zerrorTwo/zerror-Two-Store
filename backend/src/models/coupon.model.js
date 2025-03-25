import mongoose from "mongoose";


const couponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true },
  start_day: { type: Date, required: true },
  end_day: { type: Date, required: true },
  type: { type: String, required: true, enum: ["PERCENT", "AMOUNT"], default: "AMOUNT"},
  discount: { type: Number, required: true },
  max_discount: { type: Number, required: true },
  min_value: { type: Number, required: true },
  max_uses: { type: Number, required: true },
  max_uses_per_user: { type: Number, default: 1 },
  target_type: { type: String, required: true, enum: ["FREESHIPPING", "PRODUCT", "ORDER"], default: "PRODUCT" },
  uses_count: { type: Number, default: 0 },
  user_uses: { type: Array, default: [] },
  target_ids: { type: Array, default: [] },
  is_public: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  
}, { timestamps: true });

const CouponModel = mongoose.models.coupon || mongoose.model("Coupon", couponSchema);

export default CouponModel;
