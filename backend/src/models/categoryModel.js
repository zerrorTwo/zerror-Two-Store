import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    attributes: { type: [Schema.Types.Mixed], required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
