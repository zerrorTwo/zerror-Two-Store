import cron from "node-cron";
import OrderModel from "../models/orderModel.js";
import { momoService } from "../services/momoService.js";

const checkAndRetryMomoPayment = async (order) => {
  try {
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 ngày

    if (orderAge >= sevenDaysInMs) {
      // Nếu quá 7 ngày chưa thanh toán -> Hủy đơn hàng
      order.state = "CANCELLED";
      order.paymentStatus = "UNPAID";
      await order.save();
      return;
    }

    // Gọi lại API tạo link thanh toán MoMo
    const newPaymentUrl = await momoService.createMomoPayment({
      orderId: order._id.toString(),
      amount: order.finalTotal,
      orderInfo: "Thanh toán đơn hàng",
      redirectUrl: `${process.env.FRONTEND_URL}/thanks`,
      ipnUrl:
        process.env.MOMO_IPN_URL ||
        `${process.env.BACKEND_URL}/v1/api/payment/momo/callback`,
      extraData: "",
    });

    order.paymentUrl = newPaymentUrl.payUrl;
    await order.save();
  } catch (error) {
    console.error(
      `Lỗi khi tạo lại link thanh toán cho đơn ${order._id}:`,
      error.message
    );
  }
};

cron.schedule("* * * * *", async () => {
  // Chạy mỗi 1 giờ

  const expiredOrders = await OrderModel.find({
    state: "PENDING",
    paymentStatus: "UNPAID",
    createdAt: { $lte: new Date(Date.now() - 1 * 60 * 1000) }, // Kiểm tra đơn đã tạo quá 15 phút
  });

  for (const order of expiredOrders) {
    await checkAndRetryMomoPayment(order);
  }
});
