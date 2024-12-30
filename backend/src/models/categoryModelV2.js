import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    attributes: { type: [Schema.Types.Mixed], required: true },
  },
  { timestamps: true }
);

const Category = mongoose.model("CategoryV2", categorySchema);

export default Category;
