import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variations: [
      {
        type: { type: Object },
        price: { type: Number },
        quantity: { type: Number, required: true, default: 1 },
        checkout: { type: Boolean, required: true, default: false },
      },
    ],
  },
  { _id: false, timestamps: true }
);

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
