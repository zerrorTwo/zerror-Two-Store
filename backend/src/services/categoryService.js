// import { StatusCodes } from "http-status-codes";
// import CategoryModel from "../models/categoryModel.js";
// import ApiError from "../utils/ApiError.js";
// import mongoose from "mongoose";
// import ProductModel from "../models/productModel.js";

// const getAllCategory = async (req, res) => {
//   try {
//     // Truy vấn danh mục gốc và các danh mục con của chúng
//     const categories = await CategoryModel.aggregate([
//       // Lọc danh mục gốc (không có parentId)
//       {
//         $match: {
//           parentId: null, // Lọc danh mục không có parentId (danh mục gốc)
//         },
//       },
//       // Tìm các danh mục con cho từng danh mục gốc
//       {
//         $lookup: {
//           from: "categories", // Tên collection của danh mục (mặc định là plural hóa tên model)
//           localField: "_id", // Trường _id của category
//           foreignField: "parentId", // Trường parentId của danh mục con
//           as: "children", // Tên của trường chứa danh mục con
//         },
//       },
//       // Lọc ra các trường cần thiết bao gồm cả attributes
//       {
//         $project: {
//           name: 1, // Trả về trường name
//           attributes: 1, // Trả về trường attributes của category cha
//           children: {
//             _id: 1,
//             name: 1,
//             attributes: 1, // Trả về trường attributes của danh mục con
//           },
//         },
//       },
//     ]);

//     return categories;
//   } catch (err) {
//     console.error(err);
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ message: "Error fetching categories" });
//   }
// };

// const createCategory = async (req, res) => {
//   try {
//     const { name, attributes, parentName } = req.body;

//     const exits = await CategoryModel.findOne({ name: name });

//     if (exits) {
//       throw new ApiError(StatusCodes.CONFLICT, "Category already exists");
//     }
//     if (ProductModel.discriminator[name]) {
//       console.log(123);
//       delete ProductModel.discriminator[name];
//     }

//     let parentId;

//     if (parentName) {
//       // Lấy attributes từ danh mục cha
//       const parentCategory = await CategoryModel.findOne({ name: parentName });

//       if (!parentCategory) {
//         throw new ApiError(StatusCodes.NOT_FOUND, "Parent category not found");
//       }
//       parentId = parentCategory._id;
//     }

//     // Tạo danh mục mới
//     const newCategory = new CategoryModel({
//       name: name,
//       attributes: attributes,
//       parentId: parentId,
//     });
//     await newCategory.save();

//     // Tạo schema động
//     const schemaFields = {};
//     attributes.forEach((attr) => {
//       schemaFields[attr.name] = {
//         type: mongoose.Schema.Types[attr.type],
//         required: attr.required,
//       };
//     });

//     const categorySchema = new mongoose.Schema(schemaFields);
//     const NewCategory = ProductModel.discriminator(name, categorySchema);

//     return { NewCategory, newCategory };
//   } catch (error) {
//     throw error;
//   }
// };

// const updateCategory = async (req, res) => {
//   const { id } = req.params;
//   const { data } = req.body;

//   if (!id) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "Id not found");
//   }

//   const category = await CategoryModel.findById(id);
//   if (!category) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
//   }

//   const categoryNew = await CategoryModel.findByIdAndUpdate(id, data, {
//     new: true,
//   });
//   // console.log(categoryNew);

//   if (!categoryNew) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "Data not found");
//   }
//   return categoryNew;
// };

// const deleteCategory = async (req, res) => {
//   const { id } = req.params;

//   if (!id) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "Id not found");
//   }

//   // Tìm danh mục cha
//   const category = await CategoryModel.findById(id);
//   if (!category) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
//   }

//   const name = category.name;
//   delete mongoose.models[name];

//   // Tìm và xóa tất cả danh mục con có parentId là danh mục này
//   const subCategories = await CategoryModel.find({ parentId: id });
//   if (subCategories.length > 0) {
//     await CategoryModel.deleteMany({ parentId: id });
//   }

//   // Xóa danh mục cha
//   await CategoryModel.deleteOne({ _id: id });
//   if (ProductModel.discriminator[name]) {
//     delete ProductModel.discriminator[name];
//   }

//   return `Category ${name} deleted successfully`;
// };

// export const categoryService = {
//   getAllCategory,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// };
