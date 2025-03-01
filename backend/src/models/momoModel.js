import mongoose from "mongoose";

const momoTransactionSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // Mã đơn hàng trên hệ thống của bạn
    transId: { type: String, required: true, unique: true }, // Mã giao dịch MoMo
    amount: { type: Number, required: true }, // Số tiền giao dịch
    partnerCode: { type: String, required: true }, // Mã đối tác MoMo
    payType: { type: String }, // Loại thanh toán (MoMo Wallet, ATM, QR, v.v.)
    resultCode: { type: Number, required: true }, // Trạng thái giao dịch (0 = Thành công)
    message: { type: String }, // Thông báo từ MoMo
    responseTime: { type: Date, default: Date.now }, // Thời gian phản hồi từ MoMo
    extraData: { type: String }, // Dữ liệu thêm do bạn gửi khi thanh toán
  },
  { timestamps: true } // Thêm createdAt & updatedAt
);

// Kiểm tra model đã tồn tại chưa để tránh lỗi khi import nhiều lần
const MomoTransaction =
  mongoose.models.MomoTransaction ||
  mongoose.model("MomoTransaction", momoTransactionSchema);

export default MomoTransaction;
