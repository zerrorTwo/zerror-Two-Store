import express from "express";
import {
  createProduct,
  deleteManyProducts,
  getAllProducts,
  getPageProducts,
  getProductById,
  getProductBySlug,
  getTopSoldProducts,
  updateProduct,
} from "../../controllers/productController.js";
import { authentication, authorization } from "../../auth/authUtil.js";

const Router = express.Router();
Router.route("/").get(getPageProducts);
Router.route("/all").get(getAllProducts);
Router.route("/top").get(getTopSoldProducts);
Router.route("/:slug").get(getProductBySlug);
Router.route("/select/:id").get(getProductById);

Router.use(authentication, authorization);
Router.route("/").post(createProduct);
Router.route("/delete").delete(deleteManyProducts);
Router.route("/:id").put(updateProduct);

export const productRoute = Router;
