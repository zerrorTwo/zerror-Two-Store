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

const getAllCategoriesParent = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ parent: null });
    return categories;
  } catch (error) {
    throw error;
  }
};

const getChildCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const parentCategory = await CategoryModel.findById(id).lean();
    const childCategories = await CategoryModel.find({
      _id: { $in: parentCategory.children },
    });
    return childCategories;
  } catch (error) {
    throw error;
  }
};

const createCategory = async (req, res) => {
  const data = req.body;
  console.log(data);

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
  let parentCategory;
  if (data.parent) {
    data.parent = data.parent.trim().toUpperCase();
    parentCategory = await CategoryModel.findById({ _id: data.parent });
    data.parent = parentCategory._id;
  }

  data.slug = slugtify(data.name, { lower: true, strict: true });
  const category = new CategoryModel(data);
  await category.save();
  parentCategory?.children.push(category._id.toString());
  await parentCategory?.save();

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
  const categories = req.body; // Nhận mảng _id từ body request

  if (!categories || categories.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Categories not found");
  }

  // Hàm đệ quy để xóa tất cả danh mục con
  const deleteChildren = async (categoryId) => {
    const category = await CategoryModel.findById(categoryId);
    if (category && category.children && category.children.length > 0) {
      for (let childId of category.children) {
        await deleteChildren(childId); // Đệ quy xóa tất cả danh mục con
      }
    }
    // Xóa danh mục hiện tại
    await CategoryModel.findByIdAndDelete(categoryId); // Xóa danh mục
  };

  // Xóa từng danh mục trong mảng categories
  for (let categoryId of categories) {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Category with ID ${categoryId} not found`
      );
    }

    // Xóa tất cả danh mục con của danh mục chính
    if (category.children && category.children.length > 0) {
      for (let childId of category.children) {
        await deleteChildren(childId); // Đệ quy xóa tất cả danh mục con
      }
    }

    // Xóa danh mục chính
    await CategoryModel.findByIdAndDelete(categoryId); // Xóa danh mục chính

    // Cập nhật danh mục cha nếu có
    if (category.parent) {
      const parentCategory = await CategoryModel.findById(category.parent);
      parentCategory.children = parentCategory.children.filter(
        (childId) => childId && childId.toString() !== categoryId // Xóa ID danh mục hiện tại khỏi danh mục cha
      );
      await parentCategory.save();
    }
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
  getAllCategoriesParent,
  getChildCategories,
};
