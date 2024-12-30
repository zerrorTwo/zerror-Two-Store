import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { categoryServiceV2 } from "../services/categoryService.js";

const getAllCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryServiceV2.getAllCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const createCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryServiceV2.createCategory(
    req.body.name,
    req.body.attributes
  );
  res.status(StatusCodes.CREATED).json(categories);
});

const updateCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryServiceV2.updateCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

const deleteCategory = asyncHandeler(async (req, res) => {
  const categories = await categoryServiceV2.deleteCategory(req, res);
  res.status(StatusCodes.OK).json(categories);
});

// const searchCategory = asyncHandeler(async (req, res) => {
//   const categories = await categoryServiceV2.searchCategory(req, res);
//   res.status(StatusCodes.OK).json(categories);
// });

export { getAllCategory, createCategory, updateCategory, deleteCategory };
