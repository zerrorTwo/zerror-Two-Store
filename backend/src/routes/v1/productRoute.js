import express from "express";
import {
  createProduct,
  getAllProducts,
  getPageProducts,
  updateProduct,
} from "../../controllers/productController.js";

const Router = express.Router();
Router.route("/").post(createProduct).get(getPageProducts).put(updateProduct);
Router.route("/all").get(getAllProducts);

export const productRoute = Router;
