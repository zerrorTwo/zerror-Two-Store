import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { checkoutService } from "../services/checkoutService.js";

const getProductCheckout = asyncHandeler(async (req, res) => {
  const { userId } = req.query;
  const products = await checkoutService.getProductCheckout(userId);
  res.status(StatusCodes.OK).json(products);
});

const createOrder = asyncHandeler(async (req, res) => {
  const { userId } = req.query;
  const data = req.body;
  const products = await checkoutService.createOrder(userId, data);

  res.status(StatusCodes.OK).json(products);
});

export { getProductCheckout, createOrder };
