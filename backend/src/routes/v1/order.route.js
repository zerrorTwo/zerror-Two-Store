import express from "express";
import { authentication } from "../../auth/auth.util.js";
import {
  createOrder,
  getProductCheckout,
  getUserOrder,
  getUserTotalOrder,
} from "../../controllers/order.controller.js";

const Router = express.Router();

// Router.use(authentication);
Router.route("/").get(getProductCheckout).post(createOrder);
Router.route("/get-all").get(getUserOrder);
Router.route("/get-total").get(getUserTotalOrder);

export const orderRoute = Router;
