import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { categoryService } from "../services/categoryService.js";

const getAllCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getAllCategories(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const getAllCategoryParent = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getAllCategoriesParent(req, res);
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
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
  getAllCategoryParent,
  getChildCategories,
};
