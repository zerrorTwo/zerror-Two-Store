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
      console.log(`Đã hủy đơn hàng ${order._id} do quá hạn thanh toán.`);
      return;
    }

    console.log(`Đang kiểm tra lại đơn hàng ${order._id}`);

    // Gọi lại API tạo link thanh toán MoMo
    const newPaymentUrl = await momoService.createMomoPayment({
      orderId: order._id.toString(),
      amount: order.finalTotal,
      orderInfo: "Thanh toán đơn hàng",
      redirectUrl: "http://localhost:5173/thanks",
      ipnUrl:
        process.env.MOMO_IPN_URL ||
        "http://localhost:5000/v1/api/payment/momo/callback",
      extraData: "",
    });

    order.paymentUrl = newPaymentUrl.payUrl;
    await order.save();

    console.log(`Đã tạo lại link thanh toán mới cho đơn hàng ${order._id}`);
  } catch (error) {
    console.error(
      `Lỗi khi tạo lại link thanh toán cho đơn ${order._id}:`,
      error.message
    );
  }
};

cron.schedule("* * * * *", async () => {
  // Chạy mỗi 1 giờ
  console.log("Kiểm tra các đơn hàng MoMo chưa thanh toán...");

  const expiredOrders = await OrderModel.find({
    state: "PENDING",
    paymentStatus: "UNPAID",
    createdAt: { $lte: new Date(Date.now() - 1 * 60 * 1000) }, // Kiểm tra đơn đã tạo quá 15 phút
  });

  for (const order of expiredOrders) {
    await checkAndRetryMomoPayment(order);
  }
});
