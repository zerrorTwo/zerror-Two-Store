import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { orderService } from "../services/orderService.js";

const getProductCheckout = asyncHandeler(async (req, res) => {
  const { userId } = req.query;
  const products = await orderService.getProductCheckout(userId);
  res.status(StatusCodes.OK).json(products);
});

const createOrder = asyncHandeler(async (req, res) => {
  const data = req.body;
  const products = await orderService.createOrder(data);
  res.status(StatusCodes.OK).json(products);
});

const getUserOrder = asyncHandeler(async (req, res) => {
  const { userId } = req.query;
  const orders = await orderService.getUserOrder(userId);
  res.status(StatusCodes.OK).json(orders);
});

export { getProductCheckout, createOrder, getUserOrder };
