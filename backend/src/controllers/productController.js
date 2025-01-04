import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
// import { productService } from "../services/productService.js";
import { productService } from "../services/productService.js";

const createProduct = asyncHandeler(async (req, res) => {
  const product = await productService.createProduct(req, res);
  res.status(StatusCodes.CREATED).json(product);
});

const updateProduct = asyncHandeler(async (req, res) => {
  const product = await productService.updateProduct(req, res);
  // console.log(product);

  res.status(StatusCodes.CREATED).json(product);
});

const getAllProducts = asyncHandeler(async (req, res) => {
  const products = await productService.getAllProducts(req, res);
  res.status(StatusCodes.CREATED).json(products);
});

const getPageProducts = asyncHandeler(async (req, res) => {
  const products = await productService.getPageProducts(req, res);

  res.status(StatusCodes.CREATED).json(products);
});

export { createProduct, updateProduct, getAllProducts, getPageProducts };
