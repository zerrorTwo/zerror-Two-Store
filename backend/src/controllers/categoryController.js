import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { categoryService } from "../services/categoryServices.js";

const getAllCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryService.getAllCategory(req, res);
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

export { getAllCategory, createCategory, updateCategory, deleteCategory };
