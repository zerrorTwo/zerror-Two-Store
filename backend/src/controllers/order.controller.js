import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import { orderService } from "../services/order.service.js";

const getProductCheckout = asyncHandeler(async (req, res) => {
  const products = await orderService.getProductCheckout(req.userId);
  res.status(StatusCodes.OK).json(products);
});

const createOrder = asyncHandeler(async (req, res) => {
  const data = req.body;
  console.log(data);
  data.userId = req.userId;
  const products = await orderService.createOrder(data);
  res.status(StatusCodes.CREATED).json(products);
});

const getUserOrder = asyncHandeler(async (req, res) => {
  const { page, limit, filter } = req.query;
  const orders = await orderService.getUserOrder(req.userId, page, limit, filter);
  res.status(StatusCodes.OK).json(orders);
});

const getAllOrders = asyncHandeler(async (req, res) => {
  const { page, limit, search } = req.query;
  const orders = await orderService.getAllOrders(page, limit, search);
  res.status(StatusCodes.OK).json(orders);
});

const getOrderById = asyncHandeler(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderById(orderId);
  res.status(StatusCodes.OK).json(order);
});

const getUserTotalOrder = asyncHandeler(async (req, res) => {
  const { time } = req.query;
  const orders = await orderService.getUserTotalOrder(req.userId, time);
  res.status(StatusCodes.OK).json(orders);
});

const updateOrderState = asyncHandeler(async (req, res) => {
  const { orderId, state } = req.body;
  const order = await orderService.updateOrderState(orderId, state);
  res.status(StatusCodes.OK).json(order);
});

const updateOrderDeliveryState = asyncHandeler(async (req, res) => {
  const { orderId, deliveryState } = req.body;
  const order = await orderService.updateOrderDeliveryState(
    orderId,
    deliveryState
  );
  res.status(StatusCodes.OK).json(order);
});

const getRecentOrders = asyncHandeler(async (req, res) => {
  const { limit = 10 } = req.query;
  const orders = await orderService.getRecentOrders(parseInt(limit));
  res.status(StatusCodes.OK).json(orders);
});

export  {
  getProductCheckout,
  createOrder,
  getUserTotalOrder,
  getUserOrder,
  getAllOrders,
  getOrderById,
  updateOrderState,
  updateOrderDeliveryState,
  getRecentOrders,
};
