import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { momoService } from "../services/momoService.js";
import ApiError from "../utils/ApiError.js";

const createMomoPayment = asyncHandeler(async (req, res) => {
  const amount = "50000"; // Hardcode amount
  const orderInfo = "Test payment with MoMo"; // Hardcode orderInfo
  const redirectUrl = "http://localhost:5173/thanks"; // Hardcode redirectUrl
  const ipnUrl =
    "https://d48c-112-197-30-44.ngrok-free.app/v1/api/payment/momo/callback"; // Hardcode ipnUrl
  const extraData = ""; // Hardcode extraData
  const orderId = Math.random().toString(36).substr(2, 9); // Generate random orderId

  try {
    const response = await momoService.createMomoPayment({
      orderId,
      amount,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
    });
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error(error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create Momo payment"
    );
  }
});

const verifyMomoPayment = asyncHandeler(async (req, res) => {
  try {
    const result = await momoService.verifyMomoPayment(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to verify Momo payment"
    );
  }
});

const callbackMomoPayment = asyncHandeler(async (req, res) => {
  try {
    const result = await momoService.handleMomoCallback(req);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to verify Momo payment"
    );
  }
});

const transactionStatus = asyncHandeler(async (req, res) => {
  try {
    const { orderId } = req.body;
    const result = await momoService.transactionStatus(orderId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to verify Momo payment"
    );
  }
});

export {
  createMomoPayment,
  verifyMomoPayment,
  callbackMomoPayment,
  transactionStatus,
};
