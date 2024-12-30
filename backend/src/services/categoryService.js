import { StatusCodes } from "http-status-codes";
import CategoryModel from "../models/categoryModel.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import ProductModel from "../models/productModel.js";

const getAllCategory = async (req, res) => {
  return await CategoryModel.find({});
};

const createCategory = async (req, res) => {
  // console.log(req.body);

  const { name, attributes, parentName } = req.body;

  let inheritedAttributes = [];
  let parentId;

  if (parentName) {
    // Lấy attributes từ danh mục cha
    const parentCategory = await CategoryModel.findOne({ name: parentName });

    if (!parentCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Parent category not found");
    }
    inheritedAttributes = parentCategory.attributes;
    parentId = parentCategory._id;
  }

  // Hợp nhất attributes từ danh mục cha và mới
  const allAttributes = [...inheritedAttributes, ...attributes];

  // Tạo danh mục mới
  const newCategory = new CategoryModel({
    name: name,
    attributes: allAttributes,
    parentId: parentId,
  });
  await newCategory.save();

  // Tạo schema động
  const schemaFields = {};
  allAttributes.forEach((attr) => {
    schemaFields[attr.name] = {
      type: mongoose.Schema.Types[attr.type],
      required: attr.required,
    };
  });

  const categorySchema = new mongoose.Schema(schemaFields);
  const NewCategory = ProductModel.discriminator(name, categorySchema);

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

export const categoryService = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
