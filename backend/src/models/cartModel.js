import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  variations: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    products: [cartItemSchema],
    state: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "FAILED", "PENDING"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const CartModel = mongoose.models.cart || mongoose.model("Cart", cartSchema);

export default CartModel;
