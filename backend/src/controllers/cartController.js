import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { cartService } from "../services/cartService.js";

const createCart = asyncHandeler(async (req, res) => {
  const { userId, products } = req.body;
  const cart = await cartService.addToCart(userId, products);
  res.status(StatusCodes.OK).json(cart);
});

const updateQuantity = asyncHandeler(async (req, res) => {
  const { userId, product } = req.body;
  const cart = await cartService.updateUserCartQuantity(userId, product);
  res.status(StatusCodes.OK).json(cart);
});

const removeItem = asyncHandeler(async (req, res) => {
  const { userId, product } = req.body;
  const cart = await cartService.removeProductFromCart(userId, product);
  res.status(StatusCodes.OK).json(cart);
});

const getRecentProducts = asyncHandeler(async (req, res) => {
  const { userId } = req.body;
  const cart = await cartService.getRecentProducts(userId);
  res.status(StatusCodes.OK).json(cart);
});

const getPageCart = asyncHandeler(async (req, res) => {
  const { userId } = req.body;
  const cart = await cartService.getPageCart(userId);
  res.status(StatusCodes.OK).json(cart);
});

export {
  createCart,
  updateQuantity,
  removeItem,
  getRecentProducts,
  getPageCart,
};
