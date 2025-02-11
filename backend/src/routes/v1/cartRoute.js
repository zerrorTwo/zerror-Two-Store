import express from "express";
import { authentication, authorization } from "../../auth/authUtil.js";
import {
  createCart,
  getPageCart,
  getRecentProducts,
  updateQuantity,
} from "../../controllers/cartController.js";

const Router = express.Router();

// Router.use(authentication, authorization);
Router.route("/").get(getPageCart).post(createCart).put(updateQuantity);
Router.route("/recent").get(getRecentProducts);

export const cartRoute = Router;
