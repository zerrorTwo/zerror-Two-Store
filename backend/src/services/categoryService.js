import { StatusCodes } from "http-status-codes";
import CategoryModel from "../models/categoryModel.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import ProductModel from "../models/productModel.js";

const getAllCategory = async (req, res) => {
  try {
    // Truy vấn danh mục gốc và các danh mục con của chúng
    const categories = await CategoryModel.aggregate([
      // Lọc danh mục gốc (không có parentId)
      {
        $match: {
          parentId: null, // Lọc danh mục không có parentId (danh mục gốc)
        },
      },
      // Tìm các danh mục con cho từng danh mục gốc
      {
        $lookup: {
          from: "categories", // Tên collection của danh mục (mặc định là plural hóa tên model)
          localField: "_id", // Trường _id của category
          foreignField: "parentId", // Trường parentId của danh mục con
          as: "children", // Tên của trường chứa danh mục con
        },
      },
      // Lọc ra các trường cần thiết bao gồm cả attributes
      {
        $project: {
          name: 1, // Trả về trường name
          attributes: 1, // Trả về trường attributes của category cha
          children: {
            _id: 1,
            name: 1,
            attributes: 1, // Trả về trường attributes của danh mục con
          },
        },
      },
    ]);

    return categories;
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Error fetching categories" });
  }
};

const createCategory = async (req, res) => {
  // console.log(req.body);

  const { name, attributes, parentName } = req.body;
  if (mongoose.models.name) {
    delete mongoose.models.name; // Xóa mô hình bị trùng
  }

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
