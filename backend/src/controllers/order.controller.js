import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import { orderService } from "../services/order.service.js";

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
  const { userId, page, limit, filter } = req.query;
  const orders = await orderService.getUserOrder(userId, page, limit, filter);
  res.status(StatusCodes.OK).json(orders);
});

const getUserTotalOrder = asyncHandeler(async (req, res) => {
  const { userId, time } = req.query;
  const orders = await orderService.getUserTotalOrder(userId, time);
  res.status(StatusCodes.OK).json(orders);
});

export { getProductCheckout, createOrder, getUserOrder, getUserTotalOrder };
