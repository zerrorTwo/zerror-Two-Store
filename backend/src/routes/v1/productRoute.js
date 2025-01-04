import express from "express";
import {
  createProduct,
  getAllProducts,
  getPageProducts,
  updateProduct,
} from "../../controllers/productController.js";

const Router = express.Router();
Router.route("/").post(createProduct).get(getPageProducts);
Router.route("/all").get(getAllProducts);
Router.route("/:id").put(updateProduct);

export const productRoute = Router;
