import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
// import { productService } from "../services/productService.js";
import { productServiceV2 } from "../services/productServiceV2.js";

const createProduct = asyncHandeler(async (req, res) => {
  const product = await productServiceV2.createProduct(req.body.type, req.body);
  res.status(StatusCodes.CREATED).json(product);
});

export { createProduct };
