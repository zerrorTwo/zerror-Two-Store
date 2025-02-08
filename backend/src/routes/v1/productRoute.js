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

const Router = express.Router();
Router.route("/").post(createProduct).get(getPageProducts);
Router.route("/all").get(getAllProducts);
Router.route("/top").get(getTopSoldProducts);
Router.route("/delete").delete(deleteManyProducts);
Router.route("/:slug").get(getProductBySlug);
Router.route("/:id").put(updateProduct).get(getProductById);

export const productRoute = Router;
