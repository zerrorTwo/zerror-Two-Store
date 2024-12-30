import { StatusCodes } from "http-status-codes";
import CategoryModel from "../models/categoryModelV2.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import ProductModel from "../models/productModel.js";

const getAllCategory = async (req, res) => {
  return await CategoryModel.find({});
};

const createCategory = async (type, attributes) => {
  const newCategory = new CategoryModel({ name: type, attributes });
  await newCategory.save();

  const schemaFields = {};
  attributes.forEach((attr) => {
    schemaFields[attr.name] = {
      type: mongoose.Schema.Types[attr.type],
      required: attr.required,
    };
  });

  const categorySchema = new mongoose.Schema(schemaFields);

  const NewCategory = ProductModel.discriminator(type, categorySchema);
  return { NewCategory, newCategory };
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!id) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Id not found");
  }

  const category = await CategoryModel.find({ id });
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const categoryNew = await CategoryModel.findByIdAndUpdate(id, data, {
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

  const category = await CategoryModel.findById(id);
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const name = category.name;

  await CategoryModel.deleteOne(category);

  return { message: `Category ${name} deleted successfully` };
};

export const categoryServiceV2 = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
