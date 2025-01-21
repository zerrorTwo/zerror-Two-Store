import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  state: {
    type: String,
    require: true,
    enum: ["ACTIVE", "INACTIVE", "FAILED", "PENDING"],
    default: "ACTIVE",
  },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  products: {
    type: Array,
    require: true,
    default: [],
  },
  totalPrice: { type: Number, require: true, default: 0 },
  totalQuantity: { type: Number, require: true, default: 0 },
});

const CartModel = mongoose.models.cart || mongoose.model("Cart", cartSchema);

export default CartModel;
