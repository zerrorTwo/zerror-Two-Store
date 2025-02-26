import express from "express";

import { authentication } from "../../auth/authUtil.js";
import {
  createMomoPayment,
  verifyMomoPayment,
} from "../../controllers/paymentController.js";

const Router = express.Router();
// Tạo yêu cầu thanh toán MoMo (yêu cầu xác thực)
Router.post("/momo/create", createMomoPayment);

// Xác minh thông báo kết quả thanh toán từ MoMo (không yêu cầu xác thực, vì MoMo gửi trực tiếp)
Router.post("/momo/verify", verifyMomoPayment);

// Các route khác liên quan đến thanh toán có thể được thêm vào đây...

export const paymentRoute = Router;
