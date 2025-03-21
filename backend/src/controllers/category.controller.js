import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import { categoryService } from "../services/category.service.js";

const getAllCategories = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getAllCategories(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const getCommonCategories = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getCommonCategories();
  res.status(StatusCodes.OK).json(categories);
});

const getAllCategoriesTree = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getAllCategoriesTree(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const getPageCategory = asyncHandeler(async (req, res) => {
  const parent = req.query.parent;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const categories = await categoryService.getPageCategory(parent, page, limit);
  res.status(StatusCodes.OK).json(categories);
});

const getChildCategories = asyncHandeler(async (req, res) => {
  const { id } = req.params;
  const categories = await categoryService.getChildCategories(id);
  res.status(StatusCodes.OK).json(categories);
});

const createCategory = asyncHandeler(async (req, res) => {
  const data = req.body;
  const categories = await categoryService.createCategory(data);
  res.status(StatusCodes.CREATED).json(categories);
});

const updateCategory = asyncHandeler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const categories = await categoryService.updateCategory(id, data);
  res.status(StatusCodes.OK).json(categories);
});

const deleteCategory = asyncHandeler(async (req, res) => {
  const category = req.body;
  const categories = await categoryService.deleteCategory(category);
  res.status(StatusCodes.OK).json(categories);
});

const searchCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService.searchCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

export {
  getAllCategories,
  getAllCategoriesTree,
  getCommonCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
  getPageCategory,
  getChildCategories,
};
