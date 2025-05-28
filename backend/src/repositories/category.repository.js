import Category from "../models/category.model.js";

const findCategoryByParent = async (parent) => {
  return await Category.find({ parent });
};

const findAllCategories = async () => {
  return await Category.find({}).lean();
};

const findCategoryById = async (id) => {
  return await Category.findById(id);
};

const findCategoryBySlug = async (slug) => {
  return await Category.findOne({ slug }).lean();
};

const findCategoryByName = async (name) => {
  return await Category.findOne({ name });
};

const createNewCategory = async (data) => {
  return await Category.create(data);
};

const updateCategoryById = async (id, updateData) => {
  return await Category.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

const deleteCategoryById = async (id) => {
  return await Category.findByIdAndDelete(id);
};

const deleteManyCategories = async (ids) => {
  return await Category.deleteMany({ _id: ids });
};

const findCategoriesByParent = async (parent, skip, limit) => {
  return await Category.find({ parent })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const countCategoriesByParent = async (parent) => {
  return await Category.countDocuments({ parent });
};

const findChildCategories = async (childrenIds) => {
  return await Category.find({ _id: { $in: childrenIds } });
};

const findCategoriesByName = async (name) => {
  return await Category.find({
    name: { $regex: name, $options: "i" },
  });
};

const findCommonCategories = async () => {
  return await Category.find({ parent: null }).lean();
};

const updateCategoryChildren = async (parentId, childId) => {
  return await Category.findByIdAndUpdate(
    parentId,
    { $push: { children: childId } },
    { new: true }
  );
};

export const categoryRepository = {
  findCategoryByParent,
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  findCategoryByName,
  createNewCategory,
  updateCategoryById,
  deleteCategoryById,
  deleteManyCategories,
  findCategoriesByParent,
  countCategoriesByParent,
  findChildCategories,
  findCategoriesByName,
  findCommonCategories,
  updateCategoryChildren,
};
