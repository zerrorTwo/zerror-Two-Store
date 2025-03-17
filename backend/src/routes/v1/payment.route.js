import express from "express";

import { authentication } from "../../auth/auth.util.js";
import {
  callbackMomoPayment,
  createMomoPayment,
  transactionStatus,
  verifyMomoPayment,
} from "../../controllers/payment.controller.js";

const Router = express.Router();
// Tạo yêu cầu thanh toán MoMo (yêu cầu xác thực)
Router.post("/momo/create", createMomoPayment);

// Xác minh thông báo kết quả thanh toán từ MoMo (không yêu cầu xác thực, vì MoMo gửi trực tiếp)
Router.post("/momo/verify", verifyMomoPayment);
Router.post("/momo/callback", callbackMomoPayment);
Router.post("/momo/transaction-status", transactionStatus);

// Các route khác liên quan đến thanh toán có thể được thêm vào đây...

export const paymentRoute = Router;
