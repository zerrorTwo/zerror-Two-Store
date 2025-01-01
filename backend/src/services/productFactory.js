import ProductModel from "../models/productModel.js";
import { getInheritedAttributes } from "../helper/getInheritedAttributes.js";
import CategoryModel from "../models/categoryModel.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

class ProductFactory {
  static async createProduct(type, payload) {
    // Tìm Category dựa trên type
    const category = await CategoryModel.findOne({ name: type });

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Category ${type} not found`);
    } else {
      if (mongoose.models[type]) {
        delete mongoose.models[type];
      }
    }

    const inheritedAttributes = await getInheritedAttributes(category._id);

    const allAttributes = [...inheritedAttributes, ...category.attributes];

    const sanitizedAttributes = {};
    allAttributes.forEach((attr) => {
      sanitizedAttributes[attr.name] = attr.value;
    });

    const newProduct = new ProductModel({
      ...payload,
      attributes: sanitizedAttributes,
    });
    await newProduct.save();

    return newProduct;
  }
}

export default ProductFactory;
