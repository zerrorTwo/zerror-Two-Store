import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import ProductFactory from "./productFactory.js";
import ProductModel from "../models/productModel.js";

const createProduct = async (type, payload) => {
  try {
    const newProduct = await ProductFactory.createProduct(type, payload);
    return newProduct;
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error creating product: ${error.message}`
    );
  }
};

const getProductsByCategory = async (type) => {
  const products = await ProductModel.find({ type });
  return products;
};

export const productServiceV2 = { createProduct, getProductsByCategory };
