import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import categoryModel from "../models/categoryModel.js";

const getAllCategory = async (req, res) => {
  return await categoryModel.find({});
};

const createCategory = async (req, res) => {
  const data = req.body;
  data.name = data.name.trim().toUpperCase();
  // console.log(data.name.trim().toUpperCase());

  if (!data) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Data not found");
  }

  const categoryExist = await categoryModel.findOne({
    name: data.name,
  });

  if (categoryExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category already exists");
  }
  const category = new categoryModel(data);
  await category.save();
  return category;
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!id) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Id not found");
  }

  const category = await categoryModel.find({ id });
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const categoryNew = await categoryModel.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!categoryNew) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Data not found");
  }
  return categoryNew;
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Id not found");
  }

  const category = await categoryModel.findById(id);
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  console.log(category);

  const name = category.name;

  await categoryModel.deleteOne(category);

  return { message: `Category ${name} deleted successfully` };
};

export const categoryService = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
