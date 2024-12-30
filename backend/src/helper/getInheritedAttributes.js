import mongoose from "mongoose";
import CategoryModel from "../models/categoryModel.js";

// Hàm lấy tất cả attributes kế thừa
export const getInheritedAttributes = async (categoryId) => {
  const pipeline = [
    {
      $match: { _id: mongoose.Types.ObjectId(categoryId) },
    },
    {
      $graphLookup: {
        from: "categories", // Tên collection
        startWith: "$parentId",
        connectFromField: "parentId",
        connectToField: "_id",
        as: "ancestors",
      },
    },
    {
      $unwind: "$ancestors",
    },
    {
      $project: { "ancestors.attributes": 1 },
    },
  ];

  const result = await CategoryModel.aggregate(pipeline);
  return result.flatMap((item) => item.ancestors.attributes);
};
