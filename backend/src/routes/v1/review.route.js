import express from "express";
import {
  addReview,
  deleteReview,
  getAllProductReviews,
} from "../../controllers/review.controller.js";
import { authentication } from "../../auth/auth.util.js";

const Router = express.Router();

Router.route("/").get(getAllProductReviews);

Router.use(authentication);
Router.route("/").post(addReview);
Router.route("/delete").delete(deleteReview);

export const reviewRoute = Router;
