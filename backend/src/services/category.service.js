import ApiError from "../utils/api.error.js";
import slugtify from "slugify";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { categoryRepository } from "../repositories/category.repository.js";


const getAllCategoriesTree = async (req, res) => {
  try {
    const allCategories = await categoryRepository.findAllCategories();

    const categoryMap = {};
    allCategories.forEach((category) => {
      categoryMap[category._id] = { ...category, children: [] };
    });

    const tree = [];
    allCategories.forEach((category) => {
      if (category.parent) {
        categoryMap[category.parent]?.children.push(categoryMap[category._id]);
      } else {
        tree.push(categoryMap[category._id]);
      }
    });

    return tree;
  } catch (error) {
    throw error;
  }
};

const getAllCategories = async () => {
  try {
    return await categoryRepository.findAllCategories();
  } catch (error) {
    throw error;
  }
};

const getPageCategory = async (parent, page, limit) => {
  try {
    const skip = (page - 1) * limit;

    let categories;
    if (parent === "null" || !parent) {
      categories = await categoryRepository.findCategoriesByParent(null, skip, limit);
    } else {
      categories = await categoryRepository.findCategoriesByParent(parent, skip, limit);
    }

    let totalCategories;
    if (parent !== "null") {
      totalCategories = await   categoryRepository.countCategoriesByParent(parent);
    } else {
      totalCategories = await categoryRepository.countCategoriesByParent(null);
    }

    return {
      page,
      limit,
      totalPages: Math.ceil(totalCategories / limit),
      totalCategories,
      categories,
    };
  } catch (error) {
    throw error;
  }
};

const getChildCategories = async (id) => {
  try {
    const parentCategory = await categoryRepository.findCategoryById(id);
    const childCategories = await categoryRepository.findChildCategories(parentCategory.children);
    return childCategories;
  } catch (error) {
    throw error;
  }
};

const createCategory = async (data) => {
  data.name = data.name.trim().toUpperCase();

  if (!data) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Data not found");
  }

  const categoryExist = await categoryRepository.findCategoryByName(data.name);

  if (categoryExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category already exists");
  }

  if (data.parent) {
    const parentCategory = await categoryRepository.findCategoryById(data.parent);
    if (!parentCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Parent category not found");
    }
    data.parent = parentCategory._id;
  }

  data.slug = slugtify(data.name, { lower: true, strict: true });
  const category = await categoryRepository.createNewCategory(data);

  if (data.parent) {
    await categoryRepository.updateCategoryChildren(data.parent, category._id);
  }

  return category;
};

const updateCategory = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid category ID");
  }

  const category = await categoryRepository.findCategoryById(id);
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const updateData = { ...category.toObject() };

  if (data.name && data.name.trim().toUpperCase() !== category.name) {
    const categoryExist = await categoryRepository.findCategoryByName(
      data.name.trim().toUpperCase()
    );
    if (categoryExist) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Category with this name already exists"
      );
    }
    updateData.name = data.name.trim().toUpperCase();
    updateData.slug = slugtify(data.name, { lower: true, strict: true });
  }

  if (data.img) updateData.img = data.img;
  if (data.description) updateData.description = data.description;

  const updatedCategory = await categoryRepository.updateCategoryById(id, updateData);

  return updatedCategory;
};

const deleteCategory = async (categories) => {
  if (!categories || categories.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Categories not found");
  }

  const deleteChildren = async (categoryId) => {
    const category = await categoryRepository.findCategoryById(categoryId);
    if (category && category.children && category.children.length > 0) {
      for (let childId of category.children) {
        await deleteChildren(childId);
      }
    }
    await categoryRepository.deleteCategoryById(categoryId);
  };

  for (let categoryId of categories) {
    const category = await categoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Category with ID ${categoryId} not found`
      );
    }

    if (category.children && category.children.length > 0) {
      for (let childId of category.children) {
        await deleteChildren(childId);
      }
    }

    await categoryRepository.deleteCategoryById(categoryId);

    if (category.parent) {
      const parentCategory = await categoryRepository.findCategoryById(category.parent);
      parentCategory.children = parentCategory.children.filter(
        (childId) => childId && childId.toString() !== categoryId
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
    return await findAllCategories();
  }
  try {
    const categories = await categoryRepository.findCategoriesByName(keyword);
    return categories;
  } catch (error) {
    throw new Error(`Error searching categories: ${error.message}`);
  }
};

const getCommonCategories = async () => {
  try {
    return await categoryRepository.findCommonCategories();
  } catch (error) {
    throw new Error(`Error find categories: ${error.message}`);
  }
};

export const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
  getPageCategory,
  getChildCategories,
  getAllCategoriesTree,
  getCommonCategories,
};
