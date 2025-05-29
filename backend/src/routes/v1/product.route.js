import express from "express";
import {
  createProduct,
  deleteManyProducts,
  getAllProducts,
  getPageProducts,
  getProductById,
  getProductBySlug,
  getProductWithBreadcrumbById,
  getRandomPageProducts,
  getTopSoldProducts,
  updateProduct,
} from "../../controllers/product.controller.js";
import { authentication, authorization } from "../../auth/auth.util.js";

const Router = express.Router();
Router.route("/").get(getPageProducts);
Router.route("/all").get(getAllProducts);
Router.route("/random").get(getRandomPageProducts);
Router.route("/top").get(getTopSoldProducts);
Router.route("/:slug").get(getProductBySlug);
Router.route("/select/:id").get(getProductById);
Router.route("/search").get(getPageProducts);
Router.route("/breadcrumb/:id").get(getProductWithBreadcrumbById);

Router.use(authentication, authorization);
Router.route("/").post(createProduct);
Router.route("/delete").delete(deleteManyProducts);
Router.route("/:id").put(updateProduct);

export const productRoute = Router;
