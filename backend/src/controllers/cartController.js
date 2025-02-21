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

const updateVariation = asyncHandeler(async (req, res) => {
  const { userId, products } = req.body;
  const cart = await cartService.updateUserCartVariation(userId, products);
  res.status(StatusCodes.OK).json(cart);
});

const updateCheckout = asyncHandeler(async (req, res) => {
  const { userId, products } = req.body;
  const cart = await cartService.updateCheckout(userId, products);
  res.status(StatusCodes.OK).json(cart);
});

const updateAllCheckout = asyncHandeler(async (req, res) => {
  const { userId, checkoutState } = req.body;
  const cart = await cartService.updateAllCheckout(userId, checkoutState);
  res.status(StatusCodes.OK).json(cart);
});

const removeItem = asyncHandeler(async (req, res) => {
  const { userId, products } = req.body;
  const cart = await cartService.removeProductFromCart(userId, products);
  res.status(StatusCodes.OK).json(cart);
});

const getRecentProducts = asyncHandeler(async (req, res) => {
  const { userId } = req.query;
  const cart = await cartService.getRecentProducts(userId);
  res.status(StatusCodes.OK).json(cart);
});

const getPageCart = asyncHandeler(async (req, res) => {
  const { userId } = req.query;
  const cart = await cartService.getPageCart(userId);
  res.status(StatusCodes.OK).json(cart);
});

export {
  createCart,
  updateQuantity,
  updateVariation,
  updateCheckout,
  removeItem,
  getRecentProducts,
  getPageCart,
  updateAllCheckout,
};
