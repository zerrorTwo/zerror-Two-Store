import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 100,
    unique: true,
  },
  slug: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  img: {
    type: String,
    trim: true,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 3,
  },
  children: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Category" }],
  },
});

const Category =
  mongoose.models.category || mongoose.model("Category", categorySchema);

export default Category;
