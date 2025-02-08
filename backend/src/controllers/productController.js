import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
// import { productService } from "../services/productService.js";
import { productService } from "../services/productService.js";

const createProduct = asyncHandeler(async (req, res) => {
  const data = req.body;
  const product = await productService.createProduct(data);
  res.status(StatusCodes.CREATED).json(product);
});

const updateProduct = asyncHandeler(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const product = await productService.updateProduct(id, data);
  res.status(StatusCodes.CREATED).json(product);
});

const deleteManyProducts = asyncHandeler(async (req, res) => {
  const { _id } = req.body;
  const products = await productService.deleteManyProducts(_id);
  res.status(StatusCodes.CREATED).json(products);
});

const getProductBySlug = asyncHandeler(async (req, res) => {
  const slug = req.params.slug;
  const product = await productService.getProductBySlug(slug);
  res.status(StatusCodes.CREATED).json(product);
});

const getProductById = asyncHandeler(async (req, res) => {
  const id = req.params.id;
  const product = await productService.getProductById(id);
  res.status(StatusCodes.CREATED).json(product);
});

const getAllProducts = asyncHandeler(async (req, res) => {
  const products = await productService.getAllProducts(req, res);
  res.status(StatusCodes.CREATED).json(products);
});

const getPageProducts = asyncHandeler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
  const limit = parseInt(req.query.limit) || 10; // Mặc định là 10 sản phẩm mỗi trang

  const { category, search, sort } = req.query;
  const products = await productService.getPageProducts(
    page,
    limit,
    category,
    search,
    sort
  );

  res.status(StatusCodes.CREATED).json(products);
});

const getTopSoldProducts = asyncHandeler(async (req, res) => {
  const products = await productService.getTopSoldProducts();
  res.status(StatusCodes.CREATED).json(products);
});

export {
  createProduct,
  updateProduct,
  deleteManyProducts,
  getAllProducts,
  getPageProducts,
  getProductBySlug,
  getProductById,
  getTopSoldProducts,
};
