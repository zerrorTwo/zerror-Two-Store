import { StatusCodes } from "http-status-codes";
import asyncHandler from "../middlewares/async.handler.js";
import { productService } from "../services/product.service.js";

const createProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  const product = await productService.createProduct(data);
  res.status(StatusCodes.CREATED).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const product = await productService.updateProduct(id, data);
  res.status(StatusCodes.OK).json(product);
});

const deleteManyProducts = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  const products = await productService.deleteManyProducts(_id);
  res.status(StatusCodes.OK).json(products);
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const product = await productService.getProductBySlug(slug);
  res.status(StatusCodes.OK).json(product);
});

const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await productService.getProductById(id);
  res.status(StatusCodes.OK).json(product);
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts(req, res);
  res.status(StatusCodes.OK).json(products);
});

const getPageProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
  const limit = parseInt(req.query.limit) || 10; // Mặc định là 10 sản phẩm mỗi trang
  const category = req.query.category || "";
  const search = req.query.search || "";
  const sort = req.query.sort || "";
  const minPrice = req.query.minPrice || undefined;
  const maxPrice = req.query.maxPrice || undefined;
  const rating = req.query.rating || undefined;

  const products = await productService.getPageProducts(
    page,
    limit,
    category,
    search,
    sort,
    minPrice,
    maxPrice,
    rating
  );

  res.status(StatusCodes.OK).json(products);
});

const getTopSoldProducts = asyncHandler(async (req, res) => {
  const products = await productService.getTopSoldProducts();
  res.status(StatusCodes.OK).json(products);
});

const getProductWithBreadcrumbById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const breadcrumb = await productService.getProductWithBreadcrumbById(
    productId
  );
  res.status(StatusCodes.OK).json({ breadcrumb });
});

const getRandomPageProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 30; // Mặc định là 30 sản phẩm ngẫu nhiên
  const randomProducts = await productService.getRandomPageProducts(limit);
  res.status(StatusCodes.OK).json(randomProducts);
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
  getProductWithBreadcrumbById,
  getRandomPageProducts,
};
