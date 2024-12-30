import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../../controllers/categoryController.js";

const Router = express.Router();

Router.route("/").post(createCategory).get(getAllCategory);
Router.route("/:id").put(updateCategory).delete(deleteCategory);

export const categoryRouter = Router;
