import crypto from "crypto";
import https from "https";
import dotenv from "dotenv";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/order.model.js";
import MomoModel from "../models/momo.model.js";
import { findOrderById } from "../repositories/order.repository.js";

dotenv.config();

const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;

const createMomoPayment = async ({
  orderId,
  amount,
  orderInfo,
  redirectUrl,
  ipnUrl,
  extraData = "",
}) => {
  try {
    const requestId = partnerCode + new Date().getTime();
    const requestType = "payWithATM";
    const lang = "en";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang,
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "test-payment.momo.vn",
        port: 443,
        path: "/v2/gateway/api/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => resolve(JSON.parse(body)));
      });

      req.on("error", (e) =>
        reject(new ApiError(StatusCodes.BAD_REQUEST, e.message))
      );
      req.write(requestBody);
      req.end();
    });
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const verifyMomoPayment = (data) => {
  try {
    const { signature, ...params } = data;

    const rawSignature = `accessKey=${accessKey}&amount=${params.amount}&extraData=${params.extraData}&message=${params.message}&orderId=${params.orderId}&orderInfo=${params.orderInfo}&orderType=${params.orderType}&partnerCode=${params.partnerCode}&payType=${params.payType}&requestId=${params.requestId}&responseTime=${params.responseTime}&resultCode=${params.resultCode}&transId=${params.transId}`;

    // Generate signature
    const genSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    return genSignature === signature;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const handleMomoCallback = async (req) => {
  try {
    const {
      orderId,
      transId,
      amount,
      partnerCode,
      payType,
      resultCode,
      message,
      responseTime,
      extraData,
    } = req.body;

    if (!verifyMomoPayment(req.body)) {
      return { success: false, message: "Invalid signature" };
    }

    const order = await findOrderById(orderId);
    if (!order) {
      return { success: false, message: "Order not found" };
    }

    order.paymentStatus = resultCode === 0 ? "PAID" : "FAILED";
    order.state = resultCode === 0 ? "CONFIRMED" : "FAILED";
    await order.save();

    // Lưu thông tin giao dịch MoMo vào database
    await MomoModel.create({
      orderId,
      transId,
      amount,
      partnerCode,
      payType,
      resultCode,
      message,
      responseTime,
      extraData,
    });

    return {
      success: true,
      message: resultCode === 0 ? "Payment successful" : "Payment failed",
    };
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const transactionStatus = async (orderId) => {
  try {
    const requestId = `${partnerCode}-${Date.now()}`;

    // Tạo rawSignature theo yêu cầu của Momo
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;

    // Mã hóa signature bằng HMAC SHA256
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // Tạo request body
    const requestBody = JSON.stringify({
      partnerCode,
      requestId,
      orderId,
      lang: "en",
      signature,
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "test-payment.momo.vn",
        port: 443,
        path: "/v2/gateway/api/query",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => resolve(JSON.parse(body)));
      });

      req.on("error", (e) =>
        reject(new ApiError(StatusCodes.BAD_REQUEST, e.message))
      );
      req.write(requestBody);
      req.end();
    });
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const momoService = {
  createMomoPayment,
  verifyMomoPayment,
  handleMomoCallback,
  transactionStatus,
};
