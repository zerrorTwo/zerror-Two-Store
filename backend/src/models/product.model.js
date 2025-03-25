import mongoose, { Schema } from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    variations: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    slug: { type: String, required: true },
    mainImg: { type: String, required: true },
    img: { type: Array },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    sold: { type: Number, required: true, default: 0 },
    status: { type: Boolean, required: true, default: true },
    type: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    variations: { type: Schema.Types.Mixed, required: false },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    tag: { type: Array },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
