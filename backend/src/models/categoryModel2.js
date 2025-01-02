import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
});
const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
