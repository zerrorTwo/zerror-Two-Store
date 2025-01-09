import ApiError from "../utils/ApiError.js";
import slugtify from "slugify";
import { StatusCodes } from "http-status-codes";
import CategoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import mongoose from "mongoose";

const getCategoryTree = async (parent = null) => {
  const categories = await CategoryModel.find({ parent }).select("-__v").lean();
  const tree = await Promise.all(
    categories.map(async (category) => {
      const children = await getCategoryTree(category._id); // Lấy danh mục con
      return {
        ...category,
        children,
      };
    })
  );
  return tree;
};

const getAllCategories = async (req, res) => {
  try {
    const categoryTree = await getCategoryTree();
    return categoryTree;
  } catch (error) {
    throw error;
  }
};

const createCategory = async (req, res) => {
  const data = req.body;

  data.name = data.name.trim().toUpperCase();

  if (!data) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Data not found");
  }

  data.name = data.name.trim().toUpperCase();

  const categoryExist = await CategoryModel.findOne({
    name: data.name,
  });

  if (categoryExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category already exists");
  }

  if (data.parent) {
    data.parent = data.parent.trim().toUpperCase();
    const parentCategory = await CategoryModel.findOne({ name: data.parent });
    if (!parentCategory)
      throw new ApiError(StatusCodes.NOT_FOUND, "Parent category not found");
    data.parent = parentCategory._id;

    parentCategory.children.push(categoryExist ? categoryExist._id : null);
    await parentCategory.save();
  }

  data.slug = slugtify(data.name, { lower: true, strict: true });
  const category = new CategoryModel(data);
  await category.save();
  return category;
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid category ID");
  }

  const category = await CategoryModel.findById(id);
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  // Nếu đổi tên, kiểm tra sự tồn tại
  if (data.name && data.name.trim().toUpperCase() !== category.name) {
    const categoryExist = await CategoryModel.findOne({
      name: data.name.trim().toUpperCase(),
    });
    if (categoryExist) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Category with this name already exists"
      );
    }
    category.name = data.name.trim().toUpperCase();
    category.slug = slugify(data.name, { lower: true, strict: true });
  }
  // Cập nhật các trường khác nếu có
  if (data.img) category.img = data.img;
  if (data.description) category.description = data.description;

  await category.save();

  return category;
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra ID hợp lệ
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid category ID");
  }

  // Tìm danh mục cần xóa
  const category = await CategoryModel.findById(id);
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  // Hàm đệ quy để xóa tất cả danh mục con
  const deleteChildren = async (categoryId) => {
    const category = await CategoryModel.findById(categoryId);
    if (category && category.children && category.children.length > 0) {
      for (let childId of category.children) {
        await deleteChildren(childId); // Đệ quy xóa tất cả danh mục con
      }
    }
    // Thay thế remove bằng findByIdAndDelete
    await CategoryModel.findByIdAndDelete(categoryId); // Xóa danh mục hiện tại
  };

  // Xóa các danh mục con của danh mục chính
  if (category.children.length > 0) {
    for (let childId of category.children) {
      await deleteChildren(childId); // Xóa từng danh mục con
    }
  }

  // Xóa danh mục chính (danh mục cần xóa)
  await CategoryModel.findByIdAndDelete(id); // Xóa danh mục

  // Cập nhật danh mục cha nếu có
  if (category.parent) {
    const parentCategory = await CategoryModel.findById(category.parent);
    parentCategory.children = parentCategory.children.filter(
      (childId) => childId && childId.toString() !== id // Kiểm tra childId có phải là null hay không
    );
    await parentCategory.save();
  }

  return { message: "Category deleted successfully" };
};

const searchCategory = async (req, res) => {
  let { keyword } = req.query;
  keyword = keyword.trim().toUpperCase();
  if (keyword === undefined) {
    return await CategoryModel.find({});
  }
  try {
    const categories = await CategoryModel.find({
      name: { $regex: keyword },
    });

    return categories;
  } catch (error) {
    throw new Error(`Error searching categories: ${error.message}`);
  }
};

export const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
};
