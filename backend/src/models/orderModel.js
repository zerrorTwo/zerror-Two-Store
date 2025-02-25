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
        "PROCESSING", // Đang xử lý
        "SHIPPED", // Đã giao cho đơn vị vận chuyển
        "IN_TRANSIT", // Đang giao hàng
        "DELIVERED", // Đã giao thành công
        "FAILED", // Giao hàng thất bại
        "RETURNED", // Trả hàng
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

    // Tổng giá trị đơn hàng
    totalItems: { type: Number, required: true, default: 0 }, // Tổng số sản phẩm
    totalPrice: { type: Number, required: true, default: 0 }, // Tổng tiền hàng
    totalDiscount: { type: Number, required: true, default: 0 }, // Tổng tiền giảm giá
    finalTotal: { type: Number, required: true, default: 0 }, // Tổng tiền thanh toán sau giảm giá

    // Ghi chú đơn hàng
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const OrderModel =
  mongoose.models.order || mongoose.model("Order", orderSchema);

export default OrderModel;
