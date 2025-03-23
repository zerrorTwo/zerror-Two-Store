import { orderRepository } from "../repositories/order.repository.js";
import { reviewRepository } from "../repositories/review.repository.js";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";

const addReview = async (orderId, productId, userId, rating, comment) => {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");

  const product = await reviewRepository.findProductById(productId);
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");

  const alreadyReviewed = product.reviews.some(
    (review) => review.userId.toString() === userId.toString()
  );
  if (alreadyReviewed) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Product already reviewed");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid rating value");
  }

  const review = { userId, rating: Number(rating), comment };
  const updatedProduct = await reviewRepository.addReviewToProduct(productId, review);

  // Cập nhật số lượng và điểm trung bình
  updatedProduct.numReviews = updatedProduct.reviews.length;
  updatedProduct.rating =
    updatedProduct.reviews.reduce((acc, item) => item.rating + acc, 0) /
    updatedProduct.numReviews;

  await updatedProduct.save();

  return review;
};

const getAllProductReviews = async (productId, page = 1, limit = 10) => {
  const product = await reviewRepository.getProductReviews(productId);
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");

  const total = product.reviews.length;
  const startIndex = (page - 1) * limit;
  const reviews = product.reviews.slice(startIndex, startIndex + limit);

  return { reviews, pagination: { total, page, limit } };
};

const deleteReview = async (productId, userId, reviewId) => {
  const product = await reviewRepository.findProductById(productId);
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");

  const review = product.reviews.find((r) => r._id.toString() === reviewId);
  if (!review) throw new ApiError(StatusCodes.NOT_FOUND, "Review not found");

  if (review.userId.toString() !== userId.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Not authorized");
  }

  await reviewRepository.removeReviewFromProduct(productId, reviewId);

  // Cập nhật số lượng và rating
  product.numReviews = product.reviews.length - 1;
  product.rating =
    product.numReviews > 0
      ? (product.reviews.reduce((acc, item) => item.rating + acc, 0) - review.rating) /
        product.numReviews
      : 0;

  await product.save();

  return { message: "Review removed" };
};

export const reviewService = {
  addReview,
  getAllProductReviews,
  deleteReview,
};
