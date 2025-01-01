import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { categoryService2 } from "../services/categoryService2.js";

const getAllCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService2.getAllCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const createCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService2.createCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const updateCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService2.updateCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const deleteCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService2.deleteCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const searchCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService2.searchCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

export {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
};
