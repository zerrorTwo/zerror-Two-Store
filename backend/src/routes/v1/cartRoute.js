import express from "express";
import { authentication, authorization } from "../../auth/authUtil.js";
import {
  createCart,
  getPageCart,
  getRecentProducts,
  removeItem,
  updateQuantity,
  updateVariation,
} from "../../controllers/cartController.js";

const Router = express.Router();

// Router.use(authentication, authorization);
Router.route("/")
  .get(getPageCart)
  .post(createCart)
  .put(updateQuantity)
  .delete(removeItem);
Router.route("/recent").get(getRecentProducts);
Router.route("/update-variation").put(updateVariation);

export const cartRoute = Router;
