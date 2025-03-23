import ProductModel from "../models/product.model.js";

const findProductById = async (productId) => {
  return await ProductModel.findById(productId);
};

const addReviewToProduct = async (productId, review) => {
  return await ProductModel.findByIdAndUpdate(
    productId,
    { $push: { reviews: review } },
    { new: true }
  );
};

const getProductReviews = async (productId) => {
  return await ProductModel.findById(productId)
    .select("reviews")
    .populate("reviews.userId", "userName");
};

const removeReviewFromProduct = async (productId, reviewId) => {
  return await ProductModel.findByIdAndUpdate(
    productId,
    { $pull: { reviews: { _id: reviewId } } },
    { new: true }
  );
};

export const reviewRepository = {
  findProductById,
  addReviewToProduct,
  getProductReviews,
  removeReviewFromProduct,
};
