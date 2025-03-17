import express from "express";
import {
  createCategory,
  deleteCategory,
  getPageCategory,
  getChildCategories,
  updateCategory,
  getAllCategories,
  getAllCategoriesTree,
  getCommonCategories,
} from "../../controllers/category.controller.js";
import { authentication, authorization } from "../../auth/auth.util.js";

const Router = express.Router();

Router.route("/all").get(getAllCategories);
Router.route("/tree").get(getAllCategoriesTree);

Router.route("/").get(getPageCategory);
Router.route("/common").get(getCommonCategories);

Router.use(authentication, authorization);

Router.route("/").delete(deleteCategory).post(createCategory);

Router.route("/:id").put(updateCategory).get(getChildCategories);

export const categoryRoute = Router;
