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

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    products: [cartItemSchema],

    // Trạng thái đơn hàng
    state: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },

    // Trạng thái vận chuyển
    deliveryState: {
      type: String,
      enum: [
        "PROCESSING",
        "SHIPPED",
        "IN_TRANSIT",
        "DELIVERED",
        "FAILED",
        "RETURNED",
        "CANCELLED",
      ],
      default: "PROCESSING",
    },

    // Địa chỉ giao hàng
    addressId: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    // Thanh toán
    paymentMethod: {
      type: String,
      enum: ["CASH", "MOMO", "VNPAY", "ZALOPAY", "BANK_TRANSFER"],
      default: "CASH",
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "REFUNDED"],
      default: "UNPAID",
    },

    deliveryFee: { type: Number, required: true, default: 30000 },
    deliveryDate: { type: Date },

    // Tổng giá trị đơn hàng
    totalItems: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    totalDiscount: { type: Number, required: true, default: 0 },
    finalTotal: { type: Number, required: true, default: 0 },

    // Ghi chú đơn hàng
    notes: { type: String, default: "" },

    paymentUrl: { type: String, default: "" },
    momoRequestId: { type: String, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual("canReview").get(function () {
  if (!this.deliveryDate) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.deliveryDate >= sevenDaysAgo;
});

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;
