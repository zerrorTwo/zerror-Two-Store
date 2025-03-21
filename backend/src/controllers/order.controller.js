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
  res.status(StatusCodes.CREATED).json(products);
});

const getUserOrder = asyncHandeler(async (req, res) => {
  const { userId, page, limit, filter } = req.query;
  const orders = await orderService.getUserOrder(userId, page, limit, filter);
  res.status(StatusCodes.OK).json(orders);
});

const getAllOrders = asyncHandeler(async (req, res) => {
  const { page, limit, search } = req.query;
  const orders = await orderService.getAllOrdersService(page, limit, search);
  res.status(StatusCodes.OK).json(orders);
});

const getOrderById = asyncHandeler(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderByIdService(orderId);
  res.status(StatusCodes.OK).json(order);
});

const getUserTotalOrder = asyncHandeler(async (req, res) => {
  const { userId, time } = req.query;
  const orders = await orderService.getUserTotalOrder(userId, time);
  res.status(StatusCodes.OK).json(orders);
});

const updateOrderState = asyncHandeler(async (req, res) => {
  const { orderId, state } = req.body;
  const order = await orderService.updateOrderStateService(orderId, state);
  res.status(StatusCodes.OK).json(order);
});

const updateOrderDeliveryState = asyncHandeler(async (req, res) => {
  const { orderId, deliveryState } = req.body;
  const order = await orderService.updateOrderDeliveryStateService(
    orderId,
    deliveryState
  );
  res.status(StatusCodes.OK).json(order);
});

export {
  getProductCheckout,
  createOrder,
  getUserOrder,
  getUserTotalOrder,
  getAllOrders,
  getOrderById,
  updateOrderState,
  updateOrderDeliveryState,
};
