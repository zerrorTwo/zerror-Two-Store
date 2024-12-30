import { StatusCodes } from "http-status-codes";
import Category from "../models/categoryModelV2.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import ProductModel from "../models/productModel.js";
import ProductFactory from "./productFactory.js";

const createCategory = async (type, attributes) => {
  const existingCategory = await Category.findOne({ name: type });
  if (existingCategory) {
    throw new ApiError(StatusCodes.CONFLICT, `Category ${type} already exists`);
  }

  const newCategory = new Category({ name: type, attributes });
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
  ProductFactory.productRegistry[type] = NewCategory;

  return NewCategory;
};

export const categoryServiceV2 = { createCategory };
