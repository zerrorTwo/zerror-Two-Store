import mongoose, { Schema } from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    thumb: { type: String, required: true },
    img: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      ref: "Category",
    },
    attributes: { type: Schema.Types.Mixed, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    tag: { type: Array },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
