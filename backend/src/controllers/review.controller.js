import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import { reviewService } from "../services/review.service.js";

const addReview = asyncHandeler(async (req, res) => {
  const { orderId, productId, rating, comment, variations } = req.body;
  const userId = req.userId;
  const review = await reviewService.addReview(
    orderId,
    productId,
    userId,
    variations,
    rating,
    comment
  );
  res.status(StatusCodes.CREATED).json(review);
});

const deleteReview = asyncHandeler(async (req, res) => {
  const { productId, reviewId } = req.body;
  const userId = req.userId;
  const review = await reviewService.deleteReview(productId, userId, reviewId);
  res.status(StatusCodes.OK).json(review);
});

const getAllProductReviews = asyncHandeler(async (req, res) => {
  const { productId, page, limit } = req.query;
  const reviews = await reviewService.getAllProductReviews(
    productId,
    page,
    limit
  );
  res.status(StatusCodes.OK).json(reviews);
});

export { addReview, deleteReview, getAllProductReviews };
