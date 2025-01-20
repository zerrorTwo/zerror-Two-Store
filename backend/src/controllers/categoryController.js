import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { categoryService } from "../services/categoryService.js";

const getAllCategories = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getAllCategories(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const getAllCategoriesTree = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getAllCategoriesTree(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const getPageCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getPageCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const getChildCategories = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getChildCategories(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const createCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService.createCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const updateCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService.updateCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const deleteCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService.deleteCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const searchCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService.searchCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

export {
  getAllCategories,
  getAllCategoriesTree,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
  getPageCategory,
  getChildCategories,
};
