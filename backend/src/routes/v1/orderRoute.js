import express from "express";
import { authentication } from "../../auth/authUtil.js";
import {
  createOrder,
  getProductCheckout,
  getUserOrder,
  getUserTotalOrder,
} from "../../controllers/orderController.js";

const Router = express.Router();

// Router.use(authentication);
Router.route("/").get(getProductCheckout).post(createOrder);
Router.route("/get-all").get(getUserOrder);
Router.route("/get-total").get(getUserTotalOrder);

export const orderRoute = Router;
