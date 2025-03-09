import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { momoService } from "../services/momoService.js";
import ApiError from "../utils/ApiError.js";

const createMomoPayment = asyncHandeler(async (req, res) => {
  const { orderId, orderInfo } = req.body;
  const redirectUrl = "http://localhost:5173/thanks";
  const ipnUrl =
    process.env.MOMO_IPN_URL ||
    "https://93b5-125-235-232-178.ngrok-free.app/v1/api/payment/momo/callback";
  const extraData = "";

  try {
    const response = await momoService.createMomoPayment({
      orderId,
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
