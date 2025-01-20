import express from "express";
import {
  createCategory,
  deleteCategory,
  getPageCategory,
  getChildCategories,
  updateCategory,
  getAllCategories,
  getAllCategoriesTree,
} from "../../controllers/categoryController.js";
import { authentication, authorization } from "../../auth/authUtil.js";

const Router = express.Router();

Router.route("/all").get(getAllCategories);
Router.route("/tree").get(getAllCategoriesTree);

Router.route("/").get(getPageCategory);

// Router.use(authentication, authorization);

Router.route("/").delete(deleteCategory).post(createCategory);

Router.route("/:id").put(updateCategory).get(getChildCategories);

export const categoryRouter = Router;
