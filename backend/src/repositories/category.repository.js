import Category from "../models/category.model.js";

export const findCategoryByParent = async (parent) => {
  return await Category.find({ parent });
};

export const findAllCategories = async () => {
  return await Category.find({}).lean();
};

export const findCategoryById = async (id) => {
  return await Category.findById(id);
};

export const findCategoryBySlug = async (slug) => {
  return await Category.findOne({ slug }).lean();
};

export const findCategoryByName = async (name) => {
  return await Category.findOne({ name });
};

export const createNewCategory = async (data) => {
  return await Category.create(data);
};

export const updateCategoryById = async (id, updateData) => {
  return await Category.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteCategoryById = async (id) => {
  return await Category.findByIdAndDelete(id);
};

export const deleteManyCategories = async (ids) => {
  return await Category.deleteMany({ _id: ids });
};

export const findCategoriesByParent = async (parent, skip, limit) => {
  return await Category.find({ parent })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countCategoriesByParent = async (parent) => {
  return await Category.countDocuments({ parent });
};

export const findChildCategories = async (childrenIds) => {
  return await Category.find({ _id: { $in: childrenIds } });
};

export const findCategoriesByName = async (name) => {
  return await Category.find({
    name: { $regex: name, $options: "i" },
  });
};

export const findCommonCategories = async () => {
  return await Category.find({ level: 1 }).limit(8);
};

export const updateCategoryChildren = async (parentId, childId) => {
  return await Category.findByIdAndUpdate(
    parentId,
    { $push: { children: childId } },
    { new: true }
  );
};
