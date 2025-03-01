import crypto from "crypto";
import https from "https";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/orderModel.js";

dotenv.config();

const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const momoEndpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

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
    const signatureRaw = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    const genSignature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureRaw)
      .digest("hex");
    return genSignature === signature;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const handleMomoCallback = async (req) => {
  try {
    const { orderId, resultCode, signature } = req.body;
    if (!verifyMomoPayment({ orderId, resultCode, signature })) {
      return { success: false, message: "Invalid signature" };
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return { success: false, message: "Order not found" };
    }

    order.paymentStatus = resultCode === 0 ? "PAID" : "FAILED";
    order.state = resultCode === 0 ? "CONFIRMED" : "FAILED";
    await order.save();

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
    const endpoint = "https://test-payment.momo.vn/v2/gateway/api/query";

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
