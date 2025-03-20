import express from "express";
import { authentication, authorization } from "../../auth/auth.util.js";
import {
  createOrder,
  getAllOrders,
  getProductCheckout,
  getUserOrder,
  getUserTotalOrder,
} from "../../controllers/order.controller.js";

const Router = express.Router();

// Router.use(authentication);
Router.route("/").get(getProductCheckout).post(createOrder);
Router.route("/get-all").get(getUserOrder);
Router.route("/get-total").get(getUserTotalOrder);

// Router.use(authorization);
Router.route("/all").get(getAllOrders);

export const orderRoute = Router;
