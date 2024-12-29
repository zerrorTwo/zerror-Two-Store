import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { productService } from "../services/productService.js";

const createProduct = asyncHandeler(async (req, res) => {
  const product = await productService.createProduct(req.body.type, req.body);
  res.status(StatusCodes.CREATED).json(product);
});

export { createProduct };
