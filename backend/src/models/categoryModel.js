import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
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
    required: true,
  },
  children: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Category" }],
    validate: {
      validator: function (value) {
        return value.length <= 2; // Giới hạn tối đa 2 phần tử
      },
      message: "Each category can have only 2 subcategories",
    },
  },
});

const CategoryModel =
  mongoose.models.category || mongoose.model("Category", categorySchema);

export default CategoryModel;
