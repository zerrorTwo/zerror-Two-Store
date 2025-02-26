import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { momoService } from "../services/momoService.js";
import ApiError from "../utils/ApiError.js";

const createMomoPayment = asyncHandeler(async (req, res) => {
  const amount = "50000"; // Hardcode amount
  const orderInfo = "Test payment with MoMo"; // Hardcode orderInfo
  const redirectUrl = "https://your-website.com/return"; // Hardcode redirectUrl
  const ipnUrl = "https://your-website.com/notify"; // Hardcode ipnUrl
  const extraData = ""; // Hardcode extraData

  try {
    const response = await momoService.createMomoPayment({
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

export { createMomoPayment, verifyMomoPayment };
