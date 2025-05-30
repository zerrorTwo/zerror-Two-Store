import { orderRepository } from "../repositories/order.repository.js";
import { reviewRepository } from "../repositories/review.repository.js";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";

const addReview = async (
  orderId,
  productId,
  userId,
  variations,
  rating,
  comment
) => {
  // Find the order
  const order = await orderRepository.findOrderById(orderId);
  if (!order) throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");

  // Find the product
  const product = await reviewRepository.findProductById(productId);
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");

  // Validate rating
  if (rating < 0 || rating > 5) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid rating value");
  }

  // Validate comment
  if (!comment || typeof comment !== "string" || comment.trim() === "") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Comment is required and must be a non-empty string"
    );
  }

  // Verify the product exists in the order and has canReview: true
  const orderProduct = order.products.find(
    (p) => p.productId.toString() === productId
  );
  if (!orderProduct) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Product not found in this order"
    );
  }

  // Verify the variation and canReview
  const variation = orderProduct.variations.find((v) => {
    // Assuming variations is a string like "color:Red" or an object
    const variationString = Object.entries(v.type)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
    return variationString === variations;
  });

  if (!variation) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Variation not found or cannot be reviewed"
    );
  }

  // Add the review
  const review = { userId, rating: Number(rating), comment, variations };
  const updatedProduct = await reviewRepository.addReviewToProduct(
    productId,
    review
  );

  // Update numReviews and rating
  updatedProduct.numReviews = updatedProduct.reviews.length;
  updatedProduct.rating =
    updatedProduct.reviews.reduce((acc, item) => item.rating + acc, 0) /
    updatedProduct.numReviews;

  await updatedProduct.save();

  await orderRepository.updateUserReview(orderId, productId, variation.type);
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
      ? (product.reviews.reduce((acc, item) => item.rating + acc, 0) -
          review.rating) /
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
