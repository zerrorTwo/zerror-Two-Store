import {StatusCodes} from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import {cartService} from "../services/cart.service.js";

const createCart = asyncHandeler(async (req, res) => {
  const {products} = req.body;
  const cart = await cartService.addToCart(req.userId, products);
  res.status(StatusCodes.CREATED).json(cart);
});

const updateQuantity = asyncHandeler(async (req, res) => {
  const {product} = req.body;
  const cart = await cartService.updateUserCartQuantity(req.userId, product);
  res.status(StatusCodes.OK).json(cart);
});

const updateVariation = asyncHandeler(async (req, res) => {
  const {products} = req.body;
  const cart = await cartService.updateUserCartVariation(req.userId, products);
  res.status(StatusCodes.OK).json(cart);
});

const updateCheckout = asyncHandeler(async (req, res) => {
  const {products} = req.body;
  const cart = await cartService.updateCheckout(req.userId, products);
  res.status(StatusCodes.OK).json(cart);
});

const updateAllCheckout = asyncHandeler(async (req, res) => {
  const {checkoutState} = req.body;
  const cart = await cartService.updateAllCheckout(req.userId, checkoutState);
  res.status(StatusCodes.OK).json(cart);
});

const removeItem = asyncHandeler(async (req, res) => {
  const {products} = req.body;
  const cart = await cartService.removeProductFromCart(req.userId, products);
  res.status(StatusCodes.OK).json(cart);
});

const getRecentProducts = asyncHandeler(async (req, res) => {
  const cart = await cartService.getRecentProducts(req.userId);
  res.status(StatusCodes.OK).json(cart);
});

const getPageCart = asyncHandeler(async (req, res) => {
  const cart = await cartService.getPageCart(req.userId);
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
